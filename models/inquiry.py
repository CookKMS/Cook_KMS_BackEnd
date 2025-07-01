from db_init import db
from datetime import datetime
from models.inquiry_comment import InquiryComment

class Inquiry(db.Model):
    __tablename__ = "inquiries"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_code = db.Column(db.String(50), nullable=False)  # code_type='inquiry_category'
    file_path = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default="01")  # code_type='answer_status': "01" = 대기중
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("inquiries", lazy=True))
