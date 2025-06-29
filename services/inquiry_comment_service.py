from models.inquiry_comment import InquiryComment
from models.inquiry import Inquiry
from db_init import db
from datetime import datetime

def create_comment(inquiry_id, admin_id, data):
    content = data.get("content")
    if not content:
        return {"message": "내용이 없습니다."}, 400

    inquiry = Inquiry.query.get(inquiry_id)
    if not inquiry:
        return {"message": "문의글이 존재하지 않습니다."}, 404

    # 🔹 댓글 등록
    comment = InquiryComment(
        inquiry_id=inquiry_id,
        admin_id=admin_id,
        content=content
    )
    db.session.add(comment)

    # 🔹 상태 업데이트: 답변 완료
    inquiry.status = "02"

    db.session.commit()

    return {"message": "답변이 등록되었습니다.", "comment_id": comment.id}, 201


def get_comments_by_inquiry(inquiry_id):
    comments = InquiryComment.query.filter_by(inquiry_id=inquiry_id)\
        .order_by(InquiryComment.created_at.asc()).all()
    
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

    # ✅ 남은 댓글이 없으면 상태 복구
    remaining = InquiryComment.query.filter_by(inquiry_id=inquiry_id).count()
    if remaining == 0:
        inquiry = Inquiry.query.get(inquiry_id)
        if inquiry:
            inquiry.status = "01"  # answer_status = 01 (답변 대기)
            inquiry.updated_at = datetime.utcnow()
            db.session.commit()

    return {"message": "댓글이 삭제되었습니다."}, 200
