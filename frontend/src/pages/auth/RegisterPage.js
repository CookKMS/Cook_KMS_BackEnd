// src/pages/auth/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/RegisterPage.css';
import axios from '../../utils/axiosInstance';

function UserRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', {
        username,
        password,
        role: 'user',
      });

      if (res.status === 201) {
        alert(res.data.message || '회원가입이 완료되었습니다.');
        navigate('/login');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error.response?.status === 400) {
        alert('필수 항목 누락 또는 중복된 아이디입니다.');
      } else {
        alert('회원가입 중 서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-tabs">
        <button className="active">사용자 회원가입</button>
        <Link to="/admin-register" className="tab">관리자 회원가입</Link>
        <Link to="/employee-register" className="tab">사원 회원가입</Link>
      </div>

      <h2>사용자 회원가입</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button">회원가입</button>
      </form>

      <div className="auth-links">
        이미 계정이 있으신가요? <Link to="/login">사용자 로그인</Link>
      </div>
    </div>
  );
}

export default UserRegisterPage;
