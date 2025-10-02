'use client';

import { useEffect, useState, useRef } from 'react';

interface SequentialCountUpProps {
  end: number | string;
  duration?: number;
}

// 개별 자릿수 컴포넌트
function AnimatedDigit({
  targetDigit,
  shouldStart,
  onComplete,
  duration = 300
}: {
  targetDigit: string;
  shouldStart: boolean;
  onComplete: () => void;
  duration?: number;
}) {
  const [currentValue, setCurrentValue] = useState('0');
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // 숫자가 아닌 경우
    if (!/\d/.test(targetDigit)) {
      setCurrentValue(targetDigit);
      onComplete();
      return;
    }

    // 시작 신호를 기다림
    if (!shouldStart) {
      return;
    }

    const target = parseInt(targetDigit);
    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const value = Math.floor(easedProgress * target);

      setCurrentValue(String(value));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(String(target));
        onComplete();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetDigit, shouldStart, duration, onComplete]);

  // 숫자가 아닌 경우 (쉼표, 점 등)
  if (!/\d/.test(targetDigit)) {
    return <span className="sequential-separator">{currentValue}</span>;
  }

  return (
    <span className="sequential-digit" suppressHydrationWarning>
      {currentValue}
    </span>
  );
}

export default function SequentialCountUp({ end, duration = 300 }: SequentialCountUpProps) {
  // 숫자를 문자열로 변환 (쉼표 포함)
  const numString = typeof end === 'number' ? end.toLocaleString('en-US') : String(end);
  const digits = numString.split('');

  // 각 자릿수의 시작 상태 관리
  const [startStates, setStartStates] = useState<boolean[]>(
    digits.map(() => false)
  );

  useEffect(() => {
    // 마지막 자릿수(오른쪽)부터 시작
    const digitCount = digits.length;

    // 오른쪽부터 왼쪽으로 순차 시작
    for (let i = digitCount - 1; i >= 0; i--) {
      setTimeout(() => {
        setStartStates(prev => {
          const newStates = [...prev];
          newStates[i] = true;
          return newStates;
        });
      }, (digitCount - 1 - i) * 80); // 각 자릿수마다 80ms 지연
    }
  }, [digits.length, duration]);

  const handleComplete = (index: number) => {
    // 완료 핸들러 (필요시 사용)
  };

  return (
    <span className="sequential-countup-container" suppressHydrationWarning>
      {digits.map((digit, index) => (
        <AnimatedDigit
          key={index}
          targetDigit={digit}
          shouldStart={startStates[index]}
          onComplete={() => handleComplete(index)}
          duration={duration}
        />
      ))}
    </span>
  );
}
