from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid

file_bp = Blueprint("file_bp", __name__, url_prefix="/api/file")

@file_bp.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")

    if not file:
        return jsonify({"message": "파일이 누락되었습니다."}), 400

    # 확장자 추출
    ext = os.path.splitext(file.filename)[1]
    # 고유 파일명 생성
    filename = f"{uuid.uuid4()}{ext}"

    # 저장 경로 지정 및 생성
    upload_dir = os.path.join("uploads", "comment_files")
    os.makedirs(upload_dir, exist_ok=True)

    # 파일 저장
    file.save(os.path.join(upload_dir, filename))

    # 클라이언트에 반환할 경로 (슬래시 정규화 포함)
    file_path = f"uploads/comment_files/{filename}".replace("\\", "/")

    return jsonify({"file_path": file_path}), 200
