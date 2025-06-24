from models.inquiry_comment import InquiryComment
from models.inquiry import Inquiry
from db_init import db
from datetime import datetime

def create_comment(inquiry_id, admin_id, data):
    content = data.get("content")
    if not content:
        return {"message": "댓글 내용이 비어 있습니다."}, 400

    inquiry = Inquiry.query.get(inquiry_id)
    if not inquiry:
        return {"message": "문의글을 찾을 수 없습니다."}, 404

    comment = InquiryComment(
        inquiry_id=inquiry_id,
        admin_id=admin_id,
        content=content
    )
    db.session.add(comment)

    # 답변 상태로 변경
    inquiry.status = "02"  # 공통코드 answer_status = "02": 답변완료
    inquiry.updated_at = datetime.utcnow()

    db.session.commit()
    return {"message": "댓글이 등록되었습니다."}, 201

def get_comments_by_inquiry(inquiry_id):
    comments = InquiryComment.query.filter_by(inquiry_id=inquiry_id).order_by(InquiryComment.created_at.asc()).all()
    result = [
        {
            "id": c.id,
            "inquiry_id": c.inquiry_id,
            "admin_id": c.admin_id,
            "content": c.content,
            "created_at": c.created_at
        }
        for c in comments
    ]
    return result, 200

def update_comment(comment_id, data):
    comment = InquiryComment.query.get(comment_id)
    if not comment:
        return {"message": "댓글을 찾을 수 없습니다."}, 404

    comment.content = data.get("content", comment.content)
    comment.updated_at = datetime.utcnow()
    db.session.commit()
    return {"message": "댓글이 수정되었습니다."}, 200

def delete_comment(comment_id):
    comment = InquiryComment.query.get(comment_id)
    if not comment:
        return {"message": "댓글을 찾을 수 없습니다."}, 404

    inquiry_id = comment.inquiry_id
    db.session.delete(comment)
    db.session.commit()

    # 남은 댓글이 없는 경우 상태 복구
    remaining = InquiryComment.query.filter_by(inquiry_id=inquiry_id).count()
    if remaining == 0:
        inquiry = Inquiry.query.get(inquiry_id)
        if inquiry:
            inquiry.status = "01"  # 공통코드 answer_status = "01": 대기중
            inquiry.updated_at = datetime.utcnow()
            db.sess
