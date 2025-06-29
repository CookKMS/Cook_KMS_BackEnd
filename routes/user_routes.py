# 사용자 정보 조회 라우트 정의
from flask import Blueprint, jsonify
from utils.decorators import custom_jwt_required, role_required
from models.user import User

user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# 사용자 전체 목록 조회 (관리자만 가능)
@user_bp.route("/", methods=["GET"])
@custom_jwt_required
@role_required("admin")
def list_users():
    users = User.query.order_by(User.id.asc()).all()
    result = [
        {
            "id": user.id,
            "username": user.username,
            "role": user.role.value,
            "employee_number": user.employee_number,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        for user in users
    ]
    return jsonify(result), 200
