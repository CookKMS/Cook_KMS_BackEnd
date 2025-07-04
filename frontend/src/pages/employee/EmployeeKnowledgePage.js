// src/pages/employee/EmployeeKnowledgePage.js

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import EmployeeHeader from './EmployeeHeader';
import KnowledgeDetailModal from '../../components/KnowledgeDetailModal';
import '../../styles/Knowledge.css';

// 한글 → 영문 카테고리 코드
const categoryMap = {
  '새 기능': 'FEATURE',
  '수정': 'EDIT',
  '버그': 'BUG',
  '문의': 'QUESTION',
  '장애': 'ISSUE',
  '긴급 지원': 'EMERGENCY'
};

// 영문 → 한글 매핑
const reverseCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([k, v]) => [v, k])
);

const categories = ['전체', ...Object.keys(categoryMap)];

export default function EmployeeKnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const itemsPerPage = 6;

  // ✅ 목록 불러오기
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await axios.get('/api/knowledge');
        setKnowledgeList(res.data);
      } catch (err) {
        console.error('지식 문서 불러오기 실패:', err);
        alert('지식 문서를 불러오는 데 실패했습니다.');
      }
    };

    fetchKnowledge();
  }, []);

  // ✅ 필터링
  const filtered = knowledgeList.filter(item => {
    const matchCategory =
      selectedCategory === '전체' ||
      reverseCategoryMap[item.category_code] === selectedCategory;

    const matchSearch =
      item.title.includes(searchTerm) ||
      item.content?.includes(searchTerm);

    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ 등록
  const handleSubmitNewDoc = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const summary = form.summary.value;
    const file = form.fileUpload.files[0];

    const category_code = categoryMap[category];

    if (!title || !category_code) {
      alert('제목과 카테고리는 필수입니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category_code', category_code);  // ✅ 정확한 필드명
      formData.append('content', summary);
      if (file) formData.append('file', file);

      await axios.post('/api/knowledge/create', formData);

      alert('문서가 등록되었습니다.');
      setShowNewModal(false);
      window.location.reload();
    } catch (err) {
      console.error('문서 등록 실패:', err);
      alert('문서 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <EmployeeHeader />
      <main className="knowledge-container">
        <h2>지식 관리 시스템 (사원용)</h2>
        <p>사원들이 작성한 지식 문서를 확인하고 등록할 수 있습니다.</p>

        <div className="knowledge-search">
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
          <button className="btn" onClick={() => setShowNewModal(true)}>
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
                <span className={`category-tag ${item.category_code}`}>
                  {reverseCategoryMap[item.category_code] || item.category_code}
                </span>
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
          <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
            <form
              className="modal new-inquiry-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmitNewDoc}
            >
              <header>
                <h2>지식 문서 추가</h2>
                <button type="button" className="close-btn" onClick={() => setShowNewModal(false)}>×</button>
              </header>

              <label htmlFor="title">문서 제목</label>
              <input id="title" name="title" type="text" required />

              <label htmlFor="category">카테고리</label>
              <select id="category" name="category" required>
                <option value="">카테고리를 선택하세요</option>
                {Object.keys(categoryMap).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label htmlFor="summary">요약 설명</label>
              <textarea id="summary" name="summary" rows="4" />

              <label htmlFor="fileUpload">첨부 파일 (선택)</label>
              <input id="fileUpload" name="fileUpload" type="file" accept=".pdf,.jpg,.jpeg" />

              <footer className="modal-footer">
                <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
                <button type="submit" className="btn submit-btn">등록</button>
              </footer>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
