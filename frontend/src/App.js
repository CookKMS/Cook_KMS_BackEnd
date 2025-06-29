import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 사용자용 페이지
import HomePage from './pages/HomePage';
import Knowledge from './pages/Knowledge';
import FAQPage from './pages/FAQPage';
import InquiryPage from './pages/InquiryPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// 관리자 로그인/회원가입/대시보드
import AdminLoginPage from './pages/auth/AdminLoginPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// 사원 로그인/회원가입
import EmployeeLoginPage from './pages/auth/EmployeeLoginPage';
import EmployeeRegisterPage from './pages/auth/EmployeeRegisterPage';

// ✅ 사원 전용 페이지들 (추가된 부분)
import EmployeeInquiriesPage from './pages/employee/EmployeeInquiriesPage';
import EmployeeKnowledgePage from './pages/employee/EmployeeKnowledgePage';
import EmployeeFaqPage from './pages/employee/EmployeeFaqPage'
import EmployeeHome from './pages/employee/EmployeeHome'
import MyEmployeePage from './pages/employee/MyEmployeePage';
function App() {
  return (
    <Router>
      <Routes>
        {/* 사용자용 페이지 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 관리자 페이지 */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-register" element={<AdminRegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 사원 포털 페이지 ✅ */}
        <Route path="/employee-login" element={<EmployeeLoginPage />} />
        <Route path="/employee-register" element={<EmployeeRegisterPage />} />
        <Route path="/employee-Inquiry" element={<EmployeeInquiriesPage />} />
        <Route path="/employee-knowledge" element={<EmployeeKnowledgePage />} />
        <Route path="/employee-faq" element={<EmployeeFaqPage />} />
        <Route path="/employee-Home" element={<EmployeeHome />} />
        <Route path="/employee-mypage" element={<MyEmployeePage />} />

        
      </Routes>
    </Router>
  );
}

export default App;