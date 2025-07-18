#FAQ 모델 구조 정의
from db_init import db
from datetime import datetime

class Faq(db.Model):
    __tablename__ = "faq"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category_code = db.Column(db.String(50), nullable=False)  # 공통 코드 테이블의 code_key (faq_category)
    file_path = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
