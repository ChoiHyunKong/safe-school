'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, Marker, Circle, useMap } from 'react-leaflet';
import type { GeoJsonObject, Feature } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 사용자 위치 마커 아이콘 설정
const userLocationIcon = new L.DivIcon({
  className: 'user-location-marker',
  html: `<div style="
    width: 20px;
    height: 20px;
    background-color: #3B82F6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// 지도 중심 이동 컴포넌트
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// 지역별 안전지수 데이터 타입
interface RegionalData {
  region: string;
  regionCode: string;
  index: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  schools: number;
}

// Props 타입
interface RegionalSafetyMapProps {
  onRegionSelect?: (region: RegionalData) => void;
  defaultCenter?: [number, number];
}

// Mock 데이터 - 실제로는 API에서 가져올 데이터
const regionalData: Record<string, RegionalData> = {
  '서울특별시': { region: '서울특별시', regionCode: 'seoul', index: 82, grade: 'A', schools: 1234 },
  '경기도': { region: '경기도', regionCode: 'gyeonggi', index: 79, grade: 'B', schools: 2345 },
  '부산광역시': { region: '부산광역시', regionCode: 'busan', index: 76, grade: 'B', schools: 678 },
  '대구광역시': { region: '대구광역시', regionCode: 'daegu', index: 74, grade: 'B', schools: 534 },
  '인천광역시': { region: '인천광역시', regionCode: 'incheon', index: 80, grade: 'A', schools: 789 },
  '광주광역시': { region: '광주광역시', regionCode: 'gwangju', index: 77, grade: 'B', schools: 412 },
  '대전광역시': { region: '대전광역시', regionCode: 'daejeon', index: 78, grade: 'B', schools: 398 },
  '울산광역시': { region: '울산광역시', regionCode: 'ulsan', index: 75, grade: 'B', schools: 312 },
  '세종특별자치시': { region: '세종특별자치시', regionCode: 'sejong', index: 85, grade: 'A', schools: 98 },
  '강원특별자치도': { region: '강원특별자치도', regionCode: 'gangwon', index: 81, grade: 'A', schools: 456 },
  '충청북도': { region: '충청북도', regionCode: 'chungbuk', index: 79, grade: 'B', schools: 387 },
  '충청남도': { region: '충청남도', regionCode: 'chungnam', index: 78, grade: 'B', schools: 512 },
  '전북특별자치도': { region: '전북특별자치도', regionCode: 'jeonbuk', index: 76, grade: 'B', schools: 489 },
  '전라남도': { region: '전라남도', regionCode: 'jeonnam', index: 77, grade: 'B', schools: 534 },
  '경상북도': { region: '경상북도', regionCode: 'gyeongbuk', index: 75, grade: 'B', schools: 612 },
  '경상남도': { region: '경상남도', regionCode: 'gyeongnam', index: 76, grade: 'B', schools: 723 },
  '제주특별자치도': { region: '제주특별자치도', regionCode: 'jeju', index: 83, grade: 'A', schools: 178 },
};

// 안전지수에 따른 색상 매핑
const getColorByGrade = (grade: string): string => {
  const colors = {
    'S': '#A8E6CF', // 민트 그린
    'A': '#93C5FD', // 파스텔 블루
    'B': '#FDE68A', // 노란색
    'C': '#FDBA74', // 오렌지
    'D': '#FCA5A5', // 빨강
  };
  return colors[grade as keyof typeof colors] || colors.B;
};

// 호버 시 더 진한 색상
const getHoverColorByGrade = (grade: string): string => {
  const colors = {
    'S': '#87d9b8',
    'A': '#7eb3f5',
    'B': '#fde047',
    'C': '#fb923c',
    'D': '#f87171',
  };
  return colors[grade as keyof typeof colors] || colors.B;
};

export default function RegionalSafetyMap({
  onRegionSelect,
  defaultCenter = [36.5, 127.5] // 대한민국 중심
}: RegionalSafetyMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setIsClient(true);
  }, []);

  // GeoJSON 데이터 로드 (실제로는 public 폴더에서 로드)
  useEffect(() => {
    if (isClient) {
      // 간단한 Mock GeoJSON (실제로는 대한민국 시도 경계 GeoJSON 사용)
      const mockGeoJson: GeoJsonObject = {
        type: 'FeatureCollection',
        features: [
          // 실제 프로젝트에서는 대한민국 시도 경계 GeoJSON을 사용해야 함
          // 여기서는 구조만 표시
        ] as Feature[]
      };
      setGeoJsonData(mockGeoJson);
    }
  }, [isClient]);

  // 지역 스타일 함수
  const getFeatureStyle = (feature: Feature) => {
    const regionName = feature.properties?.name || '';
    const data = regionalData[regionName];

    if (!data) {
      return {
        fillColor: '#E5E7EB',
        weight: 1,
        opacity: 1,
        color: '#D1D5DB',
        fillOpacity: 0.5
      };
    }

    const isHovered = hoveredRegion === regionName;
    const isSelected = selectedRegion === regionName;

    return {
      fillColor: isSelected
        ? getHoverColorByGrade(data.grade)
        : isHovered
          ? getHoverColorByGrade(data.grade)
          : getColorByGrade(data.grade),
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#3B82F6' : isHovered ? '#60A5FA' : '#FFFFFF',
      fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6
    };
  };

  // 지역 이벤트 핸들러
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const regionName = feature.properties?.name || '';
    const data = regionalData[regionName];

    if (data) {
      // 마우스 오버
      layer.on('mouseover', () => {
        setHoveredRegion(regionName);
      });

      // 마우스 아웃
      layer.on('mouseout', () => {
        setHoveredRegion(null);
      });

      // 클릭
      layer.on('click', () => {
        setSelectedRegion(regionName);
        if (onRegionSelect) {
          onRegionSelect(data);
        }
      });

      // 툴팁 바인딩
      layer.bindPopup(`
        <div style="padding: 8px; min-width: 180px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1F2937;">
            ${regionName}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6B7280; font-size: 14px;">안전지수</span>
              <span style="font-weight: bold; font-size: 18px; color: #1F2937;">${data.index}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6B7280; font-size: 14px;">등급</span>
              <span style="
                background: linear-gradient(135deg, ${getColorByGrade(data.grade)}, ${getHoverColorByGrade(data.grade)});
                padding: 4px 12px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 14px;
                color: ${data.grade === 'S' || data.grade === 'A' ? '#1e40af' : '#713f12'};
              ">${data.grade}등급</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6B7280; font-size: 14px;">학교 수</span>
              <span style="font-weight: 600; color: #1F2937;">${data.schools}개</span>
            </div>
          </div>
        </div>
      `);
    }
  };

  // 사용자 위치 가져오기
  useEffect(() => {
    if (isClient && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const userPos: [number, number] = [userLat, userLng];

          console.log('사용자 위치:', userLat, userLng);
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error);
        }
      );
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="map-loading">
        <div className="map-loading-text">지도를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={userLocation ? 10 : 7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapController center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>
                <div style={{ padding: '8px', textAlign: 'center' }}>
                  <strong style={{ color: '#3B82F6', fontSize: '14px' }}>📍 내 위치</strong>
                  <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>
                    현재 위치입니다
                  </div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={500}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#93C5FD',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </>
        )}

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={(feature) => getFeatureStyle(feature as Feature)}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* 범례 */}
      <div className="map-legend">
        <h4 className="map-legend-title">안전지수 등급</h4>
        <div className="map-legend-list">
          {[
            { grade: 'S', label: 'S등급 (90+)', color: getColorByGrade('S') },
            { grade: 'A', label: 'A등급 (80-89)', color: getColorByGrade('A') },
            { grade: 'B', label: 'B등급 (60-79)', color: getColorByGrade('B') },
            { grade: 'C', label: 'C등급 (40-59)', color: getColorByGrade('C') },
            { grade: 'D', label: 'D등급 (0-39)', color: getColorByGrade('D') },
          ].map((item) => (
            <div key={item.grade} className="map-legend-item">
              <div
                className="map-legend-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="map-legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
