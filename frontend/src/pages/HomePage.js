// src/pages/HomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/HomePage.css';

function HomePage() {
  // 🔹 페이지 이동을 위한 React Router의 useNavigate 훅
  const navigate = useNavigate();

  /**
   * 🔹 시작하기 버튼 클릭 시 지식 페이지로 이동
   * 추후 실제 사용자용 지식 검색 페이지 라우팅에 연결됨
   * 예: /Knowledge → <Knowledge /> 컴포넌트로 연결됨
   */
  const handleStartClick = () => {
    // ✅ 추후 Flask와 연동된 지식 검색 페이지로 이동
    // 예: GET /api/knowledge 호출 포함
    navigate('/my-inquiries');
  };

  return (
    <>
      {/* 🔹 상단 공통 헤더 (로그인 상태와 무관) */}
      <Header />

      {/* 🔹 홈 콘텐츠 영역 */}
      <div className="home-container">
        <div className="home-content">
          {/* 🔸 홈페이지 메인 타이틀 */}
          <h1 className="home-title">쉽고 빠른 고객사 문의 시스템</h1>

          {/* 🔸 부제 설명 */}
          <p className="home-description">
            모든 문의와 답변 한 곳에서 관리하세요.
          </p>

          {/* 🔸 시작하기 버튼 */}
          <button
            className="start-button"
            onClick={handleStartClick}
          >
            고객사 문의 시작하기
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
