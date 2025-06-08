# models/common_code.py

from models import db

class CommonCode(db.Model):
    __tablename__ = 'common_code'

    code_grp = db.Column(db.String(50), primary_key=True)
    code_id = db.Column(db.Integer, primary_key=True)
    code_name = db.Column(db.String(100), nullable=False)
    code_status = db.Column(db.String(20), nullable=False)
