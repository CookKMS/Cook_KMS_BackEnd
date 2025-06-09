
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