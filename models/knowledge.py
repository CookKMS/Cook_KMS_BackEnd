from db_init import db
from datetime import datetime

class Knowledge(db.Model):
    __tablename__ = "knowledge"

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, nullable=False)  # 작성자 ID
    title = db.Column(db.String(100), nullable=False)
    category_code = db.Column(db.String(50), nullable=False)  # ✅ category → category_code
    content = db.Column(db.Text, nullable=False)
    file_path = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
