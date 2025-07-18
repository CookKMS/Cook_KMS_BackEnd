from flask import Blueprint, request
from utils.decorators import custom_jwt_required
from services.admin_dashboard_service import (
    get_dashboard_summary,
    get_paginated_knowledge_list,
    get_paginated_inquiry_list,
    get_paginated_faq_list
)

admin_dashboard_bp = Blueprint('admin_dashboard_bp', __name__, url_prefix="/api/admin/dashboard")

# 요약 통계: 지식 문서 수, 답변 대기 문의 수, FAQ 수
@admin_dashboard_bp.route('', methods=['GET'])
@custom_jwt_required
def dashboard_summary():
    return get_dashboard_summary()

# 지식 문서 목록 (페이지네이션)
@admin_dashboard_bp.route('/knowledge', methods=['GET'])
@custom_jwt_required
def dashboard_knowledge():
    page = int(request.args.get('page', 1))
    return get_paginated_knowledge_list(page)

# 문의 목록 (페이지네이션 + 키워드/카테고리 필터)
@admin_dashboard_bp.route('/inquiry', methods=['GET'])
@custom_jwt_required
def dashboard_inquiry():
    page = int(request.args.get('page', 1))
    keyword = request.args.get('keyword', '')
    category = request.args.get('category')
    return get_paginated_inquiry_list(page, keyword, category)

# FAQ 목록 (페이지네이션 + 키워드/카테고리 필터)
@admin_dashboard_bp.route('/faq', methods=['GET'])
@custom_jwt_required
def dashboard_faq():
    page = int(request.args.get('page', 1))
    keyword = request.args.get('keyword', '')
    category = request.args.get('category')
    return get_paginated_faq_list(page, keyword, category)