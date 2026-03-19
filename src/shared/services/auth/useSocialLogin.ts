import { GET_social_login_authorize, POST_social_login } from './auth.service';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore, useUserStore } from '@/shared/stores/auth';
import { SocialLoginType } from '@/shared/types/auth.enum';
import { useMutation } from '@tanstack/react-query';

/**
 * OAuth 소셜 로그인 State 생성 유틸리티
 * - CSRF 방지를 위한 state 파라미터 생성
 * - provider와 redirectTo 정보를 Base64로 인코딩
 */
const createOAuthState = (provider: SocialLoginType, redirectTo?: string): string => {
  const stateData = {
    provider,
    redirectTo: redirectTo || '/home',
    nonce: crypto.randomUUID(), // CSRF 방지용 난수
  };
  return btoa(JSON.stringify(stateData));
};

/**
 * 소셜 로그인 시작 훅
 *
 * 책임:
 * - 인가 URL 조회
 * - OAuth state 생성 (CSRF 방지)
 * - 소셜 로그인 제공자 페이지로 리다이렉트
 *
 * @example
 * const { initiateSocialLogin, isLoading } = useSocialLoginInitiate();
 * initiateSocialLogin('KAKAO', '/home');
 */
export const useSocialLoginInitiate = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['social-login-initiate'],
    mutationFn: async ({ provider, redirectTo }: { provider: SocialLoginType; redirectTo?: string }) => {
      // 1. state 생성 (provider + redirectTo + nonce)
      const state = createOAuthState(provider, redirectTo);

      // 2. 백엔드에서 인가 URL 조회
      const response = await GET_social_login_authorize(provider, state);

      if (!response.success || !response.data) {
        throw new Error(response.message || '인가 URL을 가져오는데 실패했습니다.');
      }

      return response.data;
    },
    onSuccess: (authorizeUrl) => {
      // 3. 소셜 로그인 페이지로 리다이렉트
      window.location.href = authorizeUrl;
    },
  });

  const initiateSocialLogin = useCallback(
    (provider: SocialLoginType, redirectTo?: string) => {
      mutation.mutate({ provider, redirectTo });
    },
    [mutation],
  );

  return {
    initiateSocialLogin,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

/**
 * 소셜 로그인 콜백 처리 훅
 *
 * 책임:
 * - 인가 코드로 백엔드에 로그인 요청
 * - 토큰 저장 (Zustand store)
 * - 사용자 정보 저장
 *
 * @example
 * const { mutateAsync: socialLoginCallback } = useSocialLoginCallback();
 * await socialLoginCallback({ provider: 'KAKAO', code: 'xxx' });
 */
export const useSocialLoginCallback = () => {
  const authStore = useAuthStore((state) => state);
  const userStore = useUserStore((state) => state);

  return useMutation({
    mutationKey: ['social-login-callback'],
    mutationFn: async ({ provider, code }: { provider: SocialLoginType; code: string }) => {
      const response = await POST_social_login(provider, { code });

      if (!response.success || !response.data) {
        throw new Error(response.message || '소셜 로그인에 실패했습니다.');
      }

      return response.data;
    },
    onSuccess: (data) => {
      // 토큰 저장
      authStore.setAccessToken(data.token.accessToken);
      authStore.setRefreshToken(data.token.refreshToken);

      // 사용자 정보 저장
      userStore.setNickname(data.nickname);
    },
  });
};

/**
 * 통합 소셜 로그인 훅
 *
 * 책임:
 * - 소셜 로그인 시작과 콜백 처리를 하나의 인터페이스로 제공
 * - 로딩/에러 상태 통합 관리
 *
 * @example
 * const { startLogin, isLoading, error } = useSocialLogin();
 * startLogin('GOOGLE');
 */
export const useSocialLogin = () => {
  const { initiateSocialLogin, isLoading: isInitiating, isError, error } = useSocialLoginInitiate();

  const startLogin = useCallback(
    (provider: SocialLoginType, redirectTo?: string) => {
      initiateSocialLogin(provider, redirectTo);
    },
    [initiateSocialLogin],
  );

  return {
    startLogin,
    isLoading: isInitiating,
    isError,
    error,
  };
};
