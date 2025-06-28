import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';
import '../../../styles/Admin/InquiryTable.css';

const STATUS_MAP = {
  '전체': null,
  '답변 대기': '01',
  '답변 완료': '02',
};

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const deletingItem = inquiries.find((i) => i.id === confirmDeleteId);

  // ✅ 문의 목록 불러오기
  const fetchInquiries = async () => {
    try {
      const params = {};
      if (STATUS_MAP[filterStatus]) params.status = STATUS_MAP[filterStatus];
      if (searchTerm) params.keyword = searchTerm;

      const res = await axios.get('/api/admin/dashboard/inquiry', { params });
      setInquiries(res.data.data);
    } catch (err) {
      console.error('문의 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filterStatus]);

  const filtered = inquiries; // 서버에서 필터링된 결과 사용
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ 답변 저장
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const status = form.status.value;
    const content = form.response.value;
    const file = form.file.files[0];

    try {
      if (editingItem.comments?.length > 0) {
        await axios.delete(`/api/inquiry/comment/${editingItem.comments[0].comment_id}`);
      }

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await axios.post('/api/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await axios.post(`/api/inquiry/${editingItem.id}/comment`, { content });

      await axios.put(`/api/my/inquiries/${editingItem.id}`, {
        title: editingItem.title,
        content: editingItem.content,
        category: editingItem.category,
        status,
      });

      alert('답변 저장 완료');
      setEditingItem(null);
      fetchInquiries();
    } catch (err) {
      console.error('답변 저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // ✅ 문의 삭제
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/inquiry/${confirmDeleteId}`);
      alert('삭제되었습니다.');
      setConfirmDeleteId(null);
      fetchInquiries();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류 발생');
    }
  };

  return (
    <div className="inquiry-table-wrapper">
      {/* 🔹 상단 필터 및 검색 */}
      <div className="table-header">
        <h2>🛠️ 제조사 문의 관리</h2>
        <div className="table-controls">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {['전체', '답변 대기', '답변 완료'].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchInquiries}>🔍 검색</button>
        </div>
      </div>

      {/* 🔹 문의 테이블 */}
      <table className="inquiry-table">
        <thead>
          <tr>
            <th>카테고리</th>
            <th>고객사</th>
            <th>제목</th>
            <th>상태</th>
            <th>등록일</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.user_id}</td>
              <td>{item.title}</td>
              <td>
                <span className={`badge ${item.status === '02' ? 'badge-done' : 'badge-pending'}`}>
                  {item.status === '02' ? '답변 완료' : '답변 대기'}
                </span>
              </td>
              <td>{item.created_at?.slice(0, 10)}</td>
              <td>
                <button className="view" onClick={() => setEditingItem(item)}>
                  {item.status === '02' ? '답변 보기' : '답변 작성'}
                </button>
                <button className="delete" onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 페이지네이션 */}
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

      {/* 🔹 답변 모달 */}
      {editingItem && (
        <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>문의 답변</h3>

            <div className="modal-row"><label>제목</label><div className="input-area">{editingItem.title}</div></div>
            <div className="modal-row"><label>고객사</label><div className="input-area">{editingItem.user_id}</div></div>
            <div className="modal-row"><label>문의 내용</label><div className="input-area">{editingItem.content}</div></div>

            <div className="modal-row">
              <label>상태</label>
              <div className="input-area">
                <select name="status" defaultValue={editingItem.status}>
                  <option value="01">답변 대기</option>
                  <option value="02">답변 완료</option>
                </select>
              </div>
            </div>

            <div className="modal-row">
              <label>답변 내용</label>
              <div className="input-area">
                <textarea name="response" defaultValue={editingItem.comments?.[0]?.content || ''} rows={5} required />
              </div>
            </div>

            <div className="modal-row">
              <label>첨부 파일</label>
              <div className="input-area">
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg" />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setEditingItem(null)}>취소</button>
              <button type="submit">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* 🔹 삭제 확인 모달 */}
      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 <strong>{deletingItem?.title}</strong> 문의를 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmDeleteId(null)}>취소</button>
              <button className="danger" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
