import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';
import '../../../styles/Admin/FaqTable.css';

// 카테고리 코드 매핑
const categoryCodeMap = {
  '설치,구성': 'SETUP',
  '접근통제': 'SECURITY',
  '계정관리': 'ACCOUNT',
  '기타': 'ETC'
};
const codeToLabel = Object.fromEntries(Object.entries(categoryCodeMap).map(([k, v]) => [v, k]));

const filterCategories = ['전체', ...Object.keys(categoryCodeMap)];

export default function FaqTable() {
  const [faqs, setFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filter, setFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [currentFaq, setCurrentFaq] = useState(null);
  const [file, setFile] = useState(null);

  const fetchFaqs = async () => {
    try {
      let url = '/api/faq';
      if (filter !== '전체') {
        const code = categoryCodeMap[filter];
        url = `/api/faq/category/${code}`;
      }
      const res = await axios.get(url);
      setFaqs(res.data);
    } catch (err) {
      console.error('FAQ 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [filter]);

  const filteredFaqs = faqs.filter(faq =>
    faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ 저장 (등록: FormData / 수정: JSON)
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;

    const title = form.title.value;
    const content = form.content.value;
    const category_code = form.category.value;

    try {
      if (modalType === 'add') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category_code);

        await axios.post('/api/faq/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.put(`/api/faq/${currentFaq.id}`, {
          title,
          content,
          category_code
        });
      }

      alert('저장되었습니다.');
      setModalType(null);
      setFile(null);
      fetchFaqs();
    } catch (err) {
      alert('저장 중 오류 발생');
      console.error(err);
    }
  };

  // ✅ 삭제
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/faq/${currentFaq.id}`);
      alert('삭제되었습니다.');
      setModalType(null);
      fetchFaqs();
    } catch (err) {
      alert('삭제 실패');
      console.error(err);
    }
  };

  return (
    <div className="faq-table-wrapper">
      <div className="table-header">
        <h2>FAQ 관리</h2>
        <div className="filter-section">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            {filterCategories.map(category => <option key={category}>{category}</option>)}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="add-button" onClick={() => {
            setModalType('add');
            setCurrentFaq(null);
            setFile(null);
          }}>
            + 새 FAQ 추가
          </button>
        </div>
      </div>

      <table className="faq-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
            {paginatedFaqs.length > 0 ? (
              paginatedFaqs.map(faq => (
                <tr key={faq.id}>
                  <td>{faq.title}</td>
                  <td>{codeToLabel[faq.category_code] || faq.category_code}</td> {/* 이 부분입니다 */}
                  <td>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setModalType('edit');
                      setCurrentFaq(faq);
                    }}
                  >✏️</button>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setModalType('delete');
                      setCurrentFaq(faq);
                    }}
                  >🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', color: '#888', padding: '12px' }}>
                등록된 FAQ가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>{modalType === 'add' ? '새 FAQ 추가' : 'FAQ 수정'}</h3>

            <div className="modal-row">
              <label>제목</label>
              <div className="input-area">
                <input name="title" defaultValue={currentFaq?.title || ''} required />
              </div>
            </div>

            <div className="modal-row">
              <label>내용</label>
              <div className="input-area">
                <textarea name="content" defaultValue={currentFaq?.content || ''} required />
              </div>
            </div>

            <div className="modal-row">
              <label>카테고리</label>
              <div className="input-area">
                <select name="category" defaultValue={currentFaq?.category_code || ''} required>
                  <option value="">카테고리 선택</option>
                  {Object.entries(categoryCodeMap).map(([label, code]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>
            </div>



            <div className="modal-actions">
              <button type="button" className="cancel" onClick={() => setModalType(null)}>취소</button>
              <button type="submit" className="primary">저장</button>
            </div>
          </form>
        </div>
      )}

      {modalType === 'delete' && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p><strong>{currentFaq.title}</strong> 항목을 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button className="cancel" onClick={() => setModalType(null)}>취소</button>
              <button className="danger" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
