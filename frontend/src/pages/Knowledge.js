// src/pages/Knowledge.js

import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Header from '../components/Header';
import KnowledgeDetailModal from '../components/KnowledgeDetailModal';
import '../styles/Knowledge.css';

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

function Knowledge() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const [knowledgeList, setKnowledgeList] = useState([]);
  const itemsPerPage = 6;

  // ✅ 지식 문서 전체 불러오기
  const fetchKnowledge = async () => {
    try {
      const res = await axios.get('/api/knowledge'); // ✅ 수정됨
      setKnowledgeList(res.data);
    } catch (error) {
      console.error('지식 문서 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const filtered = knowledgeList.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchSearch =
      item.title.includes(searchTerm) ||
      (item.content && item.content.includes(searchTerm));
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ 문서 등록 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const title = formData.get('title');
    const category = formData.get('category');
    const content = formData.get('summary');
    const file = formData.get('fileUpload');

    try {
      let uploadedFileIds = [];

      if (file && file.size > 0) {
        const fileForm = new FormData();
        fileForm.append('file', file);

        const uploadRes = await axios.post('/api/file/upload', fileForm, { // ✅ 수정됨
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedFileIds.push(uploadRes.data.file_id);
      }

      const payload = {
        title,
        content,
        category,
        tags: [],
        files: uploadedFileIds,
      };

      await axios.post('/api/knowledge/create', payload); // ✅ 수정됨

      alert('지식 문서가 등록되었습니다.');
      form.reset();
      setShowNewModal(false);
      fetchKnowledge();
    } catch (error) {
      console.error('문서 등록 실패:', error);
      alert('문서 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header />
      <main className="knowledge-container">
        <h2>지식 관리 시스템</h2>
        <p>팀에서 공유하는 지식과 정보를 한 곳에서 관리하세요</p>

        <div className="knowledge-search" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
          />
          <button
            className="btn"
            style={{
              backgroundColor: '#007acc',
              color: '#fff',
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onClick={() => setShowNewModal(true)}
          >
            + 문서 추가
          </button>
        </div>

        <div className="knowledge-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="knowledge-card-list">
          {paged.map(item => (
            <div key={item.id} className="knowledge-card" onClick={() => setSelectedItem(item)}>
              <div className="card-header">
                <span className={`category-tag ${item.category}`}>{item.category}</span>
                <time className="card-date">{item.created_at?.slice(0, 10)}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.content?.slice(0, 100) + '...'}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="knowledge-pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
        )}

        {selectedItem && (
          <KnowledgeDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}

        {showNewModal && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setShowNewModal(false)}
          >
            <form
              className="modal new-inquiry-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
            >
              <header>
                <h2>지식 문서 추가</h2>
                <button
                  type="button"
                  className="close-btn"
                  aria-label="닫기"
                  onClick={() => setShowNewModal(false)}
                >
                  ×
                </button>
              </header>

              <label htmlFor="title">문서 제목</label>
              <input id="title" name="title" type="text" placeholder="문서 제목을 입력하세요" required />

              <label htmlFor="category">카테고리</label>
              <select id="category" name="category" required>
                <option value="">카테고리를 선택하세요</option>
                {categories.filter(c => c !== '전체').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label htmlFor="summary">요약 설명</label>
              <textarea id="summary" name="summary" rows="4" placeholder="문서 내용을 간략히 요약해주세요" />

              <label htmlFor="fileUpload">첨부 파일 (선택)</label>
              <input id="fileUpload" name="fileUpload" type="file" accept=".pdf,.jpg,.jpeg" />

              <footer className="modal-footer">
                <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>
                  취소
                </button>
                <button type="submit" className="btn submit-btn">
                  등록
                </button>
              </footer>
            </form>
          </div>
        )}
      </main>
    </>
  );
}

export default Knowledge;
