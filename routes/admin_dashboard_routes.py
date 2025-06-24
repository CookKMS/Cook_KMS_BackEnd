# admin_dashboard_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.decorators import role_required
from services.admin_dashboard_service import (
    get_dashboard_summary,
    get_paginated_knowledge_list,
    get_paginated_inquiry_list,
    get_paginated_faq_list
)

admin_dashboard_bp = Blueprint("admin_dashboard_bp", __name__, url_prefix="/api/admin")

@admin_dashboard_bp.route("/summary", methods=["GET"])
@jwt_required()
@role_required("admin")
def dashboard_summary():
    return get_dashboard_summary()

@admin_dashboard_bp.route("/knowledge", methods=["GET"])
@jwt_required()
@role_required("admin")
def knowledge_list():
    page = int(request.args.get("page", 1))
    return get_paginated_knowledge_list(page)

@admin_dashboard_bp.route("/inquiries", methods=["GET"])
@jwt_required()
@role_required("admin")
def inquiry_list():
    page = int(request.args.get("page", 1))
    keyword = request.args.get("search", "")
    category = request.args.get("category_code")
    return get_paginated_inquiry_list(page, keyword, category)

@admin_dashboard_bp.route("/faqs", methods=["GET"])
@jwt_required()
@role_required("admin")
def faq_list():
    page = int(request.args.get("page", 1))
    keyword = request.args.get("search", "")
    category = request.args.get("category_code")
    return get_paginated_faq_list(page, keyword, category)
