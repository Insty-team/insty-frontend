'use client';

import { Suspense, useEffect, useRef } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSocialLoginCallback } from '@/shared/services/auth/useSocialLogin';
import { SocialLoginType } from '@/shared/types/auth.enum';
import { Loader2 } from 'lucide-react';

import instyPng from '@/assets/Logo.png';

/**
 * OAuth 콜백 페이지
 * - 소셜 로그인 제공자로부터 리다이렉트된 후 처리
 * - URL 파라미터에서 code를 추출하여 백엔드로 전송
 * - 책임: UI 렌더링만 담당, 비즈니스 로직은 useSocialLoginCallback 훅에 위임
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<OAuthCallbackLoading />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}

/**
 * 로딩 폴백 컴포넌트
 */
function OAuthCallbackLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <Image src={instyPng} alt="logo" width={100} priority />
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">로그인 처리 중...</h2>
          <p className="mt-1 text-sm text-gray-500">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  );
}

/**
 * OAuth 콜백 실제 처리 컴포넌트
 */
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessingRef = useRef(false);

  // URL 파라미터 추출
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // state에서 provider와 redirectTo 추출
  const parsedState = parseState(state);
  const provider = parsedState?.provider as SocialLoginType | undefined;
  const redirectTo = parsedState?.redirectTo || '/home';

  const { mutateAsync: socialLoginCallback, isPending, isError, error: loginError } = useSocialLoginCallback();

  useEffect(() => {
    // 이미 처리 중이면 중복 실행 방지
    if (isProcessingRef.current) return;

    // 에러가 있는 경우 (사용자가 취소하거나 OAuth 에러)
    if (error) {
      console.error('OAuth Error:', error, errorDescription);
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    // 필수 파라미터 검증
    if (!code || !provider) {
      console.error('Missing required parameters:', { code: !!code, provider });
      router.replace('/login?error=invalid_callback');
      return;
    }

    // 소셜 로그인 콜백 처리
    isProcessingRef.current = true;
    socialLoginCallback({ provider, code })
      .then(() => {
        router.replace(redirectTo);
      })
      .catch((err) => {
        console.error('Social login failed:', err);
        router.replace(`/login?error=login_failed`);
      })
      .finally(() => {
        isProcessingRef.current = false;
      });
  }, [code, provider, error, errorDescription, redirectTo, router, socialLoginCallback]);

  // 에러 상태 렌더링
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <Image src={instyPng} alt="logo" width={100} priority />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">로그인 실패</h2>
          <p className="mt-2 text-sm text-gray-500">
            {loginError instanceof Error ? loginError.message : '소셜 로그인 중 오류가 발생했습니다.'}
          </p>
        </div>
      </div>
    );
  }

  // 로딩 상태 렌더링
  return <OAuthCallbackLoading />;
}

/**
 * state 파라미터 파싱
 * state는 Base64 인코딩된 JSON 문자열
 */
function parseState(state: string | null): { provider?: string; redirectTo?: string } | null {
  if (!state) return null;

  try {
    const decoded = atob(state);
    return JSON.parse(decoded);
  } catch {
    // state가 단순 문자열인 경우 (provider만 포함)
    return { provider: state };
  }
}
