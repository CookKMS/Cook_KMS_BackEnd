
##  필수 패키지 설치 명령어

```bash
pip install Flask==3.1.1 Flask-SQLAlchemy==3.1.1 PyMySQL==1.1.1 python-dotenv==1.1.0 bcrypt==4.3.0 PyJWT==2.10.1 Pillow==10.3.0
```

---

## 기능 테스트 방법 (Postman 사용)

### 1. 회원가입

**요청 URL**  
```
POST http://127.0.0.1:5000/api/auth/register
```

**요청 헤더**  
```
Content-Type: application/json
```

**요청 바디 예시 (일반 사용자)**  
```json
{
  "user_id": "user01",
  "password": "1234",
  "role": "user"
}
```

**요청 바디 예시 (관리자)**  
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

**요청 URL**  
```
POST http://127.0.0.1:5000/api/auth/login
```

**요청 헤더**  
```
Content-Type: application/json
```

**요청 바디 예시**  
```json
{
  "user_id": "admin01",
  "password": "1234"
}
```

---

### 3. 토큰 인증

**요청 URL**  
```
GET http://127.0.0.1:5000/api/me
```

**요청 헤더**  
```
Authorization: Bearer {발급받은 토큰}
```

---

### 4. 관리자 권한 인증

**요청 URL**  
```
GET http://127.0.0.1:5000/api/admin/dashboard
```

**요청 헤더**  
```
Authorization: Bearer {발급받은 토큰}
```

---

