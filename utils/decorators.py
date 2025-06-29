
from functools import wraps
from flask import request, jsonify, g
from models.user import User
from config import Config
import jwt


def custom_jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "인증 토큰이 누락되었거나 형식이 잘못되었습니다."}), 401

        token = auth_header.removeprefix("Bearer ").strip()  # Python 3.9+

        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "토큰이 만료되었습니다."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "유효하지 않은 토큰입니다."}), 401

        user = User.query.get(payload.get("user_id"))
        if not user:
            return jsonify({"message": "존재하지 않는 사용자입니다."}), 404

        g.user = user
        return f(*args, **kwargs)
    return decorated_function


def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = getattr(g, "user", None)
            if user is None:
                return jsonify({"message": "인증되지 않은 사용자입니다."}), 401

            if user.role.value not in roles:
                return jsonify({"message": f"권한이 없습니다. 필요한 역할: {roles}"}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator