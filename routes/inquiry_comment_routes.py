from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.decorators import role_required
from services.inquiry_comment_service import (
    create_comment,
    get_comments_by_inquiry,
    update_comment,
    delete_comment
)

inquiry_comment_bp = Blueprint("inquiry_comment_bp", __name__, url_prefix="/api/inquiry")


# 댓글(답변) 등록 – 관리자만
@inquiry_comment_bp.route("/<int:inquiry_id>/comment", methods=["POST"])
@jwt_required()
@role_required("admin")
def add_comment(inquiry_id):
    user = get_jwt_identity()
    data = request.json
    result, status = create_comment(inquiry_id, user["id"], data)
    return jsonify(result), status

# 댓글 목록 조회 – 전체 사용자 가능
@inquiry_comment_bp.route("/<int:inquiry_id>/comments", methods=["GET"])
@jwt_required()
def get_comments(inquiry_id):
    result, status = get_comments_by_inquiry(inquiry_id)
    return jsonify(result), status

# 댓글 수정 – 관리자만
@inquiry_comment_bp.route("/comment/<int:comment_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def edit_comment(comment_id):
    data = request.json
    result, status = update_comment(comment_id, data)
    return jsonify(result), status

# 댓글 삭제 – 관리자만
@inquiry_comment_bp.route("/comment/<int:comment_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def remove_comment(comment_id):
    result, status = delete_comment(comment_id)
    return jsonify(result), status
