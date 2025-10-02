'use client';

import { useEffect, useState } from 'react';

interface RollingNumberProps {
  end: number | string;
  duration?: number;
  isDate?: boolean;
}

// 개별 숫자 롤링 컴포넌트
function RollingDigit({
  digit,
  delay = 0,
  duration = 3000
}: {
  digit: string;
  delay?: number;
  duration?: number;
}) {
  const [currentDigit, setCurrentDigit] = useState<string>('0');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 지연 시작
    const startTimeout = setTimeout(() => {
      setIsAnimating(true);

      // 숫자가 아닌 경우 (쉼표, 점 등) 바로 표시
      if (!/\d/.test(digit)) {
        setCurrentDigit(digit);
        return;
      }

      const targetDigit = parseInt(digit);

      // 목표 숫자가 0인 경우: 9 → 0으로 내려감
      if (targetDigit === 0) {
        let current = 9;
        const interval = duration / 10; // 9부터 0까지 10단계

        const timer = setInterval(() => {
          setCurrentDigit(String(current));
          if (current === 0) {
            clearInterval(timer);
            setIsAnimating(false);
          }
          current = current === 0 ? 0 : current - 1;
        }, interval);

        return () => clearInterval(timer);
      }

      // 목표 숫자가 0이 아닌 경우: 0 → 9 → 목표 숫자
      else {
        let current = 0;
        const totalSteps = 9 + targetDigit; // 0~9 거쳐서 목표까지
        const interval = duration / totalSteps;
        let passedNine = false;

        const timer = setInterval(() => {
          setCurrentDigit(String(current));

          if (!passedNine) {
            current++;
            if (current > 9) {
              current = 0;
              passedNine = true;
            }
          } else {
            if (current === targetDigit) {
              clearInterval(timer);
              setIsAnimating(false);
            } else {
              current++;
            }
          }
        }, interval);

        return () => clearInterval(timer);
      }
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [digit, delay, duration]);

  // 숫자가 아닌 문자는 애니메이션 없이 표시
  if (!/\d/.test(digit)) {
    return <span className="rolling-digit-separator">{digit}</span>;
  }

  return (
    <span className="rolling-digit-wrapper">
      <span
        className={`rolling-digit ${isAnimating ? 'animating' : ''}`}
        suppressHydrationWarning
      >
        {currentDigit}
      </span>
    </span>
  );
}

export default function RollingNumber({
  end,
  duration = 3000,
  isDate = false
}: RollingNumberProps) {
  const endString = String(end);

  // 날짜 형식 처리 (2024.09)
  if (isDate) {
    const parts = endString.split('.');
    if (parts.length === 2) {
      const year = parts[0];
      const month = parts[1];

      return (
        <span className="rolling-number-container">
          {year.split('').map((digit, index) => (
            <RollingDigit
              key={`year-${index}`}
              digit={digit}
              delay={index * 100}
              duration={duration}
            />
          ))}
          <span className="rolling-digit-separator">.</span>
          {month.split('').map((digit, index) => (
            <RollingDigit
              key={`month-${index}`}
              digit={digit}
              delay={(year.length + index) * 100}
              duration={duration}
            />
          ))}
        </span>
      );
    }
  }

  // 일반 숫자 처리 (쉼표 포함)
  const formattedString = typeof end === 'number'
    ? end.toLocaleString('en-US')
    : endString;

  return (
    <span className="rolling-number-container" suppressHydrationWarning>
      {formattedString.split('').map((char, index) => (
        <RollingDigit
          key={index}
          digit={char}
          delay={index * 80}
          duration={duration}
        />
      ))}
    </span>
  );
}
