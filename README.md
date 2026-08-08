# 📅 업무 관리 센터

React + Vite + Tailwind CSS 4 + Supabase로 만든 개인용 업무(할 일) 관리 앱입니다. 업무 추가, 완료 토글, 수정, 삭제 기능을 제공합니다.

## 시작하기

1. 의존성 설치
   ```
   npm install
   ```

2. Supabase 프로젝트 준비
   - [supabase.com](https://supabase.com)에서 프로젝트를 생성합니다 (기존 프로젝트가 있다면 재사용해도 됩니다).
   - 프로젝트의 **SQL Editor**에서 [`schema.sql`](./schema.sql) 내용을 실행해 `tasks` 테이블을 만듭니다.
   - **Project Settings → API**에서 Project URL과 anon public key를 확인합니다.

3. 환경변수 설정
   - `.env.example`을 참고해 `.env` 파일에 아래 값을 채웁니다.
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - `.env`는 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다.

4. 개발 서버 실행
   ```
   npm run dev
   ```

## 스크립트

- `npm run dev` — 개발 서버 실행
- `npm run build` — 프로덕션 빌드
- `npm run preview` — 빌드 결과 미리보기
- `npm run lint` — oxlint 실행

## 기술 스택

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) (`@tailwindcss/vite` 플러그인)
- [Supabase](https://supabase.com/) (`tasks` 테이블, anon key 기반)
- [lucide-react](https://lucide.dev/) 아이콘
