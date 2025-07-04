// src/components/KnowledgeDetailModal.js
import React from 'react';
import '../styles/KnowledgeModal.css';

// 지식 상세 모달 컴포넌트 (댓글 기능 제거됨)
function KnowledgeDetailModal({ item, onClose }) {
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
        {item.file_path && (
          <div className="attachment">
            📎{' '}
            <a
              href={`${process.env.REACT_APP_API_BASE_URL}/${item.file_path}`}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              첨부파일 다운로드
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeDetailModal;
