// src/components/KnowledgeDetailModal.js
import React, { useState } from 'react';
import '../styles/KnowledgeModal.css';

// 지식 상세 모달 컴포넌트
function KnowledgeDetailModal({ item, onClose }) {
  const [newComment, setNewComment] = useState(''); // 새 댓글 입력값
  const [comments, setComments] = useState(item.comments || []); // 렌더링 중단 문제를 방지하기 위해 초기값 설정

  // 댓글 제출 핸들러
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return; // 빈 댓글은 무시
    const newEntry = {
      author: '로그인유저', // 실제 로그인 유저 이름으로 대체 필요
      content: newComment,
      time: new Date().toISOString().slice(0, 16).replace('T', ' '), // YYYY-MM-DD HH:mm
    };
    setComments([...comments, newEntry]); // 댓글 목록에 추가
    setNewComment(''); // 입력창 초기화
  };

  return (
    <div className="modal-backdrop" onClick={onClose}> {/* 모달 배경 클릭 시 닫기 */}
      <div className="modal-detail" onClick={e => e.stopPropagation()}> {/* 모달 내용 클릭 시 닫힘 방지 */}

        {/* 모달 상단 영역 */}
        <header className="modal-header">
          <span className={`category-tag ${item.category}`}>{item.category}</span>
          <time>{item.date}</time>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        {/* 제목 */}
        <h2>{item.title}</h2>

        {/* 본문 내용 */}
        <pre className="knowledge-content">{item.content}</pre>

        {/* 첨부파일 영역 */}
        {item.attachment && (
          <div className="attachment">
            📎 <a href={item.attachment.url} target="_blank" rel="noreferrer">{item.attachment.name}</a>
          </div>
        )}

        {/* 댓글 영역 */}
        <div className="comment-section">
          <h4>댓글 ({comments.length})</h4>

          {/* 댓글 목록 */}
          <ul className="comment-list">
            {comments.map((c, idx) => (
              <li key={idx}>
                <strong>{c.author}</strong>
                <span>{c.time}</span>
                <p>{c.content}</p>
              </li>
            ))}
          </ul>

          {/* 댓글 작성 영역 */}
          <div className="comment-form">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>댓글 작성</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeDetailModal;
