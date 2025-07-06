// src/pages/auth/AdminRegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/AdminRegisterPage.css';
import axiosInstance from '../../utils/axiosInstance';

function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminKey: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, adminKey } = formData;

    if (!username || !password || !adminKey) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username,
    password,
    role: 'admin',
    admin_key: adminKey,
  }),
});


      if (!res.ok) {
        throw new Error('회원가입 실패');
      }

      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/admin-login');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-tabs">
        <Link to="/register" className="tab">사용자 회원가입</Link>
        <button className="active">관리자 회원가입</button>
        <Link to="/employee-register" className="tab">사원 회원가입</Link>
      </div>

      <h2>관리자 회원가입</h2>

      <form className="admin-register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="관리자 아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="관리자 비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="adminKey"
          placeholder="관리자 키를 입력하세요"
          value={formData.adminKey}
          onChange={handleChange}
          required
        />

        <button type="submit" className="admin-register-button">
          관리자 회원가입
        </button>
      </form>

      <div className="admin-auth-links">
        이미 계정이 있으신가요? <Link to="/admin-login">관리자 로그인</Link>
      </div>
    </div>
  );
}

export default AdminRegisterPage;
