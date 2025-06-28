// src/components/AdminHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminHeader.css';

export default function AdminHeader() {
  const navigate = useNavigate();

  // 🔹 로그아웃 처리 (토큰 제거 및 로그인 페이지 이동)
  const handleLogout = () => {
    localStorage.removeItem('token'); // JWT 토큰 제거
    navigate('/admin-login');        // 로그인 페이지로 이동
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <h1 className="admin-header-title">KMS 관리자 대시보드</h1>
        <div className="admin-header-actions">
          <div className="admin-badge">관</div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
