// src/pages/auth/EmployeeLoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/EmployeeLoginPage.css';
import axios from '../../utils/axiosInstance'; // ✅ axiosInstance 사용

function EmployeeLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ 로그인 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // 📌 사원 로그인 API
      const res = await axios.post('/api/auth/login', {
        username,
        password,
      });

      const { access_token } = res.data;

      // 📌 JWT 토큰 저장
      localStorage.setItem('token', access_token);

      // 📌 사원 홈 이동
      navigate('/employee-home');
    } catch (error) {
      if (error.response?.status === 400) {
        alert('아이디 또는 비밀번호가 누락되었습니다.');
      } else if (error.response?.status === 401) {
        alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
      } else {
        alert('로그인 중 서버 오류가 발생했습니다.');
      }
      console.error('로그인 오류:', error);
    }
  };

  return (
    <div className="employee-login-container">
      <div className="employee-login-tabs">
        <Link to="/login" className="tab">사용자 로그인</Link>
        <Link to="/admin-login" className="tab">관리자 로그인</Link>
        <button className="active">사원 로그인</button>
      </div>

      <h2>사원 로그인</h2>

      <form className="employee-login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="사번 또는 아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="employee-login-button">
          로그인
        </button>
      </form>

      <div className="employee-auth-links">
        계정이 없으신가요? <Link to="/employee-register">사원 회원가입</Link>
      </div>
    </div>
  );
}

export default EmployeeLoginPage;
