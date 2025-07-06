# files_service.py

import os
from flask import current_app, request, jsonify, send_from_directory, g
from models.files import File
from db_init import db
from werkzeug.utils import secure_filename
from urllib.parse import quote

# 허용된 확장자
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf", "docx", "xlsx", "txt"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def normalize_path(path):
    return path if path.startswith("/") else "/" + path

def save_file(req):
    file = req.files.get("file")
    board_code = req.form.get("board_code")
    board_id = req.form.get("board_id")

    if not file or not board_code or not board_id or not allowed_file(file.filename):
        return jsonify({"message": "필수 데이터 또는 파일 형식 오류"}), 400

    # 역할 기반 업로드 제한
    role = g.user.role.value
    if board_code == "01" and role not in ["employee", "admin"]:
        return jsonify({"message": "지식관리 파일은 직원 또는 관리자만 업로드 가능합니다."}), 403
    if board_code == "02" and role != "admin":
        return jsonify({"message": "FAQ 파일은 관리자만 업로드 가능합니다."}), 403
    if board_code == "03" and role != "user":
        return jsonify({"message": "문의 파일은 사용자만 업로드 가능합니다."}), 403

    # 모든 파일은 knowledge 폴더에 저장
    filename = secure_filename(file.filename)
    safe_filename = quote(secure_filename(file.filename))  # 공백이나 한글 처리
    folder_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge")
    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(folder_path, safe_filename)
    file.save(file_path)

    entry = File(
        file_name=filename,
        file_path=normalize_path(f"uploads/knowledge/{safe_filename}"),
        board_code=board_code,
        board_id=int(board_id)
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify({
        "message": "업로드 완료",
        "file_path": entry.file_path,
        "file_id": entry.id
    }), 200

def delete_file_by_id(file_id):
    file = File.query.get(file_id)
    if not file:
        return jsonify({"message": "파일 없음"}), 404

    try:
        full_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge", os.path.basename(file.file_path))
        if os.path.exists(full_path):
            os.remove(full_path)
    except Exception as e:
        return jsonify({"message": f"파일 삭제 실패: {str(e)}"}), 500

    db.session.delete(file)
    db.session.commit()
    return jsonify({"message": "삭제 완료"}), 200

def replace_file_by_id(file_id, req):
    file = File.query.get(file_id)
    new_file = req.files.get("file")

    if not file or not new_file or not allowed_file(new_file.filename):
        return jsonify({"message": "데이터 부족 또는 잘못된 파일"}), 400

    try:
        old_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge", os.path.basename(file.file_path))
        if os.path.exists(old_path):
            os.remove(old_path)
    except Exception as e:
        return jsonify({"message": f"기존 파일 삭제 실패: {str(e)}"}), 500

    new_filename = secure_filename(new_file.filename)
    folder_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge")
    os.makedirs(folder_path, exist_ok=True)
    new_path = os.path.join(folder_path, new_filename)
    new_file.save(new_path)

    file.file_name = new_filename
    file.file_path = f"/uploads/knowledge/{new_filename}"
    db.session.commit()

    return jsonify({"message": "교체 완료", "file_path": file.file_path}), 200

def download_file_by_id(file_id):
    file = File.query.get(file_id)
    if not file:
        return jsonify({"message": "파일을 찾을 수 없습니다."}), 404

    filename = os.path.basename(file.file_path)
    full_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge", filename)

    if not os.path.exists(full_path):
        return jsonify({"message": "파일 경로가 존재하지 않습니다."}), 404

    return send_from_directory(
        directory=os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge"),
        path=filename,
        as_attachment=True,
        download_name=file.file_name
    )

def delete_files_by_board(board_code: str, board_id: int):
    files = File.query.filter_by(board_code=board_code, board_id=board_id).all()

    for file in files:
        try:
            full_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "knowledge", os.path.basename(file.file_path))
            if os.path.exists(full_path):
                os.remove(full_path)
        except Exception as e:
            print(f"[파일 삭제 오류] {file.file_path} - {str(e)}")

        db.session.delete(file)

    db.session.commit()
