// src/pages/auth/EmployeeRegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/EmployeeRegisterPage.css';
import axios from '../../utils/axiosInstance'; // ✅ axiosInstance 사용

function EmployeeRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    employeeCode: '',
  });

  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ 아이디 중복 확인
  const handleCheckDuplicate = async () => {
    if (!formData.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      setIsChecking(true);
      const res = await axios.post('/api/auth/check-duplicate', {
        username: formData.username,
      });

      if (res.data.exists) {
        alert('이미 사용 중인 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (err) {
      console.error('중복 확인 실패:', err);
      alert('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // ✅ 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, employeeCode } = formData;

    if (!username || !password || !confirmPassword || !employeeCode) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const VALID_EMPLOYEE_CODE = 'EMP2025'; // ✅ 프론트 유효성 검증
    if (employeeCode !== VALID_EMPLOYEE_CODE) {
      alert('인증 코드가 유효하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', {
        username,
        password,
        role: 'employee',
        employee_number: employeeCode
      });

      if (res.status === 201) {
        alert(res.data.message || '회원가입이 완료되었습니다.');
        navigate('/employee-login');
      }
    } catch (err) {
      console.error('회원가입 실패:', err);
      if (err.response?.status === 400) {
        alert('필수 항목 누락 또는 중복된 아이디입니다.');
      } else {
        alert('회원가입 중 서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="employee-register-container">
      <div className="employee-register-tabs">
        <Link to="/register" className="tab">사용자 회원가입</Link>
        <Link to="/admin-register" className="tab">관리자 회원가입</Link>
        <button className="active">사원 회원가입</button>
      </div>

      <h2>사원 회원가입</h2>

      <form className="employee-register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="사번 또는 아이디를 입력하세요"
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

        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="employeeCode"
          placeholder="사내 인증 코드를 입력하세요"
          value={formData.employeeCode}
          onChange={handleChange}
          required
        />

        <button type="submit" className="employee-register-button">
          사원 회원가입
        </button>
      </form>

      <div className="employee-auth-links">
        이미 계정이 있으신가요? <Link to="/employee-login">사원 로그인</Link>
      </div>
    </div>
  );
}

export default EmployeeRegisterPage;
