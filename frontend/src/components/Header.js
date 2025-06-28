// src/components/Header.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css'; // ✅ 헤더 스타일 경로

function Header() {
  const location = useLocation();

  // ✅ 상단 메뉴 항목 정의
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/my-inquiries', label: '제조사 문의' },
    { path: '/faq', label: 'FAQ' },
    { path: '/mypage', label: 'MyPage' },
  ];

  return (
    <header className="main-header">
      {/* 🔹 왼쪽: 로고 + 메뉴 */}
      <div className="left-section">
        <div className="logo">지식관리</div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 🔹 오른쪽: 로그인 버튼 */}
      <div className="right-section">
        <Link
          to="/login"
          className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
        >
          로그인
        </Link>
      </div>
    </header>
  );
}

export default Header;
