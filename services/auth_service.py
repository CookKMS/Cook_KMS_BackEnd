# 사용자 인증 관련 서비스 로직 정의
# 로그인, 토큰 검증 등 처리
from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User, RoleEnum
from db_init import db
from config import Config
import jwt
import datetime

# 회원가입 처리
def register_user(data):
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    employee_number = data.get("employee_number")
    admin_key = data.get("admin_key")

    if not username or not password or not role:
        return jsonify({"message": "필수 항목이 누락되었습니다."}), 400

    if role == "employee" and not employee_number:
        return jsonify({"message": "사원번호가 필요합니다."}), 400

    if role == "admin" and admin_key != Config.ADMIN_SIGNUP_KEY:
        return jsonify({"message": "관리자 인증키가 잘못되었습니다."}), 403

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "이미 존재하는 사용자입니다."}), 409

    hashed_pw = generate_password_hash(password)

    user = User(
        username=username,
        password=hashed_pw,
        role=RoleEnum(role),
        employee_number=employee_number if role == "employee" else None
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"{role} 가입 성공!"}), 201

# 로그인 처리 + JWT 발급
def login_user(data):
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "아이디와 비밀번호를 입력하세요."}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "잘못된 로그인 정보입니다."}), 401

    payload = {
        "user_id": user.id,
        "username": user.username,
        "role": user.role.value,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=Config.JWT_EXPIRATION_DELTA)
    }

    token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return jsonify({
        "access_token": token,
        "role": user.role.value,
        "user_id": user.id
    }), 200
