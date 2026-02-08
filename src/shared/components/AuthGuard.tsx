'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/shared/stores/auth';

type AuthGuardProps = {
  children: React.ReactNode;
  /** 로딩 중 표시할 컴포넌트 (기본: null) */
  fallback?: React.ReactNode;
  /** 인증 실패 시 리다이렉트할 경로 (기본: /login) */
  redirectTo?: string;
};

/**
 * 클라이언트 사이드 인증 가드
 *
 * Middleware에서 기본 인증 체크를 하지만,
 * 클라이언트에서 hydration 후 추가 검증이 필요한 경우 사용
 *
 * @example
 * ```tsx
 * // layout.tsx에서 사용
 * export default function CreatorLayout({ children }) {
 *   return <AuthGuard>{children}</AuthGuard>;
 * }
 * ```
 */
export default function AuthGuard({
  children,
  fallback = null,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Zustand hydration 완료 후 체크
    const checkAuth = () => {
      if (!accessToken) {
        const currentPath = window.location.pathname;
        router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        setIsChecking(false);
      }
    };

    // hydration이 완료될 때까지 약간의 딜레이
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [accessToken, redirectTo, router]);

  if (isChecking) {
    return fallback;
  }

  return <>{children}</>;
}
