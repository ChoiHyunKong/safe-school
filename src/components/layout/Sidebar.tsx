'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  { icon: '🏠', label: '대시보드', href: '/' },
  { icon: '🔍', label: '학교 검색', href: '/search' },
  { icon: '📍', label: '내 위치', href: '/nearby' },
  { icon: '📊', label: '지역별 통계', href: '/statistics' },
  { icon: '⭐', label: '학교 비교', href: '/compare' },
];

const subNavItems: NavItem[] = [
  { icon: '💡', label: '안전지수란?', href: '/about' },
  { icon: '📖', label: '이용 가이드', href: '/guide' },
  { icon: '⚙️', label: '설정', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      {/* 로고 & 타이틀 */}
      <div className="sidebar-logo">
        <div className="text-2xl font-bold mb-1">SafeSchool</div>
        <div className="text-sm font-medium opacity-90">안전한학교</div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-white/20 my-4" />

      {/* 메인 네비게이션 */}
      <nav className="flex flex-col gap-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${
              isActive(item.href) ? 'sidebar-nav-item-active' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 구분선 */}
      <div className="w-full h-px bg-white/20 my-4" />

      {/* 서브 네비게이션 */}
      <nav className="flex flex-col gap-1">
        {subNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${
              isActive(item.href) ? 'sidebar-nav-item-active' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="sidebar-footer">
        <p className="text-xs opacity-70 mb-2">데이터 출처: 학교알리미</p>
        <p className="text-xs opacity-60">최종 업데이트: 2024-09-01</p>
      </div>
    </aside>
  );
}
