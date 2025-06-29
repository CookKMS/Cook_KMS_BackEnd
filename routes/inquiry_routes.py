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
    user = g.user
    data = request.json
    result, status = create_inquiry(user.id, data)
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