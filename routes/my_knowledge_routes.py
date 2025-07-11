from flask import Blueprint, request, jsonify, g
from utils.decorators import custom_jwt_required
from services.my_knowledge_service import (
    get_my_knowledge,
    update_my_knowledge,
    delete_my_knowledge
)

my_knowledge_bp = Blueprint('my_knowledge_bp', __name__, url_prefix="/api/my/knowledge")

# GET /api/my/knowledge
@my_knowledge_bp.route('', methods=['GET'])
@custom_jwt_required
def handle_get_my_knowledge():
    user_id = g.user.id
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', 5))

    result = get_my_knowledge(user_id, page, size)
    if isinstance(result, dict) and 'error' in result:
        return jsonify(result), 403

    return jsonify(result)

# PUT /api/my/knowledge/<int:knowledge_id>
@my_knowledge_bp.route('/<int:knowledge_id>', methods=['PUT'])
@custom_jwt_required
def handle_update_my_knowledge(knowledge_id):
    user_id = g.user.id
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    success = update_my_knowledge(user_id, knowledge_id, title, content)
    if success:
        return jsonify({'message': '수정 완료'})
    else:
        return jsonify({'error': '수정 실패 또는 권한 없음'}), 400

# DELETE /api/my/knowledge/<int:knowledge_id>
@my_knowledge_bp.route('/<int:knowledge_id>', methods=['DELETE'])
@custom_jwt_required
def handle_delete_my_knowledge(knowledge_id):
    user_id = g.user.id
    success = delete_my_knowledge(user_id, knowledge_id)
    if success:
        return jsonify({'message': '삭제 완료'})
    else:
        return jsonify({'error': '삭제 실패 또는 권한 없음'}), 400