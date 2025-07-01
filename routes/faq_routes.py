from flask import Blueprint, request, jsonify, current_app
from utils.decorators import custom_jwt_required, role_required
from services.faq_service import (
    create_faq, get_all_faqs, get_faq_detail,
    get_faqs_by_category, update_faq, delete_faq
)
import os
from werkzeug.utils import secure_filename

faq_bp = Blueprint("faq_bp", __name__, url_prefix="/api/faq")

# 🔹 FAQ 등록
@faq_bp.route("/create", methods=["POST"])
@custom_jwt_required
@role_required("admin")
def create_faq_route():
    title = request.form.get("title")
    content = request.form.get("content")
    category_code = request.form.get("category")  # ✅ key 수정됨
    file = request.files.get("file")

    upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads/faqs")
    os.makedirs(upload_folder, exist_ok=True)

    file_path = None
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

    # 🔸 키 맞춰서 서비스에 전달
    data = {
        "title": title,
        "content": content,
        "category_code": category_code,  # ✅ 수정된 키명
        "file_path": file_path
    }

    result, status = create_faq(data)
    return jsonify(result), status

# 🔹 전체 조회
@faq_bp.route("/", methods=["GET"])
@custom_jwt_required
@role_required("user", "employee", "admin")
def get_all_faqs_route():
    result, status = get_all_faqs()
    return jsonify(result), status

# 🔹 카테고리별 조회
@faq_bp.route("/category/<string:category_code>", methods=["GET"])
@custom_jwt_required
@role_required("user", "employee", "admin")
def get_faqs_by_category_route(category_code):
    result, status = get_faqs_by_category(category_code)
    return jsonify(result), status

# 🔹 상세 조회
@faq_bp.route("/<int:faq_id>", methods=["GET"])
@custom_jwt_required
@role_required("user", "employee", "admin")
def get_faq_detail_route(faq_id):
    result, status = get_faq_detail(faq_id)
    return jsonify(result), status

# 🔹 수정
@faq_bp.route("/<int:faq_id>", methods=["PUT"])
@custom_jwt_required
@role_required("admin")
def update_faq_route(faq_id):
    data = request.get_json()
    result, status = update_faq(faq_id, data)
    return jsonify(result), status

# 🔹 삭제
@faq_bp.route("/<int:faq_id>", methods=["DELETE"])
@custom_jwt_required
@role_required("admin")
def delete_faq_route(faq_id):
    result, status = delete_faq(faq_id)
    return jsonify(result), status
