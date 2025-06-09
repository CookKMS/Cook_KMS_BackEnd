# 인증 관련 데코레이터 정의 모듈
# JWT 인증, 권한 확인 등의 공통 데코레이터 함수 포함
from functools import wraps
from flask import request, jsonify, g
from models.user import User
from config import Config
import jwt

# 인증 데코레이터
def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "인증 토큰이 없습니다."}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            user = User.query.get(payload["user_id"])
            if not user:
                return jsonify({"message": "존재하지 않는 사용자입니다."}), 404

            g.user = user  # 유저 정보 전역 저장
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "토큰이 만료되었습니다."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "유효하지 않은 토큰입니다."}), 401

        return f(*args, **kwargs)
    return decorated_function

# 특정 역할만 접근 가능
def role_required(*roles):
    def wrapper(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(g, "user"):
                return jsonify({"message": "인증되지 않은 사용자입니다."}), 401

            if g.user.role.value not in roles:
                return jsonify({"message": "접근 권한이 없습니다."}), 403

            return f(*args, **kwargs)
        return decorated_function
    return wrapper