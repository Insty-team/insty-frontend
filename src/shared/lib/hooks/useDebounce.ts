'use client';

import { useEffect, useState } from 'react';

/**
 * 값의 변경을 지연시키는 디바운스 훅
 *
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms), 기본값 500ms
 * @returns 디바운스된 값
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // debouncedSearch 값이 변경될 때만 API 호출
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
