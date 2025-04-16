import { useEffect, useState } from 'react';

export function useCountAnimation(target, duration = 3000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(target, 10);
    if (end <= 0) {
      return;
    }

    const incrementTime = duration / end;
    let start = 0;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}
