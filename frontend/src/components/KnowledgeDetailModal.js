import React from 'react';
import '../styles/KnowledgeModal.css';

// 지식 상세 모달 컴포넌트 (댓글 기능 제거됨)
function KnowledgeDetailModal({ item, onClose }) {
  // 환경 변수와 파일 경로를 안전하게 조합
  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/+$/, ''); // 끝 슬래시 제거
  const filePath = item.file_path?.startsWith('/') ? item.file_path : `/${item.file_path}`;
  const fullDownloadUrl = `${baseUrl}${filePath}`;

  return (

    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-detail" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <span className={`category-tag ${item.category}`}>{item.category}</span>
          <time>{item.date}</time>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        <h2>{item.title}</h2>
        <pre className="knowledge-content">{item.content}</pre>

        {item.file_path && (
          <div className="attachment">
            📎{' '}
            <a
              href={fullDownloadUrl}
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
