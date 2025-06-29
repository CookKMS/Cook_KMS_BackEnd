from flask import jsonify
from db_init import db
from models.inquiry import Inquiry
from models.knowledge import Knowledge
from models.faq import Faq
from models.common import Code  

# 공통코드 매핑 함수
def load_code_map(code_type):
    codes = Code.query.filter_by(code_type=code_type).all()
    return {code.code_key: code.code_value for code in codes}  

# 관리자 대시보드 통계 요약
def get_dashboard_summary():
    knowledge_count = Knowledge.query.count()
    waiting_inquiry_count = Inquiry.query.filter_by(status="01").count()
    faq_count = Faq.query.count()
    return jsonify({
        "knowledge_count": knowledge_count,
        "waiting_inquiry_count": waiting_inquiry_count,
        "faq_count": faq_count
    }), 200

# 지식 문서 목록 (카테고리명 포함)
def get_paginated_knowledge_list(page, per_page=5):
    pagination = Knowledge.query.order_by(Knowledge.updated_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    category_map = load_code_map('knowledge_category')

    data = [
        {
            "id": k.id,
            "title": k.title,
            "category": k.category,
            "category_name": category_map.get(k.category, ""),
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

# 문의 목록 (카테고리명 + 상태명 포함)
def get_paginated_inquiry_list(page, keyword="", category=None, per_page=5):
    query = Inquiry.query

    if keyword:
        query = query.filter(Inquiry.title.ilike(f"%{keyword}%"))
    if category:
        query = query.filter(Inquiry.category == category)

    pagination = query.order_by(Inquiry.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    category_map = load_code_map('inquiry_category')
    status_map = load_code_map('answer_status')

    data = [
        {
            "id": i.id,
            "title": i.title,
            "username": i.user.username,
            "category": i.category,
            "category_name": category_map.get(i.category, ""),
            "status": i.status,
            "status_name": status_map.get(i.status, ""),
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

# FAQ 목록 (카테고리명 포함)
def get_paginated_faq_list(page, keyword="", category=None, per_page=5):
    query = Faq.query

    if keyword:
        query = query.filter(Faq.title.ilike(f"%{keyword}%"))
    if category:
        query = query.filter(Faq.category == category)

    pagination = query.order_by(Faq.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    category_map = load_code_map('faq_category')

    data = [
        {
            "id": f.id,
            "title": f.title,
            "category": f.category,
            "category_name": category_map.get(f.category, "")
        }
        for f in pagination.items
    ]
    return jsonify({
        "items": data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200
