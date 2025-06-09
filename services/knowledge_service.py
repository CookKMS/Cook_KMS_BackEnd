from flask import jsonify, g, current_app
from models.knowledge import Knowledge
from db_init import db
from werkzeug.utils import secure_filename
import os

# 유효성 검사 함수
def validate_fields(data, required_fields):
    return all(data.get(field) for field in required_fields)

# 지식 등록
def create_knowledge_entry(data):
    required = ["title", "category", "content"]
    if not validate_fields(data, required):
        return jsonify({"message": "필수 항목이 누락되었습니다."}), 400

    knowledge = Knowledge(
        title=data.get("title"),
        category=data.get("category"),
        content=data.get("content"),
        file_path=data.get("file_path"),
        author_id=g.user.id
    )
    db.session.add(knowledge)
    db.session.commit()

    return jsonify({"message": "지식이 등록되었습니다.", "knowledge_id": knowledge.id}), 201

# 지식 목록 조회
def list_knowledge_entries():
    knowledges = Knowledge.query.order_by(Knowledge.created_at.desc()).all()
    return jsonify([
        {
            "id": k.id,
            "title": k.title,
            "category": k.category,
            "content": k.content,
            "file_path": k.file_path,
            "created_at": k.created_at,
            "updated_at": k.updated_at
        } for k in knowledges
    ]), 200

# 지식 상세 조회
def get_knowledge_detail(knowledge_id):
    knowledge = Knowledge.query.get(knowledge_id)
    if not knowledge:
        return jsonify({"message": "지식을 찾을 수 없습니다."}), 404

    return jsonify({
        "id": knowledge.id,
        "title": knowledge.title,
        "category": knowledge.category,
        "content": knowledge.content,
        "file_path": knowledge.file_path,
        "created_at": knowledge.created_at,
        "updated_at": knowledge.updated_at
    }), 200

# 지식 수정 (작성자 본인만 가능, 파일은 선택적으로 교체)
def update_knowledge_entry(knowledge_id, data, file=None):
    knowledge = Knowledge.query.get(knowledge_id)
    if not knowledge:
        return jsonify({"message": "지식을 찾을 수 없습니다."}), 404

    if knowledge.author_id != g.user.id:
        return jsonify({"message": "수정 권한이 없습니다."}), 403

    for field in ["title", "category", "content"]:
        if data.get(field):
            setattr(knowledge, field, data.get(field))

    if file:
        filename = secure_filename(file.filename)
        upload_path = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        knowledge.file_path = f"/uploads/{filename}"

    db.session.commit()
    return jsonify({"message": "지식이 수정되었습니다."}), 200

# 지식 삭제 (작성자 또는 관리자)
def delete_knowledge_entry(knowledge_id):
    knowledge = Knowledge.query.get(knowledge_id)
    if not knowledge:
        return jsonify({"message": "지식을 찾을 수 없습니다."}), 404

    if g.user.id != knowledge.author_id and g.user.role.value != "admin":
        return jsonify({"message": "삭제 권한이 없습니다."}), 403

    db.session.delete(knowledge)
    db.session.commit()
    return jsonify({"message": "지식이 삭제되었습니다."}), 200
