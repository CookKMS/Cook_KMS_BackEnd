from flask import Blueprint, request, jsonify
from utils.decorators import jwt_required, role_required
from models.faq import Faq
from db_init import db
from services.files_service import delete_files_by_board

faq_bp = Blueprint("faq_bp", __name__)

# FAQ 등록 (관리자만 가능)
@faq_bp.route("/create", methods=["POST"])
@jwt_required
@role_required("admin")
def create_faq():
    data = request.json
    title = data.get("title")
    category = data.get("category")
    content = data.get("content")
    file_path = data.get("file_path")

    if not title or not category or not content:
        return jsonify({"message": "필수 항목이 누락되었습니다."}), 400

    faq = Faq(
        title=title,
        category=category,
        content=content,
        file_path=file_path
    )
    db.session.add(faq)
    db.session.commit()

    return jsonify({"message": "FAQ가 등록되었습니다.", "faq_id": faq.id}), 201

# FAQ 전체 조회 (user, employee, admin 모두 가능)
@faq_bp.route("/", methods=["GET"])
@jwt_required
@role_required("user", "employee", "admin")
def get_all_faqs():
    faqs = Faq.query.order_by(Faq.created_at.desc()).all()
    result = [
        {
            "id": f.id,
            "title": f.title,
            "category": f.category,
            "content": f.content,
            "file_path": f.file_path,
            "created_at": f.created_at,
            "updated_at": f.updated_at
        }
        for f in faqs
    ]
    return jsonify(result), 200

# FAQ 상세 조회 (user, employee, admin)
@faq_bp.route("/<int:faq_id>", methods=["GET"])
@jwt_required
@role_required("user", "employee", "admin")
def get_faq_detail(faq_id):
    faq = Faq.query.get(faq_id)
    if not faq:
        return jsonify({"message": "FAQ를 찾을 수 없습니다."}), 404

    result = {
        "id": faq.id,
        "title": faq.title,
        "category": faq.category,
        "content": faq.content,
        "file_path": faq.file_path,
        "created_at": faq.created_at,
        "updated_at": faq.updated_at
    }
    return jsonify(result), 200

# FAQ 삭제 (관리자만 가능)
@faq_bp.route("/<int:faq_id>", methods=["DELETE"])
@jwt_required
@role_required("admin")
def delete_faq(faq_id):
    faq = Faq.query.get(faq_id)
    if not faq:
        return jsonify({"message": "FAQ를 찾을 수 없습니다."}), 404

    db.session.delete(faq)
    db.session.commit()

    # board_code '02'는 FAQ용 코드
    delete_files_by_board("02", faq_id)

    return jsonify({"message": "FAQ 및 첨부 파일이 삭제되었습니다."}), 200
