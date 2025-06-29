from flask import Blueprint, request, jsonify, g
from utils.decorators import custom_jwt_required
from services.my_inquiry_service import (
    get_my_inquiries,
    update_my_inquiry,
    delete_my_inquiry
)

my_inquiry_bp = Blueprint('my_inquiry_bp', __name__, url_prefix="/api/my/inquiries")

# GET /api/my/inquiries
@my_inquiry_bp.route('', methods=['GET'])
@custom_jwt_required
def handle_get_my_inquiries():
    user_id = g.user.id
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 5))

    result = get_my_inquiries(user_id, page, size)
    if isinstance(result, dict) and 'error' in result:
        return jsonify(result), 403

    return jsonify(result)

# PUT /api/my/inquiries/<int:inquiry_id>
@my_inquiry_bp.route('/<int:inquiry_id>', methods=['PUT'])
@custom_jwt_required
def handle_update_my_inquiry(inquiry_id):
    user_id = g.user.id
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    success = update_my_inquiry(user_id, inquiry_id, title, content)
    if success:
        return jsonify({'message': '수정 완료'})
    else:
        return jsonify({'error': '수정 실패 또는 권한 없음'}), 400

# DELETE /api/my/inquiries/<int:inquiry_id>
@my_inquiry_bp.route('/<int:inquiry_id>', methods=['DELETE'])
@custom_jwt_required
def handle_delete_my_inquiry(inquiry_id):
    user_id = g.user.id
    success = delete_my_inquiry(user_id, inquiry_id)
    if success:
        return jsonify({'message': '삭제 완료'})
    else:
        return jsonify({'error': '삭제 실패 또는 권한 없음'}), 400
