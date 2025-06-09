# 파일 라우트 정의
from flask import Blueprint, request
from services.files_service import (
    save_file,
    delete_file_by_id,
    replace_file_by_id,
    download_file_by_id
)
from utils.decorators import jwt_required, role_required

file_bp = Blueprint("file_bp", __name__)

# [파일 업로드] - 인증 필요, 역할은 board_code에 따라 내부에서 판별
@file_bp.route("/upload", methods=["POST"])
@jwt_required
@role_required("user", "employee", "admin")
def upload():
    return save_file(request)

# [파일 삭제] - 인증된 사용자라면 삭제 가능
@file_bp.route("/<int:file_id>", methods=["DELETE"])
@jwt_required
@role_required("user", "employee", "admin")
def delete(file_id):
    return delete_file_by_id(file_id)

# [파일 교체] - 기존 파일을 새로운 파일로 교체
@file_bp.route("/<int:file_id>/replace", methods=["PUT"])
@jwt_required
@role_required("user", "employee", "admin")
def replace(file_id):
    return replace_file_by_id(file_id, request)

# [파일 다운로드] - 인증된 사용자 누구나 가능
@file_bp.route("/download/<int:file_id>", methods=["GET"])
@jwt_required
@role_required("user", "employee", "admin")
def download(file_id):
    return download_file_by_id(file_id)
