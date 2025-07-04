from flask import Blueprint, request, jsonify, g
from utils.decorators import custom_jwt_required, role_required
from services.knowledge_service import (
    create_knowledge_entry,
    list_knowledge_entries,
    get_knowledge_detail,
    update_knowledge_entry,
    delete_knowledge_entry
)
from werkzeug.utils import secure_filename
import os
import uuid

knowledge_bp = Blueprint("knowledge_bp", __name__, url_prefix="/api/knowledge")

# ✅ 지식 등록 (직원, 관리자만 가능)
@knowledge_bp.route("/create", methods=["POST"])
@custom_jwt_required
@role_required("employee", "admin")
def create_knowledge():
    user = g.user

    # ✅ FormData에서 필드 추출
    title = request.form.get("title")
    content = request.form.get("content")
    category_code = request.form.get("category_code")
    file = request.files.get("file")

    # ✅ 파일 저장 처리
    file_path = None
    if file:
        # 확장자 보존하면서 UUID 파일명 생성
        ext = os.path.splitext(file.filename)[1]  # 예: .jpg, .png
        unique_filename = str(uuid.uuid4()) + ext
        upload_dir = os.path.join("uploads", "knowledge")
        os.makedirs(upload_dir, exist_ok=True)
        save_path = os.path.join(upload_dir, unique_filename)
        file.save(save_path)

        # 경로 저장 시 슬래시統일 (Windows에서도 안전)
        file_path = save_path.replace("\\", "/")

    # ✅ 전달 데이터 구성
    data = {
        "title": title,
        "content": content,
        "category_code": category_code,
        "file_path": file_path
    }

    return create_knowledge_entry(user.id, data)

# ✅ 지식 목록 조회 (직원, 관리자)
@knowledge_bp.route("/", methods=["GET"])
@custom_jwt_required
@role_required("employee", "admin")
def list_knowledge():
    return list_knowledge_entries()

# ✅ 지식 상세 조회
@knowledge_bp.route("/<int:knowledge_id>", methods=["GET"])
@custom_jwt_required
@role_required("employee", "admin")
def get_knowledge(knowledge_id):
    return get_knowledge_detail(knowledge_id)

# ✅ 지식 수정
@knowledge_bp.route("/<int:knowledge_id>", methods=["PUT"])
@custom_jwt_required
@role_required("employee", "admin")
def update_knowledge(knowledge_id):
    user = g.user
    data = request.json
    return update_knowledge_entry(knowledge_id, user.id, data)

# ✅ 지식 삭제
@knowledge_bp.route("/<int:knowledge_id>", methods=["DELETE"])
@custom_jwt_required
@role_required("employee", "admin")
def delete_knowledge(knowledge_id):
    user = g.user
    return delete_knowledge_entry(knowledge_id, user.id)
