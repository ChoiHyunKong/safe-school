# 지도 컴포넌트 설계 문서

## 📋 개요

**컴포넌트명**: RegionalSafetyMap
**목적**: 대한민국 시도별 학교 안전지수를 지도상에 시각화하고 인터랙티브한 탐색 기능 제공
**위치**: `src/components/map/RegionalSafetyMap.tsx`

---

## 🎯 핵심 기능

### 1. 사용자 위치 기반 지도 표시
- **기본 중심 좌표**: [36.5, 127.5] (대한민국 중심)
- **GPS 자동 감지**: `navigator.geolocation` API 사용
- **폴백**: GPS 실패 시 기본 위치로 대체

### 2. 지역별 색상 매핑 (안전등급 기반)
```typescript
S등급: #A8E6CF (민트 그린)    - 90점 이상
A등급: #93C5FD (파스텔 블루)  - 80-89점
B등급: #FDE68A (노란색)       - 60-79점
C등급: #FDBA74 (오렌지)       - 40-59점
D등급: #FCA5A5 (빨강)         - 0-39점
```

### 3. 마우스 인터랙션
- **Hover**: 색상 진하게 변경 + 테두리 강조
- **Click**: 지역 선택 + 상세 정보 표시
- **Popup**: 지역 클릭 시 안전지수/등급/학교수 정보 팝업

### 4. 범례 (Legend)
- 우측 하단에 고정 배치
- 5가지 등급별 색상 및 설명
- 반투명 배경 + 블러 효과

---

## 🏗️ 컴포넌트 구조

### Props Interface
```typescript
interface RegionalSafetyMapProps {
  onRegionSelect?: (region: RegionalData) => void;  // 지역 선택 콜백
  defaultCenter?: [number, number];                 // 초기 중심 좌표
}

interface RegionalData {
  region: string;        // 지역명 (예: "서울특별시")
  regionCode: string;    // 지역 코드 (예: "seoul")
  index: number;         // 안전지수 (0-100)
  grade: 'S' | 'A' | 'B' | 'C' | 'D';  // 등급
  schools: number;       // 학교 수
}
```

### 상태 관리
```typescript
const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
const [isClient, setIsClient] = useState(false);
```

---

## 🎨 스타일링 개선

### 1. 상단 통계 카드 (before → after)

**Before**:
```tsx
<div className="glass-card p-6 animate-slide-in">
```

**After**:
```tsx
<div className="glass-card p-8 animate-slide-in">
  {/* 패딩 증가: p-6 → p-8 */}
  {/* 간격 증가: mb-2 → mb-3 */}
  {/* 폰트 크기: text-3xl → text-4xl */}
</div>
```

**주요 변경사항**:
- 패딩: `24px` → `32px`
- 라벨 스타일: `font-medium` → `font-semibold tracking-wide uppercase`
- 숫자 폰트: `text-3xl` → `text-4xl`
- 간격: `mb-2` → `mb-3`, `mt-2` 추가

### 2. Glass Card 호버 효과 (::before 슈라이드)

**CSS 추가**:
```css
.glass-card {
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.glass-card:hover {
  transform: translateY(-4px) scale(1.02);  /* 더 역동적인 호버 */
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.16);
}

.glass-card:hover::before {
  left: 100%;  /* 좌→우 슈라이드 효과 */
}
```

### 3. 빠른 메뉴 버튼 호버

**변경사항**:
```tsx
<button className="... hover:scale-105 hover:shadow-md">
  {/* scale(1.02) → scale(1.05) */}
  {/* shadow 추가 */}
</button>
```

---

## 🗺️ 지도 기술 스택

### React-Leaflet 5.0.0
- **MapContainer**: 지도 컨테이너
- **TileLayer**: OpenStreetMap 타일
- **GeoJSON**: 시도 경계 데이터 렌더링
- **Popup**: 클릭 시 정보 표시

### OpenStreetMap Tiles
```
URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
License: ODbL (Open Database License)
Attribution: © OpenStreetMap contributors
```

### 필요한 GeoJSON 데이터
**실제 프로젝트에서 필요**:
- 대한민국 시도 경계 GeoJSON 파일
- 출처: [SGIS (통계지리정보서비스)](https://sgis.kostat.go.kr)
- 파일 위치: `public/geojson/korea-regions.json`

---

## 📊 데이터 흐름

### 1. 초기 로드
```
page.tsx (부모)
  ↓ onRegionSelect 콜백 전달
RegionalSafetyMap (자식)
  ↓ GeoJSON 데이터 로드
OpenStreetMap 타일 + 시도 경계 렌더링
```

### 2. 지역 선택
```
사용자 클릭 → onEachFeature 이벤트
  ↓
setSelectedRegion(regionName)
  ↓
onRegionSelect(regionalData) 콜백 호출
  ↓
page.tsx 상태 업데이트
  ↓
선택된 지역 상세 정보 표시
```

### 3. 호버 효과
```
mouseover → setHoveredRegion(regionName)
  ↓
getFeatureStyle 재계산
  ↓
색상/테두리 변경 (호버 색상)
  ↓
mouseout → setHoveredRegion(null)
```

---

## 🎯 향후 개선 사항

### 1. 실제 GeoJSON 데이터 통합
```typescript
// TODO: public/geojson/korea-regions.json 파일 추가
useEffect(() => {
  fetch('/geojson/korea-regions.json')
    .then(res => res.json())
    .then(data => setGeoJsonData(data));
}, []);
```

### 2. 사용자 위치 기반 초기 뷰
```typescript
// TODO: GPS 위치를 기반으로 지도 중심 및 줌 레벨 조정
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    // 지도 중심을 사용자 위치로 이동
    // 가장 가까운 시도 자동 선택
  });
}
```

### 3. 학교 마커 레이어 추가
```typescript
// TODO: 지도 줌 레벨에 따라 개별 학교 마커 표시
// 줌 레벨 7 이하: 시도 경계만
// 줌 레벨 8-10: 시군구 경계
// 줌 레벨 11+: 개별 학교 마커
```

### 4. 클러스터링
```typescript
// TODO: react-leaflet-cluster 라이브러리 사용
// 많은 학교 마커를 효율적으로 표시
```

### 5. 검색 기능 통합
```typescript
// TODO: 지역명 검색 시 자동으로 지도 이동 및 선택
```

---

## 🐛 알려진 이슈 및 해결 방법

### 1. SSR 문제
**문제**: Leaflet은 브라우저 환경에서만 작동
**해결**: `dynamic import`로 SSR 비활성화
```typescript
const RegionalSafetyMap = dynamic(
  () => import('@/components/map/RegionalSafetyMap'),
  { ssr: false, loading: () => <MapSkeleton /> }
);
```

### 2. Leaflet CSS 누락
**문제**: 지도 타일이 깨져서 표시됨
**해결**: 컴포넌트 상단에 CSS import
```typescript
import 'leaflet/dist/leaflet.css';
```

### 3. 마커 아이콘 누락
**문제**: 기본 마커 아이콘이 표시되지 않음
**해결**: 아이콘 경로 수동 설정 (필요 시)
```typescript
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});
```

---

## 📝 사용 예시

### 기본 사용
```tsx
import RegionalSafetyMap from '@/components/map/RegionalSafetyMap';

<RegionalSafetyMap
  onRegionSelect={(region) => console.log(region)}
/>
```

### 커스텀 중심 좌표
```tsx
<RegionalSafetyMap
  defaultCenter={[37.5665, 126.9780]}  // 서울
  onRegionSelect={handleRegionSelect}
/>
```

### 부모 컴포넌트 통합
```tsx
const [selectedRegion, setSelectedRegion] = useState<RegionalData | null>(null);

<RegionalSafetyMap onRegionSelect={setSelectedRegion} />

{selectedRegion && (
  <div>선택된 지역: {selectedRegion.region}</div>
)}
```

---

## 🎨 디자인 스펙

### 지도 컨테이너
- 높이: `500px`
- 테두리: `2px solid #BFDBFE` (blue-200)
- 모서리: `rounded-2xl` (16px)
- 그림자: `shadow-lg`

### 범례 (Legend)
- 위치: 우측 하단 (`bottom-6 right-6`)
- 배경: `bg-white/95 backdrop-blur-sm`
- 패딩: `p-4`
- 테두리: `border border-blue-200`
- z-index: `1000`

### 팝업 스타일
- 최소 너비: `180px`
- 패딩: `8px`
- 폰트: 제목 `16px bold`, 내용 `14px`
- 색상: 헤딩 `#1F2937`, 라벨 `#6B7280`

---

**문서 버전**: 1.0
**작성일**: 2025-10-01
**작성자**: Claude (AI Assistant)
