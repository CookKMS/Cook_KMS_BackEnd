# 사용자 모델 구조 정의
from db_init import db
from datetime import datetime
from enum import Enum


class RoleEnum(Enum):
    user = "user"
    employee = "employee"
    admin = "admin"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)
    employee_number = db.Column(db.String(50), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<User {self.username}, role={self.role}>"