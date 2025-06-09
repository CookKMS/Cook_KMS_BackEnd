# Flask 애플리케이션 실행 스크립트
# .env 파일에서 환경 변수 로드 후 앱을 실행
# 개발 환경에서 직접 실행할 때 사용
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
