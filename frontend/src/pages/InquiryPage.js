import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Header from "../components/Header";
// import "../styles/InquiryPage.css"; // ❌ 파일이 없으면 에러 발생 → 주석 처리하거나 파일 생성 필요

const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  const fetchAllInquiries = async () => {
    try {
      const res = await axios.get("/api/inquiry");
      setInquiries(res.data);
    } catch (err) {
      console.error("전체 문의 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchAllInquiries();
  }, []);

  const filtered = inquiries.filter((item) => {
    const matchCategory = filter === "전체" || item.category === filter;
    const matchKeyword =
      (item.title || "").includes(search) ||
      (item.content || "").includes(search);
    return matchCategory && matchKeyword;
  });

  const totalPages = Math.ceil(filtered.length / inquiriesPerPage);
  const paged = filtered.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Header />
      <main className="container">
        <section>
          <hgroup>
            <h2>전체 문의</h2>
            <h3>모든 문의 사항을 확인할 수 있습니다</h3>
          </hgroup>

          <div className="search-filter-box">
            <input
              type="text"
              placeholder="키워드 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={filter === cat ? "active" : ""}
                onClick={() => {
                  setFilter(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="inquiry-header">
            <h3>문의 목록</h3>
            <span>총 {filtered.length}건</span>
          </div>

          <div className="inquiry-list">
            {paged.map((item) => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedId === item.id ? "expanded" : ""}`}
                onClick={() => toggleExpand(item.id)}
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
                    <span className="author-id">{item.user_id || "작성자 없음"}</span>
                    <time>{item.created_at?.slice(0, 10).replace(/-/g, ".")}</time>
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
                      <div className="pending-answer-notice">답변을 기다리는 중입니다.</div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
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
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </nav>
          )}
        </section>
      </main>
    </>
  );
}
