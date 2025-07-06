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

def create_app():
    app = Flask(__name__, static_folder="frontend/build", static_url_path="/")
    app.config.from_object(Config)

    # ✅ 업로드 폴더 경로 설정
    app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "uploads")

    # ✅ DB 초기화
    init_db(app)

    # ✅ CORS 설정 (배포 시 origin 지정 권장)
    CORS(app, resources={r"/api/*": {"origins": ["http://43.200.191.18", "http://43.200.191.18:3000", "http://43.200.191.18:5000"]}})
    #
    # # 모든 출처에서 접근 허용 (로컬 개발 전용)
    # CORS(app, resources={r"/*": {"origins": "*"}})

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

    # ✅ 파일 다운로드 (일반)
    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        filename = secure_filename(filename)
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # ✅ 파일 다운로드 (지식 문서 전용)
    @app.route('/uploads/knowledge/<filename>')
    def download_knowledge_file(filename):
        return send_from_directory(os.path.join(app.config["UPLOAD_FOLDER"], "knowledge"), filename, as_attachment=True)


    # ✅ React 정적 파일 서빙 (루트 경로)
    @app.route("/")
    def serve_react():
        return send_from_directory(app.static_folder, "index.html")

    # ✅ React Router 대응
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith("/api/"):
            return jsonify({"error": "Not Found"}), 404
        return send_from_directory(app.static_folder, "index.html")

    return app

# ✅ 실행 설정 (배포 시 외부 접속 허용)
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=False)
