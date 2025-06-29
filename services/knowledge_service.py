from models.knowledge import Knowledge
from db_init import db
from datetime import datetime

def create_knowledge_entry(author_id, data):
    title = data.get("title")
    content = data.get("content")
    category_code = data.get("category_code")
    file_path = data.get("file_path")

    if not title or not content or not category_code:
        return {"message": "필수 항목이 누락되었습니다."}, 400

    knowledge = Knowledge(
        author_id=author_id,
        title=title,
        content=content,
        category_code=category_code,
        file_path=file_path
    )
    db.session.add(knowledge)
    db.session.commit()

    return {"message": "지식이 등록되었습니다.", "knowledge_id": knowledge.id}, 201

def list_knowledge_entries():
    entries = Knowledge.query.order_by(Knowledge.created_at.desc()).all()
    result = [_serialize(entry) for entry in entries]
    return jsonify(result), 200

def get_knowledge_detail(knowledge_id):
    entry = Knowledge.query.get(knowledge_id)
    if not entry:
        return {"message": "지식을 찾을 수 없습니다."}, 404

    return jsonify(_serialize(entry)), 200

def update_knowledge_entry(knowledge_id, user_id, data):
    entry = Knowledge.query.get(knowledge_id)
    if not entry:
        return {"message": "지식을 찾을 수 없습니다."}, 404
    if entry.author_id != user_id:
        return {"message": "본인만 수정할 수 있습니다."}, 403

    entry.title = data.get("title", entry.title)
    entry.content = data.get("content", entry.content)
    entry.category_code = data.get("category_code", entry.category_code)
    entry.file_path = data.get("file_path", entry.file_path)
    entry.updated_at = datetime.utcnow()

    db.session.commit()
    return {"message": "지식이 수정되었습니다."}, 200

def delete_knowledge_entry(knowledge_id, user_id):
    entry = Knowledge.query.get(knowledge_id)
    if not entry:
        return {"message": "지식을 찾을 수 없습니다."}, 404

    # 관리자 or 작성자만 삭제 가능
    if entry.author_id != user_id:
        return {"message": "본인만 삭제할 수 있습니다."}, 403

    db.session.delete(entry)
    db.session.commit()
    return {"message": "지식이 삭제되었습니다."}, 200

def _serialize(entry):
    return {
        "id": entry.id,
        "author_id": entry.author_id,
        "title": entry.title,
        "content": entry.content,
        "category_code": entry.category_code,
        "file_path": entry.file_path,
        "created_at": entry.created_at,
        "updated_at": entry.updated_at
    }
