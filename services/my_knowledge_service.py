from db_init import db
from models.knowledge import Knowledge
from models.user import User
from models.common import Code

# 사용자 역할 조회
def get_user_role(user_id):
    user = db.session.query(User).filter_by(id=user_id).first()
    return user.role if user else None

# 코드맵 생성 (code_key → code_name)
def load_code_map(code_type):
    codes = db.session.query(Code).filter_by(code_type=code_type).all()
    return {code.code_key: code.code_value for code in codes}
# 내 지식 문서 목록 조회 (EMPLOYEE만 가능, category 코드명 포함)
def get_my_knowledge(user_id, page, size):
    role = get_user_role(user_id)
    if role != 'employee':
        return {'error': '사내 임직원만 접근할 수 있습니다.'}

    offset = (page - 1) * size
    total = db.session.query(Knowledge).filter_by(writer_id=user_id).count()

    knowledge_list = (
        db.session.query(Knowledge)
        .filter_by(writer_id=user_id)
        .order_by(Knowledge.created_at.desc())
        .limit(size)
        .offset(offset)
        .all()
    )

    category_map = load_code_map('knowledge_category')

    result = []
    for k in knowledge_list:
        result.append({
            'id': k.id,
            'title': k.title,
            'content': k.content,
            'category_code': k.category_code,
            'category_name': category_map.get(k.category_code, ''),
            'file_path': k.file_path,
            'created_at': k.created_at.isoformat()
        })

    return {
        'total': total,
        'page': page,
        'size': size,
        'knowledge_list': result
    }

# 내 지식 문서 수정 (EMPLOYEE만 가능)
def update_my_knowledge(user_id, knowledge_id, title, content):
    role = get_user_role(user_id)
    if role != 'employee':
        return False

    try:
        knowledge = db.session.query(Knowledge).filter_by(id=knowledge_id, writer_id=user_id).first()
        if not knowledge:
            return False

        knowledge.title = title
        knowledge.content = content
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        return False

# 내 지식 문서 삭제 (EMPLOYEE만 가능)
def delete_my_knowledge(user_id, knowledge_id):
    role = get_user_role(user_id)
    if role != 'employee':
        return False

    try:
        knowledge = db.session.query(Knowledge).filter_by(id=knowledge_id, writer_id=user_id).first()
        if not knowledge:
            return False

        db.session.delete(knowledge)
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        return False
