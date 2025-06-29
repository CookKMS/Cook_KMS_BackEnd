// src/pages/admin/components/KnowledgeTable.js

import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';
import '../../../styles/Admin/KnowledgeTable.css';

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

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
    (filter === '전체' || item.category === filter) &&
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
    const category = form.category.value;
    const content = form.content.value;
    const file = form.file.files[0];

    try {
      let fileIds = [];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await axios.post('/api/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fileIds = [uploadRes.data.file_id];
      }

      const payload = {
        title,
        content,
        category,
        tags: [],
        files: fileIds,
      };

      if (editingItem) {
        await axios.put(`/api/knowledge/${editingItem.id}`, payload);
      } else {
        await axios.post('/api/knowledge/create', payload);
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
        <h2>📚 지식 문서 관리</h2>
        <div className="table-controls">
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <button onClick={() => setShowModal(true)}>+ 문서 추가</button>
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
          {paged.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.title}</td>
              <td>{item.created_at?.slice(0, 10)}</td>
              <td>
                <button onClick={() => { setEditingItem(item); setShowModal(true); }}>✏️</button>
                <button onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
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
            <h3>{editingItem ? '문서 수정' : '문서 등록'}</h3>

            <label>제목</label>
            <input name="title" defaultValue={editingItem?.title || ''} required />

            <label>카테고리</label>
            <select name="category" defaultValue={editingItem?.category || ''} required>
              <option value="">카테고리 선택</option>
              {categories.filter(c => c !== '전체').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label>내용</label>
            <textarea name="content" defaultValue={editingItem?.content || ''} rows={5} required />

            <label>첨부 파일</label>
            <input name="file" type="file" accept=".pdf,.jpg,.jpeg" />

            <div className="modal-footer">
              <button type="button" onClick={() => setShowModal(false)}>취소</button>
              <button type="submit">저장</button> {/* ✅ 중요 */}
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
            <div className="modal-footer">
              <button onClick={() => setConfirmDeleteId(null)}>취소</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
