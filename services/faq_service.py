from models.faq import Faq
from db_init import db
from datetime import datetime
from flask import jsonify


def create_faq(data):
    title = data.get("title")
    content = data.get("content")
    category = data.get("category")
    file_path = data.get("file_path")

    print("📌 [create_faq] title:", title)
    print("📌 [create_faq] content:", content)
    print("📌 [create_faq] category:", category)

    if not title or not content or not category:
        return {"message": "필수 항목이 누락되었습니다."}, 400

    faq = Faq(
        title=title,
        content=content,
        category=category,
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
            "category": f.category,
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
        "category": faq.category,
        "file_path": faq.file_path,
        "created_at": faq.created_at,
        "updated_at": faq.updated_at
    }
    return result, 200

def get_faqs_by_category(category):
    faqs = Faq.query.filter_by(category=category).order_by(Faq.created_at.desc()).all()
    result = [
        {
            "id": f.id,
            "title": f.title,
            "content": f.content,
            "category": f.category,
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
    faq.category = data.get("category", faq.category)
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
