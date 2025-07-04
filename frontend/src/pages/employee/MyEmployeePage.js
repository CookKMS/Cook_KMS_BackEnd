// src/pages/employee/MyEmployeePage.js
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/MyEmployeePage.css";

const categoryMap = {
  "새 기능": "FEATURE",
  "수정": "EDIT",
  "버그": "BUG",
  "문의": "QUESTION",
  "장애": "ISSUE",
  "긴급 지원": "EMERGENCY",
};
const reverseCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([k, v]) => [v, k])
);

export default function MyEmployeePage() {
  const [inquiries, setInquiries] = useState([]);
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [expandedInquiryId, setExpandedInquiryId] = useState(null);
  const [expandedKnowledgeId, setExpandedKnowledgeId] = useState(null);
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState(null);
  const [confirmDeleteKnowledgeId, setConfirmDeleteKnowledgeId] = useState(null);
  const [currentInquiryPage, setCurrentInquiryPage] = useState(1);
  const [currentKnowledgePage, setCurrentKnowledgePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get("/api/my/inquiries");
        const res2 = await axios.get("/api/my/knowledge");
        setInquiries(res1.data.inquiries || []);
        const list = Array.isArray(res2.data.knowledge_list) ? res2.data.knowledge_list : [];
        setKnowledgeList(list);
      } catch (err) {
        alert("데이터 불러오기 실패");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const pagedInquiries = inquiries.slice((currentInquiryPage - 1) * itemsPerPage, currentInquiryPage * itemsPerPage);
  const pagedKnowledge = knowledgeList.slice((currentKnowledgePage - 1) * itemsPerPage, currentKnowledgePage * itemsPerPage);
  const inquiryPages = Math.ceil(inquiries.length / itemsPerPage);
  const knowledgePages = Math.ceil(knowledgeList.length / itemsPerPage);

  const handleDeleteInquiry = async () => {
    try {
      await axios.delete(`/api/my/inquiries/${confirmDeleteInquiryId}`);
      setInquiries(prev => prev.filter(q => q.id !== confirmDeleteInquiryId));
    } catch {
      alert("문의 삭제 실패");
    }
    setConfirmDeleteInquiryId(null);
  };

  const handleDeleteKnowledge = async () => {
    try {
      await axios.delete(`/api/my/knowledge/${confirmDeleteKnowledgeId}`);
      setKnowledgeList(prev => prev.filter(k => k.id !== confirmDeleteKnowledgeId));
    } catch {
      alert("문서 삭제 실패");
    }
    setConfirmDeleteKnowledgeId(null);
  };

  return (
    <>
      <EmployeeHeader />
      <main className="container">
        {/* 문의 내역 */}
        <section>
          <hgroup>
            <h2>나의 문의 내역</h2>
            <h3>직원이 등록한 문의를 확인하고 삭제할 수 있습니다.</h3>
          </hgroup>

          <div className="inquiry-list">
            {pagedInquiries.map(item => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedInquiryId === item.id ? "expanded" : ""}`}
                onClick={() => setExpandedInquiryId(prev => prev === item.id ? null : item.id)}
              >
                <header className="card-header">
                  <div className="left-group">
                    <div className="status-tags">
                      <span className="category-tag">{item.category_name || reverseCategoryMap[item.category_code]}</span>
                      <span className={`answer-status ${item.status === "02" ? "answered" : "pending"}`}>
                        {item.status === "02" ? "답변 완료" : "답변 대기"}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.created_at}</time>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteInquiryId(item.id); }}>🗑️</button>
                  </div>
                </header>
                {expandedInquiryId === item.id && (
                  <section className="card-details">
                    <p>{item.content}</p>
                    {item.file_path && (
                      <div className="file-attachment">
                        📎{" "}
                        <a
                          href={`${process.env.REACT_APP_API_BASE_URL}/${item.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          첨부파일 다운로드
                        </a>
                      </div>
                    )}
                    {item.answer ? (
                      <div className="answer-section">
                        <strong>답변</strong>
                        <p>{item.answer}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        답변을 기다리는 중입니다.
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {inquiryPages > 1 && (
            <nav className="pagination">
              {Array.from({ length: inquiryPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentInquiryPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentInquiryPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </section>

        {/* 지식 문서 내역 */}
        <section>
          <hgroup>
            <h2>나의 지식 문서</h2>
            <h3>직원이 작성한 문서를 확인하고 삭제할 수 있습니다.</h3>
          </hgroup>

          <div className="inquiry-list">
            {pagedKnowledge.map(item => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedKnowledgeId === item.id ? "expanded" : ""}`}
                onClick={() => setExpandedKnowledgeId(prev => prev === item.id ? null : item.id)}
              >
                <header className="card-header">
                  <div className="left-group">
                    <span className="category-tag">{item.category_name || reverseCategoryMap[item.category_code]}</span>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.created_at}</time>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteKnowledgeId(item.id); }}>🗑️</button>
                  </div>
                </header>
                {expandedKnowledgeId === item.id && (
                  <section className="card-details">
                    <strong>내용</strong>
                    <p>{String(item.content || "내용 없음")}</p>
                    {item.file_path && (
                      <div className="file-attachment">
                        📎{" "}
                        <a
                          href={`${process.env.REACT_APP_API_BASE_URL}/${item.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          첨부파일 다운로드
                        </a>
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {knowledgePages > 1 && (
            <nav className="pagination">
              {Array.from({ length: knowledgePages }).map((_, i) => (
                <button
                  key={i}
                  className={currentKnowledgePage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentKnowledgePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </section>
      </main>

      {/* 문의 삭제 모달 */}
      {confirmDeleteInquiryId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteInquiryId(null)}>
          <div className="modal confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>문의 삭제</h3>
            <p>정말로 이 문의를 삭제하시겠습니까?</p>
            <footer className="modal-footer">
              <button className="btn cancel-btn" onClick={() => setConfirmDeleteInquiryId(null)}>취소</button>
              <button className="btn delete-btn" onClick={handleDeleteInquiry}>삭제</button>
            </footer>
          </div>
        </div>
      )}

      {/* 문서 삭제 모달 */}
      {confirmDeleteKnowledgeId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteKnowledgeId(null)}>
          <div className="modal confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>문서 삭제</h3>
            <p>정말로 이 문서를 삭제하시겠습니까?</p>
            <footer className="modal-footer">
              <button className="btn cancel-btn" onClick={() => setConfirmDeleteKnowledgeId(null)}>취소</button>
              <button className="btn delete-btn" onClick={handleDeleteKnowledge}>삭제</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
