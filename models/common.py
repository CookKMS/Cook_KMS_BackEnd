# models/common.py
from db_init import db

class Code(db.Model):  # 또는 CommonCode
    __tablename__ = "codes"

    id = db.Column(db.Integer, primary_key=True)
    code_type = db.Column(db.String(50), nullable=False)
    code_key = db.Column(db.String(10), nullable=False)
    code_value = db.Column(db.String(100), nullable=False)
    sort_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
