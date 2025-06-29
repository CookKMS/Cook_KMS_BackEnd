#공통 코드 조회 라우트 정의

from flask import Blueprint, request, jsonify
from models.common import Code
from utils.decorators import custom_jwt_required

common_bp = Blueprint("common_bp", __name__, url_prefix="/api/common")

@common_bp.route("/codes", methods=["GET"])
@custom_jwt_required
def get_common_codes():
    code_type = request.args.get("type")
    if not code_type:
        return jsonify({"message": "code_type 파라미터가 필요합니다."}), 400

    codes = Code.query.filter_by(code_type=code_type, is_active=True).order_by(Code.sort_order.asc()).all()
    
    result = [
        {
            "key": code.code_key,
            "value": code.code_value
        }
        for code in codes
    ]
    return jsonify(result), 200
