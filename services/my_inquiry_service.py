from db_init import db
from models.inquiry import Inquiry
from models.user import User
from models.common import Code

# 사용자 역할 조회
def get_user_role(user_id):
    user = db.session.query(User).filter_by(id=user_id).first()
    return user.role if user else None

# 코드맵 생성 (code_key → code_value)
def load_code_map(code_type):
    codes = db.session.query(Code).filter_by(code_type=code_type).all()
    return {code.code_key: code.code_value for code in codes}

# 🔧 댓글 포함 직렬화 함수
# my_inquiry_service.py 내 _serialize 함수 수정
def _serialize(inquiry):
    # 🔹 가장 최신 댓글의 내용을 answer로 추가
    latest_answer = (
        sorted(inquiry.comments, key=lambda c: c.created_at)[-1].content
        if inquiry.comments else None
    )

    return {
        "id": inquiry.id,
        "title": inquiry.title,
        "content": inquiry.content,
        "category_code": inquiry.category_code,
        "status": inquiry.status,
        "file_path": inquiry.file_path,
        "user_id": inquiry.user_id,
        "created_at": inquiry.created_at.isoformat(),
        "updated_at": inquiry.updated_at.isoformat() if inquiry.updated_at else None,
        "answer": latest_answer,  # ✅ 이 필드를 반드시 포함시켜야 함
        "comments": [  # ✅ 기존 구조 유지
            {
                "comment_id": c.id,
                "admin_id": c.admin_id,
                "content": c.content,
                "created_at": c.created_at.isoformat()
            }
            for c in inquiry.comments
        ]
    }


# 내 문의 목록 조회 (ADMIN 차단 + 코드명 매핑)
def get_my_inquiries(user_id, page, size):
    role = get_user_role(user_id)
    if role == 'admin':
        return {'error': '관리자는 접근할 수 없습니다.'}

    offset = (page - 1) * size
    total = db.session.query(Inquiry).filter_by(user_id=user_id).count()

    inquiries = (
        db.session.query(Inquiry)
        .filter_by(user_id=user_id)
        .order_by(Inquiry.created_at.desc())
        .limit(size)
        .offset(offset)
        .all()
    )

    # 공통 코드 매핑
    category_map = load_code_map('inquiry_category')
    status_map = load_code_map('answer_status')

    result = []
    for inquiry in inquiries:
        item = _serialize(inquiry)
        item['category_name'] = category_map.get(inquiry.category_code, '')
        item['status_name'] = status_map.get(inquiry.status, '')
        result.append(item)

    return {
        'total': total,
        'page': page,
        'size': size,
        'inquiries': result
    }

def update_my_inquiry(user_id, inquiry_id, title, content):
    role = get_user_role(user_id)
    if role == 'admin':
        return False

    try:
        inquiry = db.session.query(Inquiry).filter_by(id=inquiry_id, user_id=user_id).first()
        if not inquiry:
            return False

        inquiry.title = title
        inquiry.content = content
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        return False

def delete_my_inquiry(user_id, inquiry_id):
    role = get_user_role(user_id)
    if role == 'admin':
        return False

    try:
        inquiry = db.session.query(Inquiry).filter_by(id=inquiry_id, user_id=user_id).first()
        if not inquiry:
            return False

        db.session.delete(inquiry)
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        return False
