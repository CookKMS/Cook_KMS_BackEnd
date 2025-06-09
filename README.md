# KMS 시스템 백엔드

## 소개

KMS(Knowledge Management System)는 사내 직원과 고객사 간의 지식 공유 및 문의 처리를 효율적으로 지원하는 백엔드 시스템입니다.  
Flask 기반으로 구축되었으며, 사용자 인증, 파일 업로드, 지식 등록/조회, 문의/FAQ 관리, 관리자 대시보드 등의 기능을 제공합니다.

---

## 주요 기능

- JWT 기반 사용자 인증 및 권한 관리
- 파일 업로드 (AWS S3 연동)
- 지식 등록, 조회, 수정, 삭제
- 문의 등록 및 답변 처리
- FAQ 등록 및 조회
- 공통 코드 시스템 기반 카테고리 관리
- 관리자 대시보드 메트릭 제공 (예정)

---

## 폴더 구조

```plaintext
kms_project/
├── app.py
├── run.py
├── models/
│   └── [각종 모델 파일: user.py, knowledge.py 등]
├── services/
│   └── [비즈니스 로직 처리 서비스 모듈]
├── routes/
│   └── [API 라우트 모듈]
├── utils/
│   └── [공통 유틸리티 함수들]
├── uploads/
│   └── [업로드 파일 저장용 (개발환경)]
├── .env
└── requirements.txt


##  필수 패키지 설치 명령어

```bash
pip install Flask==3.1.1 Flask-SQLAlchemy==3.1.1 PyMySQL==1.1.1 python-dotenv==1.1.0 bcrypt==4.3.0 PyJWT==2.10.1 Pillow==10.3.0
```

---

## 기능 테스트 가이드 (Postman 기준)

Flask 서버가 실행 중이어야 하며, 기본 URL은 `http://127.0.0.1:5000` 입니다.

---

### 1. 회원가입 (일반 사용자 / 관리자)

**POST** `/api/auth/register`  
**Headers:** `Content-Type: application/json`

요청 예시 - 일반 사용자:
```json
{
  "user_id": "user01",
  "password": "1234",
  "role": "user"
}
```

요청 예시 - 관리자:
```json
{
  "user_id": "admin01",
  "password": "1234",
  "role": "admin",
  "admin_key": "hansei-admin-secret"
}
```

---

### 2. 로그인

**POST** `/api/auth/login`  
**Headers:** `Content-Type: application/json`

요청 예시:
```json
{
  "user_id": "admin01",
  "password": "1234"
}
```

응답 예시:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

---

### 3. 토큰 인증 확인

**GET** `/api/me`  
**Headers:** `Authorization: Bearer {access_token}`

---

### 4. 관리자 권한 확인

**GET** `/api/admin/dashboard`  
**Headers:** `Authorization: Bearer {access_token}`

---

### 5. 파일 업로드

**POST** `/api/files/upload`  
**요청 타입:** form-data

**form-data 예시:**

| key      | value        |
|----------|--------------|
| file     | [파일 선택]   |
| name     | test.pdf     |
| uploader | admin01      |

---

### 6. 지식 등록 (파일 포함 / 미포함)

**POST** `/api/knowledge`  
**요청 타입:** form-data

form-data 예시 - 파일 포함:

| key         | value        |
|-------------|--------------|
| title       | 예제 제목     |
| content     | 예제 본문     |
| category_id | 1            |
| writer      | admin01      |
| file        | [파일 선택]   |

form-data 예시 - 파일 없음:

| key         | value         |
|-------------|---------------|
| title       | 파일 없이 등록 |
| content     | 본문만 입력    |
| category_id | 1             |
| writer      | admin01       |

---

### 7. 공통 코드 조회

**GET** `/api/common?group=knowledge_category`

예시 응답:
```json
[
  {
    "id": 1,
    "group": "knowledge_category",
    "code": "KT001",
    "name": "기술 자료"
  },
  {
    "id": 2,
    "group": "knowledge_category",
    "code": "KT002",
    "name": "FAQ"
  }
]
```

---

### 8. FAQ 등록 (관리자 전용)

**POST** `/api/faq`  
**Headers:**  
`Authorization: Bearer {access_token}`  
`Content-Type: application/json`

요청 예시:
```json
{
  "question": "로그인이 안 됩니다.",
  "answer": "비밀번호를 재설정해 주세요.",
  "category_id": 1
}
```

---

### 9. 문의 등록

**POST** `/api/inquiry`  
**Headers:** `Content-Type: application/json`

요청 예시:
```json
{
  "title": "서비스 오류가 있습니다.",
  "content": "이용 중 오류가 발생합니다.",
  "writer": "user01"
}
```

---

### 10. 문의 답변 등록 (관리자 전용)

**POST** `/api/inquiry/{inquiry_id}/answer`  
**Headers:**  
`Authorization: Bearer {access_token}`  
`Content-Type: application/json`

요청 예시:
```json
{
  "content": "현재 문제를 확인 중입니다. 빠르게 처리하겠습니다."
}
```