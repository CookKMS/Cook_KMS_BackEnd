# routes/files_routes.py

from flask import Blueprint, request
from services.files_service import save_file, download_file_by_id

file_bp = Blueprint("file_bp", __name__, url_prefix="/api/file")

@file_bp.route("/upload", methods=["POST"])
def upload_file():
    return save_file(request)

@file_bp.route("/download/<int:file_id>", methods=["GET"])
def download_file(file_id):
    return download_file_by_id(file_id)

@file_bp.route("/<path:filename>", methods=["GET"])
def serve_uploaded_file(filename):
    """
    /api/file/uploads/경로에 직접 접근하려는 경우를 위해 추가된 정적 파일 서빙 라우트
    예: /api/file/uploads/knowledge/abc.jpg
    """
    from flask import send_from_directory, current_app, abort
    import os

    safe_dir = os.path.join(current_app.root_path, "uploads")
    full_path = os.path.join(safe_dir, filename)

    if not os.path.isfile(full_path):
        abort(404)

    return send_from_directory(directory=safe_dir, path=filename, as_attachment=False)
