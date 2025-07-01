// src/pages/employee/EmployeeFaqPage.js

import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/FAQPage.css";

const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function EmployeeFaqPage() {
  const [faqList, setFaqList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get("/api/faq");
        setFaqList(res.data);
      } catch (err) {
        console.error("FAQ 불러오기 실패:", err);
        alert("FAQ 데이터를 불러오는 데 실패했습니다.");
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqList.filter((faq) => {
    const matchCategory = selectedCategory === "전체" || faq.category_name === selectedCategory;
    const question = typeof faq.title === "string" ? faq.title : "";
    const answer = typeof faq.content === "string" ? faq.content : "";
    const matchSearch =
      question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <EmployeeHeader />
      <main className="container faq-page">
        <h1>자주 묻는 질문 (FAQ)</h1>

        <input
          type="search"
          placeholder="검색어를 입력하세요"
          className="faq-search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <nav className="faq-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`faq-category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        <section className="faq-list">
          {paginatedFaqs.length === 0 ? (
            <p className="no-results">조회되는 FAQ가 없습니다.</p>
          ) : (
            paginatedFaqs.map((faq, idx) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + idx;
              return (
                <article
                  key={faq.id}
                  className={`faq-item ${expandedIndex === globalIndex ? "expanded" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleExpand(globalIndex)}
                  >
                    [{faq.category_name || faq.category_code}] {faq.title || "질문 없음"}
                    <span className="faq-toggle-icon">
                      {expandedIndex === globalIndex ? "▲" : "▼"}
                    </span>
                  </button>
                  {expandedIndex === globalIndex && (
                    <div className="faq-answer">
                      <p>{faq.content || "답변 없음"}</p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

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

        <footer className="faq-footer">
          <small>
            {filteredFaqs.length === 0
              ? "0"
              : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredFaqs.length
                )}`} / 총 {faqList.length}건의 자주 묻는 질문
          </small>
        </footer>
      </main>
    </>
  );
}
