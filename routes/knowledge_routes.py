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

knowledge_bp = Blueprint("knowledge_bp", __name__, url_prefix="/api/knowledge")

# ✅ 지식 등록 (직원, 관리자만 가능)
@knowledge_bp.route("/create", methods=["POST"])
@custom_jwt_required
@role_required("employee", "admin")
def create_knowledge():
    user = g.user  # ✅ get_jwt_identity → g.user

    # ✅ FormData에서 필드 추출
    title = request.form.get("title")
    content = request.form.get("content")
    category = request.form.get("category")
    file = request.files.get("file")

    # ✅ 파일 저장 처리
    file_path = None
    if file:
        filename = secure_filename(file.filename)
        upload_dir = os.path.join("uploads", "knowledge")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)

    # ✅ 서비스 함수에 전달할 데이터 구성
    data = {
        "title": title,
        "content": content,
        "category": category,
        "file_path": file_path
    }

    return create_knowledge_entry(user.id, data)

# ✅ 지식 목록 조회 (직원, 관리자만)
@knowledge_bp.route("/", methods=["GET"])
@custom_jwt_required
@role_required("employee", "admin")
def list_knowledge():
    return list_knowledge_entries()

# ✅ 지식 상세 조회 (직원, 관리자만)
@knowledge_bp.route("/<int:knowledge_id>", methods=["GET"])
@custom_jwt_required
@role_required("employee", "admin")
def get_knowledge(knowledge_id):
    return get_knowledge_detail(knowledge_id)

# ✅ 지식 수정 (작성자만 가능)
@knowledge_bp.route("/<int:knowledge_id>", methods=["PUT"])
@custom_jwt_required
@role_required("employee", "admin")
def update_knowledge(knowledge_id):
    user = g.user  # ✅ 수정
    data = request.json
    return update_knowledge_entry(knowledge_id, user.id, data)

# ✅ 지식 삭제 (작성자 또는 관리자만 가능)
@knowledge_bp.route("/<int:knowledge_id>", methods=["DELETE"])
@custom_jwt_required
@role_required("employee", "admin")
def delete_knowledge(knowledge_id):
    user = g.user  # ✅ 수정
    return delete_knowledge_entry(knowledge_id, user.id)