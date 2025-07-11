from models.inquiry import Inquiry
from db_init import db
from datetime import datetime
from services.my_inquiry_service import get_user_role  # 권한 확인 함수 사용


def create_inquiry(user_id, title, content, category_code, file_path):
    print(">> inquiry 생성 요청 도착:", title, category_code)

    if not title or not content or not category_code:
        return {"message": "필수 항목이 누락되었습니다."}, 400

    inquiry = Inquiry(
        title=title,
        content=content,
        category_code=category_code,
        file_path=file_path,
        user_id=user_id,
        status="01"  # 대기중
    )
    db.session.add(inquiry)
    db.session.commit()
    return {"message": "문의가 등록되었습니다.", "inquiry_id": inquiry.id}, 201


def get_all_inquiries():
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    result = [_serialize(i) for i in inquiries]
    return result, 200

def get_inquiry_detail(inquiry_id):
    inquiry = Inquiry.query.get(inquiry_id)
    if not inquiry:
        return {"message": "문의글을 찾을 수 없습니다."}, 404
    return _serialize(inquiry), 200

def get_inquiries_by_category(category_code):
    inquiries = Inquiry.query.filter_by(category_code=category_code).order_by(Inquiry.created_at.desc()).all()
    result = [_serialize(i) for i in inquiries]
    return result, 200



def update_inquiry(inquiry_id, user_id, data):
    inquiry = Inquiry.query.get(inquiry_id)
    if not inquiry:
        return {"message": "문의글을 찾을 수 없습니다."}, 404

    role = get_user_role(user_id)
    if inquiry.user_id != user_id and role != "admin":
        return {"message": "본인만 수정할 수 있습니다."}, 403

    # 필드 업데이트
    inquiry.title = data.get("title", inquiry.title)
    inquiry.content = data.get("content", inquiry.content)
    inquiry.category_code = data.get("category_code", inquiry.category_code)
    inquiry.status = data.get("status", inquiry.status)
    inquiry.file_path = data.get("file_path", inquiry.file_path)
    inquiry.updated_at = datetime.utcnow()
    db.session.commit()

    return {"message": "문의가 수정되었습니다."}, 200


def delete_inquiry(inquiry_id, user_id):
    inquiry = Inquiry.query.get(inquiry_id)
    if not inquiry:
        return {"message": "문의글을 찾을 수 없습니다."}, 404
    if inquiry.user_id != user_id:
        return {"message": "본인만 삭제할 수 있습니다."}, 403

    db.session.delete(inquiry)
    db.session.commit()
    return {"message": "문의가 삭제되었습니다."}, 200

def _serialize(inquiry):
    latest_comment = (
        sorted(inquiry.comments, key=lambda c: c.created_at)
        [-1].content if inquiry.comments else None
    )

    return {
        "id": inquiry.id,
        "title": inquiry.title,
        "content": inquiry.content,
        "category_code": inquiry.category_code,
        "file_path": inquiry.file_path,
        "user_id": inquiry.user_id,
        "status": inquiry.status,
        "created_at": inquiry.created_at,
        "updated_at": inquiry.updated_at,
        "answer": latest_comment  # ✅ 추가된 관리자 답변 필드
    }

