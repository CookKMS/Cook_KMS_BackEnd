#사용자 인증 라우트 정의
from flask import Blueprint, request, jsonify, g
from services.auth_service import register_user, login_user
from utils.decorators import jwt_required, role_required

auth_bp = Blueprint("auth_bp", __name__)

# 회원가입
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    return register_user(data)

#로그인
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    return login_user(data)


# 내 정보 조회
@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me():
    user = g.user
    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role.value,
        "employee_number": user.employee_number
    }), 200

# 사용자 전용
@auth_bp.route("/user-only", methods=["GET"])
@jwt_required
@role_required("user")
def user_only():
    return jsonify({"message": "사용자 전용 페이지입니다."}), 200

# 직원 전용
@auth_bp.route("/employee-only", methods=["GET"])
@jwt_required
@role_required("employee")
def employee_only():
    return jsonify({"message": "직원 전용 페이지입니다."}), 200

# 관리자 전용
@auth_bp.route("/admin-only", methods=["GET"])
@jwt_required
@role_required("admin")
def admin_only():
    return jsonify({"message": "관리자 전용 페이지입니다."}), 200
