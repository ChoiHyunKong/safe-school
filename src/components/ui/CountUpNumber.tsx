'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface CountUpNumberProps {
  end: number | string;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  isDate?: boolean;
}

export default function CountUpNumber({
  end,
  duration = 2500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  isDate = false,
}: CountUpNumberProps) {
  // 날짜인 경우 문자열 그대로 표시
  if (isDate) {
    return (
      <span className={className} suppressHydrationWarning>
        {String(end)}
      </span>
    );
  }

  // 숫자로 변환
  const numericEnd = typeof end === 'string' ? parseFloat(end) : end;
  const animatedValue = useCountUp({ end: numericEnd, duration, decimals });

  return (
    <span className={className} suppressHydrationWarning>
      {prefix}{animatedValue}{suffix}
    </span>
  );
}
