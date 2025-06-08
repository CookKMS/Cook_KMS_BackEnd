from flask import Flask
from config import Config
from db_init import init_db

# 블루프린트 import
from routes.auth_routes import auth_bp
from routes.files_routes import file_bp
from routes.faq_routes import faq_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # DB 초기화
    init_db(app)

    # 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(file_bp, url_prefix="/api/file:")
    app.register_blueprint(faq_bp, url_prefix="/api/faq")

    # 업로드 파일 접근용 정적 라우팅
    from flask import send_from_directory
    import os

    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app
