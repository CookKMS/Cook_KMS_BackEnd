# admin_dashboard_service.py
from models.inquiry import Inquiry
from models.knowledge import Knowledge
from models.faq import Faq
from db_init import db
from flask import jsonify

def get_dashboard_summary():
    knowledge_count = Knowledge.query.count()
    waiting_inquiry_count = Inquiry.query.filter_by(status="01").count()
    faq_count = Faq.query.count()
    return jsonify({
        "knowledge_count": knowledge_count,
        "waiting_inquiry_count": waiting_inquiry_count,
        "faq_count": faq_count
    }), 200

def get_paginated_knowledge_list(page, per_page=5):
    pagination = Knowledge.query.order_by(Knowledge.updated_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    data = [
        {
            "id": k.id,
            "title": k.title,
            "category_code": k.category_code,
            "updated_at": k.updated_at
        }
        for k in pagination.items
    ]
    return jsonify({
        "items": data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200

def get_paginated_inquiry_list(page, keyword="", category=None, per_page=5):
    query = Inquiry.query

    if keyword:
        query = query.filter(Inquiry.title.ilike(f"%{keyword}%"))
    if category:
        query = query.filter(Inquiry.category_code == category)

    pagination = query.order_by(Inquiry.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    data = [
        {
            "id": i.id,
            "title": i.title,
            "username": i.user.username,
            "status": i.status,
            "created_at": i.created_at
        }
        for i in pagination.items
    ]
    return jsonify({
        "items": data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200

def get_paginated_faq_list(page, keyword="", category=None, per_page=5):
    query = Faq.query

    if keyword:
        query = query.filter(Faq.title.ilike(f"%{keyword}%"))
    if category:
        query = query.filter(Faq.category_code == category)

    pagination = query.order_by(Faq.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    data = [
        {
            "id": f.id,
            "title": f.title,
            "category_code": f.category_code
        }
        for f in pagination.items
    ]
    return jsonify({
        "items": data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200
