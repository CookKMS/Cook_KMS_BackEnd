# 지식 등록 및 상세 조회 라우트 정의
from flask import Blueprint, request, jsonify
from utils.decorators import jwt_required, role_required
from services.knowledge_service import (
    create_knowledge_entry,
    list_knowledge_entries,
    get_knowledge_detail,
    update_knowledge_entry,
    delete_knowledge_entry
)

knowledge_bp = Blueprint("knowledge_bp", __name__)

# 지식 등록 (직원, 관리자만 가능)
@knowledge_bp.route("/create", methods=["POST"])
@jwt_required
@role_required("employee", "admin")
def create_knowledge():
    data = request.json
    return create_knowledge_entry(data)

# 지식 목록 조회 (직원, 관리자)
@knowledge_bp.route("/", methods=["GET"])
@jwt_required
@role_required("employee", "admin")
def list_knowledge():
    return list_knowledge_entries()

# 지식 상세 조회 (직원, 관리자)
@knowledge_bp.route("/<int:knowledge_id>", methods=["GET"])
@jwt_required
@role_required("employee", "admin")
def get_knowledge(knowledge_id):
    return get_knowledge_detail(knowledge_id)

# 지식 수정 (작성자만 가능)
@knowledge_bp.route("/<int:knowledge_id>", methods=["PUT"])
@jwt_required
@role_required("employee", "admin")
def update_knowledge(knowledge_id):
    data = request.json
    return update_knowledge_entry(knowledge_id, data)

# 지식 삭제 (작성자 또는 관리자만 가능)
@knowledge_bp.route("/<int:knowledge_id>", methods=["DELETE"])
@jwt_required
@role_required("employee", "admin")
def delete_knowledge(knowledge_id):
    return delete_knowledge_entry(knowledge_id)