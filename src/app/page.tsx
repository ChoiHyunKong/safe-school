'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// 지도 컴포넌트는 클라이언트 사이드만 로드
const RegionalSafetyMap = dynamic(
  () => import('@/components/map/RegionalSafetyMap'),
  { ssr: false, loading: () => <MapSkeleton /> }
);

// 지역별 데이터 타입
interface RegionalData {
  region: string;
  regionCode: string;
  index: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  schools: number;
}

// 로딩 스켈레톤
function MapSkeleton() {
  return (
    <div className="map-skeleton">
      <div className="map-skeleton-content">
        <div className="map-skeleton-icon">🗺️</div>
        <div className="map-skeleton-text">지도를 불러오는 중...</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<RegionalData | null>(null);

  // 지역 선택 핸들러
  const handleRegionSelect = (region: RegionalData) => {
    setSelectedRegion(region);
  };

  return (
    <div className="page-container">
      {/* 검색바 */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="학교 검색"
            className="search-input"
          />
          <button className="search-button">
            검색
          </button>
        </div>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-label">전국 학교 수</div>
          <div className="stats-value">11,700</div>
          <div className="stats-description">초/중/고등학교</div>
        </div>

        <div className="stats-card" style={{ animationDelay: '0.1s' }}>
          <div className="stats-label">평균 안전지수</div>
          <div className="stats-value">78.5</div>
          <div className="safety-badge-b">B등급</div>
        </div>

        <div className="stats-card" style={{ animationDelay: '0.2s' }}>
          <div className="stats-label">S등급 학교</div>
          <div className="stats-value">1,250</div>
          <div className="stats-description">전체의 10.7%</div>
        </div>

        <div className="stats-card" style={{ animationDelay: '0.3s' }}>
          <div className="stats-label">데이터 최신화</div>
          <div className="stats-value">2024.09</div>
          <div className="stats-description">매월 업데이트</div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="content-card">
        {/* 지역별 안전지수 지도 */}
        <div className="content-card-header">
          <h2 className="content-card-title">지역별 안전지수</h2>
          {selectedRegion && (
            <div className="selected-region-badge">
              <span className="selected-region-label">선택된 지역:</span>
              <span className="selected-region-name">{selectedRegion.region}</span>
              <div className={`safety-badge-${selectedRegion.grade.toLowerCase()}`}>
                {selectedRegion.grade}등급
              </div>
            </div>
          )}
        </div>

          {/* 지도 컴포넌트 */}
          <RegionalSafetyMap onRegionSelect={handleRegionSelect} />

        {/* 선택된 지역 상세 정보 */}
        {selectedRegion && (
          <div className="selected-region-detail">
            <h3 className="selected-region-detail-title">{selectedRegion.region} 상세 정보</h3>
            <div className="selected-region-stats-grid">
              <div className="stat-item">
                <div className="stat-item-label">안전지수</div>
                <div className="stat-item-value">{selectedRegion.index}</div>
              </div>
              <div className="stat-item">
                <div className="stat-item-label">등급</div>
                <div className={`safety-badge-${selectedRegion.grade.toLowerCase()}`}>
                  {selectedRegion.grade}등급
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-item-label">학교 수</div>
                <div className="stat-item-value">{selectedRegion.schools}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 섹션들 */}
      <div className="bottom-grid">
        {/* 공지사항 */}
        <div className="notice-card">
          <h2 className="notice-title">공지사항</h2>
          <div className="notice-list">
            <div className="notice-item">
              <div className="notice-item-header">
                <span className="notice-item-title">2024년 학교폭력 실태조사 결과 반영</span>
                <span className="notice-item-date">2024-09-01</span>
              </div>
              <p className="notice-item-description">
                전국 초중고 학교의 최신 학교폭력 실태조사 데이터가 업데이트되었습니다.
              </p>
            </div>
            <div className="notice-item">
              <div className="notice-item-header">
                <span className="notice-item-title">시스템 정기 점검 안내</span>
                <span className="notice-item-date">2024-08-28</span>
              </div>
              <p className="notice-item-description">
                8월 30일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다.
              </p>
            </div>
            <div className="notice-item">
              <div className="notice-item-header">
                <span className="notice-item-title">새로운 검색 필터 기능 추가</span>
                <span className="notice-item-date">2024-08-15</span>
              </div>
              <p className="notice-item-description">
                학교급, 지역, 안전지수 등 다양한 조건으로 학교를 검색할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 업데이트 */}
        <div className="notice-card">
          <h2 className="notice-title">업데이트</h2>
          <div className="notice-list">
            <div className="notice-item">
              <div className="notice-item-header">
                <span className="notice-item-title">지도 기반 학교 검색 기능 추가</span>
                <span className="notice-item-date">2024-08-15</span>
              </div>
              <p className="notice-item-description">
                지도에서 직접 학교를 선택하고 상세 정보를 확인할 수 있습니다.
              </p>
            </div>
            <div className="notice-item">
              <div className="notice-item-header">
                <span className="notice-item-title">모바일 최적화 완료</span>
                <span className="notice-item-date">2024-07-22</span>
              </div>
              <p className="notice-item-description">
                모바일 환경에서도 편리하게 이용하실 수 있도록 개선했습니다.
              </p>
            </div>
            <div className="notice-item">
              <div className="notice-item-header">
                <span className="notice-item-title">학교 비교 기능 개선</span>
                <span className="notice-item-date">2024-07-10</span>
              </div>
              <p className="notice-item-description">
                최대 5개 학교를 동시에 비교할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
