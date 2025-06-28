import React from 'react';
import '../../../styles/Admin/StatCard.css';

/**
 * ✅ StatCard 컴포넌트
 * - 관리자 대시보드 통계 카드로 사용
 * - props:
 *    - title: 항목 이름 (ex. "총 지식 문서")
 *    - value: 수치 값 (ex. 124)
 *    - change: 전월 대비 증감 퍼센트 (숫자, 생략 가능)
 *    - trend: 'up' 또는 'down' (증감 방향)
 *    - icon: FontAwesome 아이콘명 (ex. 'file-alt')
 *    - color: 카드 색상 (ex. 'blue', 'red', 'green', etc.)
 */
export default function StatCard({ title, value, change, trend, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
        {change !== undefined && (
          <span className={`stat-card-change ${trend}`}>
            {trend === 'up' ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className={`stat-card-icon ${color}`}>
        <i className={`fas fa-${icon}`}></i>
      </div>
    </div>
  );
}
