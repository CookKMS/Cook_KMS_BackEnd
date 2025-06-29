from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from utils.decorators import custom_jwt_required, role_required
from services.knowledge_service import (
    create_knowledge_entry,
    list_knowledge_entries,
    get_knowledge_detail,
    update_knowledge_entry,
    delete_knowledge_entry
)

knowledge_bp = Blueprint("knowledge_bp", __name__, url_prefix="/api/knowledge")

# 지식 등록 (직원, 관리자만 가능)
@knowledge_bp.route("/create", methods=["POST"])
@custom_jwt_required
@role_required("employee", "admin")
def create_knowledge():
    user = get_jwt_identity()
    data = request.json
    return create_knowledge_entry(user["id"], data)

# 지식 목록 조회 (직원, 관리자만)
@knowledge_bp.route("/", methods=["GET"])
@custom_jwt_required
@role_required("employee", "admin")
def list_knowledge():
    return list_knowledge_entries()

# 지식 상세 조회 (직원, 관리자만)
@knowledge_bp.route("/<int:knowledge_id>", methods=["GET"])
@custom_jwt_required
@role_required("employee", "admin")
def get_knowledge(knowledge_id):
    return get_knowledge_detail(knowledge_id)

# 지식 수정 (작성자만 가능)
@knowledge_bp.route("/<int:knowledge_id>", methods=["PUT"])
@custom_jwt_required
@role_required("employee", "admin")
def update_knowledge(knowledge_id):
    user = get_jwt_identity()
    data = request.json
    return update_knowledge_entry(knowledge_id, user["id"], data)

# 지식 삭제 (작성자 또는 관리자만 가능)
@knowledge_bp.route("/<int:knowledge_id>", methods=["DELETE"])
@custom_jwt_required
@role_required("employee", "admin")
def delete_knowledge(knowledge_id):
    user = get_jwt_identity()
    return delete_knowledge_entry(knowledge_id, user["id"])
