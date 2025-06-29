// src/components/Header.js

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 로그인 상태 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // ✅ 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/my-inquiries', label: '고객사 문의' },
    { path: '/faq', label: 'FAQ' },
    { path: '/mypage', label: 'MyPage' },
  ];

  return (
    <header className="main-header">
      <div className="left-section">
        <div className="logo">사용자 포털</div>
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

      {/* ✅ 로그인 상태에 따라 버튼 변경 */}
      <div className="right-section">
        {isLoggedIn ? (
          <button className="nav-link" onClick={handleLogout}>로그아웃</button>
        ) : (
          <Link
            to="/login"
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
