from flask import Flask, send_from_directory, jsonify, request
from config import Config
from db_init import init_db
from werkzeug.utils import secure_filename
import os

# 블루프린트 import
from routes.auth_routes import auth_bp
from routes.files_routes import file_bp
from routes.faq_routes import faq_bp
from routes.knowledge_routes import knowledge_bp
from routes.common_routes import common_bp
from routes.user_routes import user_bp
from routes.inquiry_routes import inquiry_bp
from routes.inquiry_comment_routes import inquiry_comment_bp
from routes.my_inquiry_routes import my_inquiry_bp
from routes.admin_dashboard_routes import admin_dashboard_bp
from routes.my_knowledge_routes import my_knowledge_bp

from flask_cors import CORS

from flask_jwt_extended import JWTManager

def create_app():
    # ✅ React 빌드된 정적 파일 폴더 (frontend)
    app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
    app.config.from_object(Config)

    # ✅ DB 초기화
    init_db(app)

    # ✅ CORS 허용
    CORS(app)

    jwt = JWTManager(app)

    # ✅ API 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(file_bp, url_prefix="/api/file")
    app.register_blueprint(faq_bp, url_prefix="/api/faq")
    app.register_blueprint(knowledge_bp, url_prefix="/api/knowledge")
    app.register_blueprint(common_bp)
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(inquiry_bp, url_prefix="/api/inquiry")
    app.register_blueprint(inquiry_comment_bp, url_prefix="/api/inquiry")
    app.register_blueprint(my_inquiry_bp, url_prefix="/api/my/inquiries")
    app.register_blueprint(admin_dashboard_bp, url_prefix="/api/admin/dashboard")
    app.register_blueprint(my_knowledge_bp, url_prefix="/api/my/knowledge")

    # ✅ 파일 다운로드 라우트
    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        filename = secure_filename(filename)
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # ✅ React index.html 기본 서빙
    @app.route("/")
    def serve_react():
        return send_from_directory(app.static_folder, "index.html")

    # ✅ SPA 경로 대응 (React Router용 처리)
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith("/api/"):
            return jsonify({"error": "Not Found"}), 404
        return send_from_directory(app.static_folder, "index.html")

    return app

# ✅ 개발용 실행
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
