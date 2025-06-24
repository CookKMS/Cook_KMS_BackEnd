# 댓글 모델 구조 정의
from db_init import db
from datetime import datetime

class InquiryComment(db.Model):
    __tablename__ = "inquiry_comments"

    id = db.Column(db.Integer, primary_key=True)
    inquiry_id = db.Column(db.Integer, db.ForeignKey("inquiries.id"), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 관계
    inquiry = db.relationship("Inquiry", backref=db.backref("comments", cascade="all, delete-orphan"))
    admin = db.relationship("User", backref=db.backref("inquiry_comments", lazy=True))
