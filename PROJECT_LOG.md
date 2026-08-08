# 프로젝트 작업 기록

이 문서는 이 저장소를 다른 PC에서 가져와 작업을 시작한 뒤부터 지금까지의 진행 상황과, git에는 남지 않는 Supabase 대시보드 수동 설정들을 정리한 기록이다. 코드 자체의 최신 상태는 git 커밋 히스토리(`git log`)와 코드가 항상 우선한다 — 이 문서는 "왜 이렇게 되어 있는지"의 맥락을 보충하기 위한 것.

## 링크

- GitHub: https://github.com/revival1107-sketch/task-manager-app
- 배포 주소 (Vercel): https://task-manager-app-y2ng.vercel.app
- Supabase 프로젝트: https://supabase.com/dashboard/project/etqbcbwdviqsktkrfbtl
- 로컬 경로: `c:\Cluade_Code\task-manager-app`

## 기술 스택

- React 19 + Vite + Tailwind CSS 4 (`@tailwindcss/vite`)
- Supabase (Postgres + Auth, `@supabase/supabase-js`)
- lucide-react 아이콘
- 배포: Vercel (GitHub 연동, `main` 브랜치 push 시 자동 재배포)

## 어떻게 시작됐는지

GitHub 저장소는 원래 다른 PC에서 만든 것이었는데, 실제로 push되어 있던 건 `package.json`/`vite.config.js` 등 Vite 스캐폴딩 설정 파일뿐이었고 `src/`, `public/` 실제 코드는 없었다. 대신 사용자가 이미 쓰고 있던 Supabase 프로젝트의 `tasks` 테이블에는 실제 데이터가 들어 있었고, 그 스키마를 보고 역으로 앱을 다시 만들었다 (아래 데이터 모델 참고). 즉 이 앱의 데이터 모델은 처음부터 설계한 게 아니라 **기존 운영 데이터에 맞춰 재구성한 것**이다.

## 데이터 모델

`public.tasks` 테이블 (`schema.sql` 참고):

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | bigint identity | PK |
| `user_id` | uuid | `auth.users.id` 참조, `on delete cascade`, RLS의 기준 컬럼 |
| `name` | text | 업무 이름 |
| `content` | text | 업무 설명 |
| `milestones` | jsonb | `{ id, date, target, content, completed }[]` |
| `is_completed` | boolean | 업무 전체 완료 여부 (마일스톤과 별개로 수동 토글) |
| `current_milestone_index` | integer | milestones 배열 내 "첫 번째 미완료" 인덱스. 앱이 마일스톤 변경 시마다 자동 재계산해서 저장 (`src/hooks/useTasks.js`의 `updateMilestones`) |
| `created_at` | timestamptz | |

인증은 Supabase Auth (이메일/비밀번호). RLS 정책 `Users manage own tasks`가 `auth.uid() = user_id`로 본인 데이터만 접근하게 막는다.

## 주요 기능

- 업무 CRUD: 추가/이름·설명 수정/완료 토글(재작업 가능)/삭제
- 마일스톤 CRUD: 업무별로 날짜·대상·내용 추가/수정/완료 토글/삭제
- 신호등(마감 임박도): 오늘 기준 D-3 이내 빨강, D-7 이내 노랑, 그 이상 초록 (`src/milestoneUtils.js`)
- 업무 카드를 접으면 가장 가까운(가장 급한) 미완료 마일스톤을 박스로 요약 표시 — 단, 업무 자체가 완료 처리되면 이 요약은 숨김
- 업무 이름 옆에 전체 마일스톤 중 가장 늦은(최종) 날짜를 괄호로 표기
- 로그인/회원가입/로그아웃/회원 탈퇴 (계정별 데이터 완전 분리)
- 테마: Bright / Dark / System 3단 선택, localStorage에 저장, 기본값은 Bright. 다크 배경은 Chrome 다크모드 색상(#202124/#292a2d/#3c4043)에 맞춤
- PWA: 홈 화면/데스크톱에 앱처럼 설치 가능 (아이콘, manifest, 최소 서비스워커)

## 파일 구조 (핵심만)

```
src/
├── App.jsx                 인증 게이트 + 대시보드 레이아웃
├── main.jsx                진입점, 프로덕션에서만 서비스워커 등록
├── supabaseClient.js       Supabase 클라이언트 (.env 값 없으면 즉시 에러)
├── milestoneUtils.js       신호등/가까운 일정/최종 일정 계산 로직
├── hooks/
│   ├── useAuth.js          로그인/가입/로그아웃/회원탈퇴
│   ├── useTasks.js         업무·마일스톤 CRUD (전부 낙관적 업데이트 + 실패 시 재동기화)
│   └── useTheme.js         테마 상태 + prefers-color-scheme 실시간 반영
└── components/
    ├── AuthForm.jsx
    ├── ThemeToggle.jsx
    ├── TaskForm.jsx / TaskList.jsx / TaskItem.jsx
    └── MilestoneForm.jsx / MilestoneList.jsx / MilestoneItem.jsx

schema.sql                  새 Supabase 프로젝트를 처음부터 세팅할 때 쓰는 참고용 전체 스키마
migration.sql                기존 프로젝트를 anon 공개 접근 → 사용자별 격리로 옮긴 실제 마이그레이션 기록
migration_delete_account.sql 회원 탈퇴용 delete_user() 함수 정의
public/sw.js                  캐싱 없는 최소 서비스워커 (설치 가능성 조건 충족용)
```

## Supabase 대시보드에서 수동으로 한 설정 (git에 안 남음)

1. **SQL 실행** (SQL Editor에서 직접 실행, 순서대로):
   - `migration.sql` PART 1 — `user_id` 컬럼 추가 + `authenticated` 대상 RLS 정책 추가
   - 이후 실제 계정으로 회원가입
   - `migration.sql` PART 2 — 기존 3개 업무를 그 계정으로 백필 + `user_id NOT NULL` 강제
   - 예전에 걸려있던 `"Public access"`(전체 공개, `roles: {public}`) 정책을 별도로 `drop policy` — 이름이 예상과 달라서 처음엔 안 지워졌던 걸 `pg_policies` 조회로 찾아서 수동으로 제거함
   - `migration_delete_account.sql` — `security definer` 함수로 본인 계정만 삭제 가능하게 함
2. **Authentication → Providers → Email**: "Confirm email" 끔 (가입 즉시 로그인 가능하게, 다른 사람 초대 시 이메일 확인 링크가 깨지는 문제도 있었음)
3. **Authentication → URL Configuration → Site URL**: `https://task-manager-app-y2ng.vercel.app`로 설정 (기본값 localhost라 이메일 링크가 깨졌었음)

## 배포

- Vercel이 GitHub `main` push를 자동 감지해 재배포 (별도 CI 설정 없음)
- 환경변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)는 Vercel 프로젝트 설정에 직접 등록되어 있음 (로컬 `.env`와 동일한 값)

## 의도적으로 안 한 것들

Supabase Auth 소셜 로그인, 오프라인 캐싱(서비스워커는 설치 가능성 조건만 충족, 실제 캐싱 없음 — 실시간 데이터가 중요해서 항상 네트워크로 감), 마일스톤 순서 드래그앤드롭, 검색/필터, 마감 알림(푸시/이메일).
