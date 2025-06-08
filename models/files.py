# [파일 모델] 업로드된 파일의 메타데이터 저장용
from db_init import db
from datetime import datetime

class File(db.Model):
    __tablename__ = "files"

    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    board_code = db.Column(db.String(10), nullable=False)   # ex: '01', '02'
    board_id = db.Column(db.Integer, nullable=False)        # ex: faq.id 등
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
