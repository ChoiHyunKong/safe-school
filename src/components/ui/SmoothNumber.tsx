'use client';

import { useEffect, useState, useRef } from 'react';

interface SmoothNumberProps {
  end: number | string;
  duration?: number;
}

// 개별 자릿수 애니메이션 (부드러운 60fps)
function SmoothDigit({ digit, duration = 2500, delay = 0 }: { digit: string; duration?: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState('0');
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // 숫자가 아닌 경우 바로 표시
    if (!/\d/.test(digit)) {
      setDisplayValue(digit);
      return;
    }

    const targetDigit = parseInt(digit);

    // 지연 후 시작
    const delayTimeout = setTimeout(() => {
      startTimeRef.current = undefined;

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        // 0부터 목표 숫자까지 부드럽게
        const currentValue = Math.floor(easedProgress * targetDigit);
        setDisplayValue(String(currentValue));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(String(targetDigit));
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [digit, duration, delay]);

  // 숫자가 아닌 경우 (쉼표, 점 등)
  if (!/\d/.test(digit)) {
    return <span className="smooth-separator">{digit}</span>;
  }

  return (
    <span className="smooth-digit" suppressHydrationWarning>
      {displayValue}
    </span>
  );
}

export default function SmoothNumber({ end, duration = 2500 }: SmoothNumberProps) {
  // 숫자를 문자열로 변환 (쉼표 포함)
  const numString = typeof end === 'number' ? end.toLocaleString('en-US') : String(end);

  // 모든 자릿수 동시에 시작 (delay = 0)
  // 날짜도 동일하게 애니메이션 적용
  return (
    <span className="smooth-number-container" suppressHydrationWarning>
      {numString.split('').map((char, index) => (
        <SmoothDigit
          key={index}
          digit={char}
          duration={duration}
          delay={0} // 모든 자릿수 동시 시작
        />
      ))}
    </span>
  );
}
