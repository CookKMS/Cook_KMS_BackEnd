    // src/pages/admin/components/KnowledgeTable.js
    import React, { useEffect, useState } from 'react';
    import axios from '../../../utils/axiosInstance';
    import '../../../styles/Admin/KnowledgeTable.css';

    // 한글 → 영문 매핑
    const categoryMap = {
      '새 기능': 'FEATURE',
      '수정': 'EDIT',
      '버그': 'BUG',
      '문의': 'QUESTION',
      '장애': 'ISSUE',
      '긴급 지원': 'EMERGENCY'
    };

    // 영문 → 한글 매핑
    const reverseCategoryMap = Object.fromEntries(Object.entries(categoryMap).map(([k, v]) => [v, k]));

    const categories = ['전체', ...Object.keys(categoryMap)];

    export default function KnowledgeTable() {
      const [data, setData] = useState([]);
      const [filter, setFilter] = useState('전체');
      const [search, setSearch] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const [showModal, setShowModal] = useState(false);
      const [editingItem, setEditingItem] = useState(null);
      const [confirmDeleteId, setConfirmDeleteId] = useState(null);
      const itemsPerPage = 5;

      useEffect(() => {
        fetchKnowledge();
      }, []);

      const fetchKnowledge = async () => {
        try {
          const res = await axios.get('/api/knowledge');
          setData(res.data);
        } catch (error) {
          console.error('문서 목록 조회 실패:', error);
        }
      };

      const filtered = data.filter(item =>
        (filter === '전체' || reverseCategoryMap[item.category_code] === filter) &&
        item.title.toLowerCase().includes(search.toLowerCase())
      );

      const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      const totalPages = Math.ceil(filtered.length / itemsPerPage);

      const handleDelete = async () => {
        try {
          await axios.delete(`/api/knowledge/${confirmDeleteId}`);
          setConfirmDeleteId(null);
          fetchKnowledge();
        } catch (error) {
          console.error('삭제 실패:', error);
        }
      };

      const handleSave = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const category_code = form.category_code.value;
        const content = form.content.value;
        const file = form.file.files[0];

        try {
          let file_id = null;

          if (file) {
            const uploadForm = new FormData();
            uploadForm.append('file', file);
            uploadForm.append('board_code', 'knowledge');
            uploadForm.append('board_id', 0);

            const uploadRes = await axios.post('/api/file/upload', uploadForm, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });

            file_id = uploadRes.data.file_id;
          }

          const formData = new FormData();
          formData.append('title', title);
          formData.append('content', content);
          formData.append('category_code', categoryMap[category_code]);
          if (file_id) formData.append('file_path', `/api/file/download/${file_id}`);

          if (editingItem) {
            await axios.put(`/api/knowledge/${editingItem.id}`, {
              title,
              content,
              category_code: categoryMap[category_code],
              file_path: file_id ? `/api/file/download/${file_id}` : null
            });
          } else {
            await axios.post('/api/knowledge/create', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          }

          setShowModal(false);
          setEditingItem(null);
          fetchKnowledge();
        } catch (error) {
          console.error('저장 실패:', error);
        }
      };

      return (
        <div className="knowledge-table-wrapper">
          <div className="table-header">
            <h2>지식 문서 관리</h2>
            <div className="table-controls">
              <select value={filter} onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}>
                {categories.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
              <input
                type="text"
                placeholder="검색어 입력"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              <button className="btn-new" onClick={() => { setEditingItem(null); setShowModal(true); }}>
                + 문서 추가
              </button>
            </div>
          </div>

          <table className="knowledge-table">
            <thead>
              <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {paged.length > 0 ? (
                paged.map(item => (
                  <tr key={item.id}>
                    <td>{reverseCategoryMap[item.category_code] || item.category_code}</td>
                    <td>{item.title}</td>
                    <td>{item.created_at?.slice(0, 10)}</td>
                    <td>
                      <button className="icon-btn" onClick={() => { setEditingItem(item); setShowModal(true); }}>✏️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    color: '#888'
                  }}>
                    등록된 지식 문서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* 등록/수정 모달 */}
          {showModal && (
            <div className="modal-backdrop" onClick={() => setShowModal(false)}>
              <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
              <h3>{editingItem ? '문서 확인' : '문서 등록'}</h3>

              <div className="modal-row">
                <label>제목</label>
                <div className="input-area">
                  <input name="title" defaultValue={editingItem?.title || ''} required />
                </div>
              </div>

              <div className="modal-row">
                <label>카테고리</label>
                <div className="input-area">
                  <select name="category_code" defaultValue={reverseCategoryMap[editingItem?.category_code] || ''} required>
                    <option value="">카테고리 선택</option>
                    {Object.keys(categoryMap).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-row">
                <label>내용</label>
                <div className="input-area">
                  <textarea name="content" defaultValue={editingItem?.content || ''} rows={5} required />
                </div>
              </div>

               <div className="modal-row">
                  <label>첨부파일</label>
                  <div className="input-area">
                    <input type="file" name="file" />
                  </div>
                </div>

              <div className="modal-actions">
                <button type="button" className="cancel" onClick={() => setShowModal(false)}>취소</button>
                <button type="submit">저장</button>
              </div>
            </form>
            </div>
          )}

          {/* 삭제 확인 모달 */}
          {confirmDeleteId && (
            <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
              <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
                <h3>삭제 확인</h3>
                <p>정말로 삭제하시겠습니까?</p>
                <div className="modal-actions">
                  <button className="cancel" onClick={() => setConfirmDeleteId(null)}>취소</button>
                  <button className="danger" onClick={handleDelete}>삭제</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
