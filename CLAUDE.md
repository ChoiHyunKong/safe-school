# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 📋 프로젝트 개요

**프로젝트명**: 안전한학교 (SafeSchool)
**목적**: 학교폭력 관련 통계를 위치 기반으로 투명하게 공개하여 학부모와 학생의 안전한 학교 선택 지원
**타겟 사용자**: 학생, 학부모
**현재 단계**: MVP 프론트엔드 개발 중 (Mock 데이터 기반)

---

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# Lint 실행
npm run lint
```

**중요**: 개발 서버는 포트 3000이 사용 중일 경우 자동으로 다음 포트(3001, 3002 등)를 사용합니다.

---

## 🏗️ 기술 스택

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.x
- **UI Components**: 직접 구현 (glassmorphism 디자인)
- **Package Manager**: npm

**계획된 추가 라이브러리** (아직 미설치):
- Zustand (상태 관리)
- React-Leaflet (지도)
- Recharts (차트)
- SWR (데이터 페칭)
- Supabase (백엔드/DB)

---

## 📐 아키텍처 개요

### 레이아웃 구조

애플리케이션은 **고정 사이드바 + 메인 컨텐츠** 레이아웃을 사용합니다:

- **Sidebar** (`src/components/layout/Sidebar.tsx`):
  - 240px 고정 너비, 좌측 고정
  - 글래스모피즘 효과 (보라색 그라데이션 배경)
  - Client Component (`'use client'`)
  - 네비게이션 아이템들과 active 상태 관리

- **Main Content** (`src/app/layout.tsx`):
  - `margin-left: 240px`로 사이드바 영역 확보
  - 흰색 배경 (`background-color: white`)
  - Server Component (기본)

### 스타일링 시스템

**globals.css**에 전역 스타일 정의:
- CSS Variables로 색상 팔레트 관리
- Glassmorphism 유틸리티 클래스 (`.glass-card`, `.glass-button`)
- 안전지수 배지 스타일 (`.safety-badge-s/a/b/c/d`)
- 애니메이션 (`@keyframes fadeIn`, `slideInRight`)
- 사이드바 전용 스타일

**디자인 원칙**:
- **사이드바**: 보라색 그라데이션 배경 + 글래스 효과 + 흰색 텍스트
- **메인 컨텐츠**: 흰색 배경 + 검은색 계열 텍스트
- **카드**: 연한 파스텔 블루 그라데이션 테두리 + 미묘한 그림자
- **간격**: `gap-8` 기본 사용 (2rem)

### Next.js 15 주의사항

1. **Server Components가 기본**: 모든 컴포넌트는 기본적으로 Server Component
2. **`'use client'` 필요 조건**:
   - `useState`, `useEffect` 등 React hooks 사용 시
   - `onClick`, `onChange` 등 이벤트 핸들러 사용 시
   - `usePathname`, `useRouter` 등 Next.js navigation hooks 사용 시
3. **styled-jsx 사용 금지**: Server Component에서 styled-jsx는 작동하지 않음. 대신 globals.css 또는 Tailwind 사용

### 파일 경로 문제

**한글 경로 + Turbopack 버그**: 파일 경로에 한글이 포함된 경우 Turbopack 사용 시 런타임 에러 발생.
**해결 방법**: `package.json`에서 `--turbopack` 플래그 제거 (이미 적용됨)

---

## 🎨 디자인 시스템

### 색상 팔레트

```css
/* 안전지수 색상 */
--color-safe-excellent: #A8E6CF  /* S등급 - 민트 그린 */
--color-safe-good: #93C5FD       /* A등급 - 파스텔 블루 */
--color-safe-average: #FDE68A    /* B등급 - 노란색 */
--color-safe-warning: #FDBA74    /* C등급 - 오렌지 */
--color-safe-danger: #FCA5A5     /* D등급 - 빨강 */

/* 사이드바 배경 */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* 메인 컨텐츠 배경 */
background-color: white
```

### 타이포그래피 클래스

```tsx
/* 헤더 */
className="text-4xl font-bold text-gray-900"

/* 본문 */
className="text-gray-600"

/* 라벨 */
className="text-blue-700 font-medium"

/* 카드 제목 */
className="text-2xl font-bold text-gray-900"
```

### 컴포넌트 패턴

**Glass Card** (연한 블루 테두리):
```tsx
<div className="glass-card p-6">
  {/* content */}
</div>
```

**Safety Badge**:
```tsx
<div className="safety-badge-a">A등급</div>
```

**Quick Menu Button**:
```tsx
<button className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl text-left flex items-center justify-between transition-all">
  {/* content */}
</button>
```

---

## 📁 현재 파일 구조

```
safe-school/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root Layout (사이드바 포함)
│   │   ├── page.tsx            # 대시보드 페이지
│   │   └── globals.css         # 전역 스타일 (디자인 시스템)
│   └── components/
│       └── layout/
│           └── Sidebar.tsx     # 좌측 네비게이션 사이드바
├── public/                     # 정적 파일
├── next.config.ts              # Next.js 설정
├── tsconfig.json               # TypeScript 설정
├── package.json                # 의존성 및 스크립트
└── CLAUDE.md                   # 이 파일
```

**아직 구현 안 됨**:
- `/search` - 학교 검색 페이지
- `/nearby` - 내 위치 기반 검색
- `/statistics` - 지역별 통계
- `/compare` - 학교 비교
- API Routes
- Supabase 연동
- 지도 컴포넌트
- 상태 관리

---

## 🎯 핵심 기능 (계획)

### 1. 안전지수 계산
```
안전지수 = (A × 30%) + (B × 30%) + (C × 25%) + (D × 15%)

A: 학교폭력 예방교육 실적 점수
B: 학교폭력 발생 건수 역점수 (낮을수록 높은 점수)
C: 상담 실적 점수
D: 자체해결 비율 점수

등급: S(90+), A(80-89), B(60-79), C(40-59), D(0-39)
```

### 2. 위치 기반 검색 (계획)
- PostGIS 공간 쿼리 사용 (`ST_DWithin`)
- 반경 설정: 1km, 3km, 5km, 10km
- 지도에 학교 마커 표시 (안전지수 색상 구분)

### 3. 학교 비교 (계획)
- 최대 3개 학교 동시 비교
- 레이더 차트로 시각화

---

## 💡 개발 시 주의사항

1. **Server vs Client Component**:
   - 인터랙티브 기능 필요 시 `'use client'` 추가
   - 가능한 Server Component 유지 (성능 최적화)

2. **스타일링 규칙**:
   - 사이드바: `globals.css`의 `.sidebar-*` 클래스 사용
   - 메인 컨텐츠: Tailwind 클래스 + `.glass-card` 유틸리티
   - 절대 `<style jsx>` 사용 금지

3. **간격 및 레이아웃**:
   - 카드 간격: `gap-8` 사용
   - 섹션 간격: `mb-8` ~ `mb-10`
   - 패딩: `p-6` (카드 내부)

4. **반응형 디자인**:
   - 모바일 브레이크포인트: `768px`
   - 사이드바는 모바일에서 숨김 처리 (아직 미구현)

5. **TypeScript**:
   - Path alias `@/*`는 `src/*`로 매핑됨
   - 타입 정의는 각 컴포넌트 파일 내부에 인라인으로 작성

---

## 📚 참고 문서

프로젝트 루트(상위 디렉토리)에 설계 문서들이 있음:
- `school-violence-platform-plan.md`: 초기 기획
- `design/UI-Design-Final.md`: 최종 UI 디자인 가이드
- `design/System-Architecture.md`: 시스템 아키텍처
- `design/Database-Schema.md`: DB 스키마 설계
- `design/Mock-Data.md`: Mock 데이터 정의

---

**문서 버전**: 2.0
**최종 수정일**: 2025-10-01
**현재 개발 단계**: MVP 프론트엔드 구축 중 (대시보드 완료)
