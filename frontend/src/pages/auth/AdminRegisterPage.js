// src/pages/auth/AdminRegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/AdminRegisterPage.css';

function AdminRegisterPage() {
  // 🔹 관리자 회원가입 입력 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    adminKey: '', // 관리자 전용 키 입력 필드
  });

  const [isChecking, setIsChecking] = useState(false); // 중복 확인 진행 중 여부
  const navigate = useNavigate();

  // 🔹 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 아이디 중복 확인 요청
  const handleCheckDuplicate = async () => {
    if (!formData.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      setIsChecking(true);

      // ✅ 중복 확인 API 호출 (POST /api/auth/check-duplicate)
      const res = await fetch('http://localhost:5000/api/auth/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username }),
      });

      const result = await res.json();

      if (result.exists) {
        alert('이미 사용 중인 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (err) {
      console.error('중복 확인 오류:', err);
      alert('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 🔹 회원가입 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, adminKey } = formData;

    // 🔸 필수 항목 클라이언트 측 검사
    if (!username || !password || !confirmPassword || !adminKey) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // ✅ 관리자 회원가입 API 요청 (POST /api/auth/admin-register)
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          role: 'admin',
          admin_key: adminKey, // 백엔드에서 'admin_key'로 받음
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
      {/* 🔹 회원가입 탭 전환 UI */}
      <div className="admin-register-tabs">
        <Link to="/register" className="tab">사용자 회원가입</Link>
        <button className="active">관리자 회원가입</button>
        <Link to="/employee-register" className="tab">사원 회원가입</Link>
      </div>

      <h2>관리자 회원가입</h2>

      {/* 🔹 관리자 회원가입 입력 폼 */}
      <form className="admin-register-form" onSubmit={handleSubmit}>
        {/* 🔸 아이디 입력 + 중복확인 버튼 */}
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="관리자 아이디를 입력하세요"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="check-button"
            onClick={handleCheckDuplicate}
            disabled={isChecking}
          >
            중복확인
          </button>
        </div>

        {/* 🔸 비밀번호 입력 */}
        <input
          type="password"
          name="password"
          placeholder="관리자 비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* 🔸 비밀번호 확인 입력 */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* 🔸 관리자 전용 키 입력 */}
        <input
          type="password"
          name="adminKey"
          placeholder="관리자 키를 입력하세요"
          value={formData.adminKey}
          onChange={handleChange}
          required
        />

        {/* 🔸 제출 버튼 */}
        <button type="submit" className="admin-register-button">
          관리자 회원가입
        </button>
      </form>

      {/* 🔸 로그인 페이지 이동 링크 */}
      <div className="admin-auth-links">
        이미 계정이 있으신가요? <Link to="/admin-login">관리자 로그인</Link>
      </div>
    </div>
  );
}

export default AdminRegisterPage;
