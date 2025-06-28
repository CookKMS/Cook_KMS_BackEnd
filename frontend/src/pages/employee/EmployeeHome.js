// src/pages/employee/EmployeeHome.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from './EmployeeHeader'; // 사원용 공통 헤더
import '../../styles/HomePage.css'; // 사용자와 동일한 스타일 재사용

function EmployeeHome() {
  const navigate = useNavigate();

  // 🔹 버튼 클릭 시 지식관리 페이지로 이동
  const handleStartClick = () => {
    navigate('/employee-knowledge');
  };

  return (
    <>
      {/* 🔹 사원 전용 헤더 렌더링 */}
      <EmployeeHeader />

      {/* 🔹 홈 콘텐츠 영역 */}
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">사원을 위한 지식 포털</h1>
          <p className="home-description">
            사내 공유 지식과 문서를 한 곳에서 관리하세요.
          </p>
          <button className="start-button" onClick={handleStartClick}>
            지식 문서 확인하기
          </button>
        </div>
      </div>
    </>
  );
}

export default EmployeeHome;
