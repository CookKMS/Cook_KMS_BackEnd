// src/pages/MyPage.js

import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

export default function MyPage() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

   // ✅ 나의 문의 목록 불러오기
  useEffect(() => {
   const fetchMyInquiries = async () => {
     try {
       const res = await axios.get("/api/my/inquiries");
       setInquiries(res.data.inquiries); // ✅ 수정됨
     } catch (err) {
       console.error("나의 문의 불러오기 실패:", err);
       setInquiries([]); // 방어
     }
   };
   fetchMyInquiries();
  }, []);
 

  const totalPages = Math.ceil(inquiries.length / inquiriesPerPage);
  const paged = inquiries.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // ✅ 문의 삭제
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/my/inquiries/${id}`); // ✅ 수정됨
      setInquiries(prev => prev.filter(q => q.id !== id));
      setConfirmDeleteId(null);
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert("삭제 실패");
      console.error(err);
    }
  };

  // ✅ 문의 수정
  const handleEditSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      title: form.title.value,
      content: form.inquiryContent.value,
      category: form.category.value,
    };

    try {
      await axios.put(`/api/my/inquiries/${editingItem.id}`, updated); // ✅ 수정됨
      setInquiries(prev =>
        prev.map((q) =>
          q.id === editingItem.id ? { ...q, ...updated } : q
        )
      );
      setEditingItem(null);
    } catch (err) {
      alert("수정 실패");
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <section>
          <hgroup>
            <h2>나의 문의 내역</h2>
            <h3>본인이 작성한 문의를 확인하고 수정/삭제할 수 있습니다.</h3>
          </hgroup>

          <div className="inquiry-list">
            {paged.map((item) => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedId === item.id ? "expanded" : ""}`}
                onClick={() => toggleExpand(item.id)}
                tabIndex={0}
                aria-expanded={expandedId === item.id}
                role="button"
              >
                <header className="card-header">
                  <div className="left-group">
                    <div className="status-tags">
                      <span className="category-tag">{item.category}</span>
                      <span className={`answer-status ${item.status === "02" ? "answered" : "pending"}`}>
                        {item.status === "02" ? "답변 완료" : "답변 대기"}
                      </span>
                    </div>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.created_at?.slice(0, 10).replace(/-/g, ".")}</time>
                    {item.status !== "02" ? (
                      <>
                        <button className="btn-delete" onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(item.id);
                        }}>🗑️</button>
                        <button className="btn-edit" onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}>✏️</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-disabled" disabled title="답변 완료된 문의는 삭제할 수 없습니다.">🗑️</button>
                        <button className="btn-disabled" disabled title="답변 완료된 문의는 수정할 수 없습니다.">✏️</button>
                      </>
                    )}
                  </div>
                </header>

                {expandedId === item.id && (
                  <section className="card-details" onClick={(e) => e.stopPropagation()}>
                    <div className="inquiry-content-section">
                      <strong>문의 내용</strong>
                      <p>{item.content}</p>
                      {item.file_path && (
                        <a href={item.file_path} target="_blank" rel="noreferrer">
                          📎 첨부파일 다운로드
                        </a>
                      )}
                      <time className="content-date">{item.created_at?.slice(0, 10).replace(/-/g, ".")}</time>
                    </div>
                    {item.comments && item.comments.length > 0 ? (
                      <div className="answer-section">
                        <strong>답변</strong>
                        <p>{item.comments[0].content}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        <i>ℹ️</i> 현재 문의 내용을 검토 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="페이지 이동">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </nav>
          )}

          {/* 수정 모달 */}
          {editingItem && (
            <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
              <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleEditSave}>
                <h3>문의 수정</h3>
                <label>
                  제목
                  <input name="title" defaultValue={editingItem.title} required />
                </label>
                <label>
                  카테고리
                  <select name="category" defaultValue={editingItem.category} required>
                    <option value="문의">문의</option>
                    <option value="버그">버그</option>
                    <option value="장애">장애</option>
                    <option value="수정">수정</option>
                    <option value="새 기능">새 기능</option>
                    <option value="긴급 지원">긴급 지원</option>
                  </select>
                </label>
                <label>
                  문의 내용
                  <textarea name="inquiryContent" rows={5} defaultValue={editingItem.content} required />
                </label>
                <div className="modal-footer">
                  <button type="button" onClick={() => setEditingItem(null)}>취소</button>
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
                <div className="modal-footer">
                  <button onClick={() => setConfirmDeleteId(null)}>취소</button>
                  <button onClick={() => handleDelete(confirmDeleteId)}>삭제</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
