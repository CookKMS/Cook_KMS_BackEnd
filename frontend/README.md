업로드한 전체 React 프론트엔드 파일 구조와 주요 기능이 구현되어 있습니다. 아래에 각 파일별 핵심 요약을 정리하고, 어떤 역할을 하는지 아래에 참고하시기 바랍니다.

---

### 📁 전체 구조 요약

| 파일명                               | 역할                             |
| --------------------------------- | ------------------------------ |
| `App.js`                          | 전체 페이지 라우팅 및 메인 컴포넌트           |
| `index.js`                        | React 앱 진입점 (root 렌더링)         |
| `index.css` / `App.css`           | 전역 스타일 설정                      |
| `LoginPage.js`, `RegisterPage.js` | 사용자 인증: 로그인 및 회원가입             |
| `HomePage.js`                     | 로그인 후 메인 대시보드                  |
| `AdminDashboard.js`               | 관리자 전용 통계 대시보드 (StatCard 포함)   |
| `FAQPage.js`                      | 자주 묻는 질문(FAQ) 페이지              |
| `MyInquiriesPage.js`              | 나의 문의 내역 페이지                   |
| `Knowledge.js`                    | 지식 목록 조회 페이지 (KMS 기능)          |
| `StatCard.js`                     | AdminDashboard 내 통계 카드 UI 컴포넌트 |

---

### 📄 주요 파일별 분석

#### ✅ `App.js`

* 전체 라우팅을 정의합니다.
* `react-router-dom`의 `Routes`, `Route` 사용
* `/`, `/login`, `/register`, `/dashboard`, `/faq`, `/my-inquiries`, `/knowledge` 라우트 구성

#### ✅ `index.js`

* `ReactDOM.createRoot`로 앱을 `root` DOM에 마운트합니다.
* CSS 불러오기 포함 (`index.css`, `App.css`)

#### ✅ `LoginPage.js` / `RegisterPage.js`

* 기본적인 로그인/회원가입 폼 구현됨
* 스타일 정돈 필요 일부 있음 (예: 버튼 y축 정렬 문제는 이전에 언급된 개선사항 반영 필요)

#### ✅ `HomePage.js`

* 로그인 후 접속하는 사용자 홈 화면
* 현재는 환영 메시지 정도만 표시됨

#### ✅ `AdminDashboard.js`

* 관리자 권한 전용 페이지로 통계 카드 컴포넌트(`StatCard`)를 3개 렌더링
* 추후 API 연동을 위해 `useEffect` 내부에 주석으로 `fetch` 코드가 준비됨

#### ✅ `StatCard.js`

* `AdminDashboard`에서 사용하는 재사용 가능한 UI 컴포넌트
* props로 `title`, `value`, `icon`을 받아 렌더링

#### ✅ `FAQPage.js`

* FAQ 목록 테이블 + 등록 폼 존재
* 카테고리 선택 가능
* 파일 업로드 input 포함 (아직 기능 미연결)
* `useState`, `useEffect`, `map` 등으로 간단한 CRUD UI 흉내만 구현됨

#### ✅ `MyInquiriesPage.js`

* 사용자 자신의 문의 내역 리스트 렌더링
* 현재는 `dummy` 데이터 기반 `map` 렌더링만 되어 있음

#### ✅ `Knowledge.js`

* 지식 목록을 카드 형식으로 보여줌
* 각 항목은 제목, 작성자, 등록일, 첨부파일 보기 버튼 포함
* 실제 API 연동 부분은 주석 처리되어 있음

---

### ✅ 추가로 개선하거나 연결할 작업 (추후 작업 제안)

| 항목                   | 설명                                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| 📡 API 연동            | `LoginPage`, `RegisterPage`, `FAQPage`, `Knowledge`, `AdminDashboard` 등은 백엔드와 연동 주석만 있으며, `axios` 연동이 필요 |
| 📁 파일 업로드            | FAQ 등록 시 첨부파일 input 있음 → Flask 백엔드 `file_bp` API와 연동 예정                                                  |
| 🎨 스타일 정돈            | 일부 컴포넌트(Button, Input) 높이 정렬 미세 조정 필요                                                                    |
| 🔐 JWT 연동            | 로그인 후 토큰 저장 및 인증 헤더 설정 로직 추가 예정                                                                          |
| 📃 Pagination, Modal | 문의 목록 등에 상태 기반 필터링, 모달 처리 및 페이지네이션 로직 미구현 상태                                                             |

---
