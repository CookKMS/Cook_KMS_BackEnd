from flask import Flask, send_from_directory
from config import Config
from db_init import init_db
from werkzeug.utils import secure_filename

# 블루프린트 import
from routes.auth_routes import auth_bp
from routes.files_routes import file_bp
from routes.faq_routes import faq_bp
from routes.knowledge_routes import knowledge_bp
from routes.common_routes import common_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # DB 초기화
    init_db(app)

    # 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(file_bp, url_prefix="/api/file")
    app.register_blueprint(faq_bp, url_prefix="/api/faq")
    app.register_blueprint(knowledge_bp, url_prefix="/api/knowledge")
    app.register_blueprint(common_bp)  

    # 업로드된 파일 정적 접근 라우트
    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        filename = secure_filename(filename)  
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app
