'use client';

import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  separator?: string;
  easingFn?: (t: number) => number;
}

// Ease-out cubic: 빠르게 시작 → 천천히 완료
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

// 숫자 포맷팅 (천 단위 구분 쉼표)
const formatNumber = (num: number, decimals: number, separator: string): string => {
  const fixed = num.toFixed(decimals);
  const [integer, decimal] = fixed.split('.');

  // 천 단위 구분 쉼표 추가
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export function useCountUp({
  end,
  duration = 2000,
  decimals = 0,
  separator = ',',
  easingFn = easeOutCubic,
}: UseCountUpOptions): string {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // 음수나 유효하지 않은 값 처리
    if (!Number.isFinite(end) || end < 0) {
      setCount(0);
      return;
    }

    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing 적용
      const easedProgress = easingFn(progress);
      const currentCount = easedProgress * end;

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    // Cleanup: 메모리 누수 방지
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, easingFn]);

  return formatNumber(count, decimals, separator);
}
