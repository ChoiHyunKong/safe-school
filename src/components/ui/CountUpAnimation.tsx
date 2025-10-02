'use client';

import { useEffect, useState } from 'react';

interface CountUpAnimationProps {
  end: number | string;
}

export default function CountUpAnimation({ end }: CountUpAnimationProps) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const numString = typeof end === 'number' ? String(end) : end;

    // 쉼표 제거하고 순수 숫자만 추출
    const cleanNum = numString.replace(/,/g, '').replace(/\./g, '');

    // 각 자리로 나누어 올리기 위해 쪼개기 (역순)
    const arrayNum = cleanNum.split('').reverse();
    let current = new Array(cleanNum.length).fill(0);

    // 올라갈 때 걸리는 시간 균등하게 (최대 60ms)
    const total = arrayNum.reduce((pre, cur) => Number(pre) + Number(cur), 0);
    const eachTime = Math.min(1000 / total, 60);

    let time = 0;

    // 오른쪽부터 왼쪽으로 한 자리씩 순서대로
    for (let j = 0; j < arrayNum.length; j++) {
      for (let i = 0; i <= Number(arrayNum[j]); i++) {
        setTimeout(() => {
          current[arrayNum.length - j - 1] = i;

          // 원래 형식 복원 (쉼표, 소수점 등)
          let result = current.join('');

          // 숫자에 따라 쉼표 추가
          if (typeof end === 'number') {
            const num = parseInt(result);
            result = num.toLocaleString('en-US');
          } else if (numString.includes('.')) {
            // 소수점 처리 (예: 78.5)
            const parts = numString.split('.');
            const intPart = result.slice(0, parts[0].length);
            const decPart = result.slice(parts[0].length);
            result = intPart + (decPart ? '.' + decPart : '');
          }

          setDisplayValue(result);
        }, eachTime * (time + i));
      }
      time += Number(arrayNum[j]);
    }

    // 최종값 보장
    setTimeout(() => {
      setDisplayValue(typeof end === 'number' ? end.toLocaleString('en-US') : String(end));
    }, eachTime * (time + 10));

  }, [end]);

  return (
    <span suppressHydrationWarning>
      {displayValue}
    </span>
  );
}
