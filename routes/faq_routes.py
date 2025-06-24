from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.decorators import role_required
from services.faq_service import (
    create_faq, get_all_faqs, get_faq_detail,
    get_faqs_by_category, update_faq, delete_faq
)

faq_bp = Blueprint("faq_bp", __name__, url_prefix="/api/faq")

@faq_bp.route("/create", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_faq_route():
    data = request.json
    result, status = create_faq(data)
    return jsonify(result), status

@faq_bp.route("/", methods=["GET"])
@jwt_required()
@role_required("user", "employee", "admin")
def get_all_faqs_route():
    result, status = get_all_faqs()
    return jsonify(result), status

@faq_bp.route("/category/<string:category_code>", methods=["GET"])
@jwt_required()
@role_required("user", "employee", "admin")
def get_faqs_by_category_route(category_code):
    result, status = get_faqs_by_category(category_code)
    return jsonify(result), status

@faq_bp.route("/<int:faq_id>", methods=["GET"])
@jwt_required()
@role_required("user", "employee", "admin")
def get_faq_detail_route(faq_id):
    result, status = get_faq_detail(faq_id)
    return jsonify(result), status

@faq_bp.route("/<int:faq_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_faq_route(faq_id):
    data = request.json
    result, status = update_faq(faq_id, data)
    return jsonify(result), status

@faq_bp.route("/<int:faq_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_faq_route(faq_id):
    result, status = delete_faq(faq_id)
    return jsonify(result), status

