from flask import Blueprint, request, jsonify, current_app
from utils.decorators import role_required
from utils.decorators import jwt_required  # ✅ 이렇게 되어 있어야 함

from services.faq_service import (
    create_faq, get_all_faqs, get_faq_detail,
    get_faqs_by_category, update_faq, delete_faq
)
import os
from werkzeug.utils import secure_filename

faq_bp = Blueprint("faq_bp", __name__, url_prefix="/api/faq")

@faq_bp.route("/create", methods=["POST"])
@jwt_required
@role_required("admin")
def create_faq_route():
    # ✅ multipart/form-data 처리
    title = request.form.get("title")
    content = request.form.get("content")
    category = request.form.get("category")
    file = request.files.get("file")  # 선택적 파일 처리

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)  # 디렉토리 없으면 생성

    file_path = None
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

    # ✅ 전달 형식 유지: 서비스 계층에 dict 형태로 전달
    data = {
        "title": title,
        "content": content,
        "category": category,
        "file_path": file_path  # 필요 시 서비스에서 파일 저장 처리
    }

    print("✅ 최종 전달 데이터:", data)

    result, status = create_faq(data)
    return jsonify(result), status

@faq_bp.route("/", methods=["GET"])
@jwt_required
@role_required("user", "employee", "admin")
def get_all_faqs_route():
    result, status = get_all_faqs()
    return jsonify(result), status

@faq_bp.route("/category/<string:category>", methods=["GET"])
@jwt_required
@role_required("user", "employee", "admin")
def get_faqs_by_category_route(category):
    result, status = get_faqs_by_category(category)
    return jsonify(result), status

@faq_bp.route("/<int:faq_id>", methods=["GET"])
@jwt_required
@role_required("user", "employee", "admin")
def get_faq_detail_route(faq_id):
    result, status = get_faq_detail(faq_id)
    return jsonify(result), status

@faq_bp.route("/<int:faq_id>", methods=["PUT"])
@jwt_required
@role_required("admin")
def update_faq_route(faq_id):
    data = request.json
    result, status = update_faq(faq_id, data)
    return jsonify(result), status

@faq_bp.route("/<int:faq_id>", methods=["DELETE"])
@jwt_required
@role_required("admin")
def delete_faq_route(faq_id):
    result, status = delete_faq(faq_id)
    return jsonify(result), status

