from flask import Blueprint, request, jsonify, g
from utils.decorators import custom_jwt_required, role_required
from services.inquiry_service import (
    create_inquiry, get_all_inquiries, get_inquiry_detail,
    get_inquiries_by_category, update_inquiry, delete_inquiry
)

inquiry_bp = Blueprint("inquiry_bp", __name__, url_prefix="/api/inquiry")

@inquiry_bp.route("", methods=["POST"])
@custom_jwt_required
@role_required("user", "employee")
def register_inquiry():
    user_id = g.user.id

    # ✅ FormData에서 값 추출
    title = request.form.get("title")
    content = request.form.get("content")
    category_code = request.form.get("category")
    customer = request.form.get("customer")  # ❗ 실제 DB에는 없지만 프론트에선 존재
    file = request.files.get("file")

    # ✅ 파일 저장 처리
    file_path = None
    if file:
        from werkzeug.utils import secure_filename
        import os
        filename = secure_filename(file.filename)
        upload_dir = os.path.join("uploads", "inquiries")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)

    # ✅ 서비스 함수 호출
    result, status = create_inquiry(user_id, title, content, category_code, file_path)
    return jsonify(result), status


@inquiry_bp.route("", methods=["GET"])
@custom_jwt_required
@role_required("user", "employee", "admin")
def get_all():
    result, status = get_all_inquiries()
    return jsonify(result), status

@inquiry_bp.route("/category/<string:category_code>", methods=["GET"])
@custom_jwt_required
@role_required("user", "employee", "admin")
def get_by_category(category_code):
    result, status = get_inquiries_by_category(category_code)
    return jsonify(result), status

@inquiry_bp.route("/<int:inquiry_id>", methods=["GET"])
@custom_jwt_required
@role_required("user", "employee", "admin")
def get_detail(inquiry_id):
    result, status = get_inquiry_detail(inquiry_id)
    return jsonify(result), status

@inquiry_bp.route("/<int:inquiry_id>", methods=["PUT"])
@custom_jwt_required
@role_required("user", "employee")
def update(inquiry_id):
    print(">> g.user.id:", g.user.id) # 토큰 주입시 인증 여부 디버그
    print(">> g.user.role:", g.user.role)
    user = g.user
    data = request.json
    result, status = update_inquiry(inquiry_id, user.id, data)
    return jsonify(result), status

@inquiry_bp.route("/<int:inquiry_id>", methods=["DELETE"])
@custom_jwt_required
@role_required("user", "employee")
def delete(inquiry_id):
    user = g.user
    result, status = delete_inquiry(inquiry_id, user.id)
    return jsonify(result), status