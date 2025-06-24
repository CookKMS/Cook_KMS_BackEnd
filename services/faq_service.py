from models.faq import Faq
from db_init import db
from datetime import datetime

def create_faq(data):
    title = data.get("title")
    content = data.get("content")
    category_code = data.get("category_code")
    file_path = data.get("file_path")

    if not title or not content or not category_code:
        return {"message": "필수 항목이 누락되었습니다."}, 400

    faq = Faq(
        title=title,
        content=content,
        category_code=category_code,
        file_path=file_path
    )
    db.session.add(faq)
    db.session.commit()
    return {"message": "FAQ가 등록되었습니다.", "faq_id": faq.id}, 201

def get_all_faqs():
    faqs = Faq.query.order_by(Faq.created_at.desc()).all()
    result = [
        {
            "id": f.id,
            "title": f.title,
            "content": f.content,
            "category_code": f.category_code,
            "file_path": f.file_path,
            "created_at": f.created_at,
            "updated_at": f.updated_at
        }
        for f in faqs
    ]
    return result, 200

def get_faq_detail(faq_id):
    faq = Faq.query.get(faq_id)
    if not faq:
        return {"message": "FAQ를 찾을 수 없습니다."}, 404

    result = {
        "id": faq.id,
        "title": faq.title,
        "content": faq.content,
        "category_code": faq.category_code,
        "file_path": faq.file_path,
        "created_at": faq.created_at,
        "updated_at": faq.updated_at
    }
    return result, 200

def get_faqs_by_category(category_code):
    faqs = Faq.query.filter_by(category_code=category_code).order_by(Faq.created_at.desc()).all()
    result = [
        {
            "id": f.id,
            "title": f.title,
            "content": f.content,
            "category_code": f.category_code,
            "file_path": f.file_path,
            "created_at": f.created_at,
            "updated_at": f.updated_at
        }
        for f in faqs
    ]
    return result, 200

def update_faq(faq_id, data):
    faq = Faq.query.get(faq_id)
    if not faq:
        return {"message": "FAQ를 찾을 수 없습니다."}, 404

    faq.title = data.get("title", faq.title)
    faq.content = data.get("content", faq.content)
    faq.category_code = data.get("category_code", faq.category_code)
    faq.file_path = data.get("file_path", faq.file_path)
    faq.updated_at = datetime.utcnow()

    db.session.commit()
    return {"message": "FAQ가 수정되었습니다."}, 200

def delete_faq(faq_id):
    faq = Faq.query.get(faq_id)
    if not faq:
        return {"message": "FAQ를 찾을 수 없습니다."}, 404

    db.session.delete(faq)
    db.session.commit()
    return {"message": "FAQ가 삭제되었습니다."}, 200
