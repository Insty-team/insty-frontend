import { EmailVerifyCheckRequest, LoginRequest, LoginResponse, SocialLoginRequest } from './auth.type';

import { api } from '@/shared/services/api';
import { ApiResponse } from '@/shared/types/api.type';
import { SocialLoginType } from '@/shared/types/auth.enum';
import axios from 'axios';

/** AccessToken 재발급 */
export const POST_reissue = async (refreshToken: string) => {
  const response = await axios.post(
    '/api/v1/auth/reissue',
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );
  return response.data;
};

/** 사용자 로그아웃 */
export const POST_logout = async () => {
  const response = await axios.post('/api/v1/auth/logout');
  return response.data;
};

/** 사용자 이메일 로그인 */
export const POST_login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post('/api/v1/auth/login', data);
  return response.data;
};

/** 사용자 소셜 로그인 */
export const POST_social_login = async (
  socialName: SocialLoginType,
  data: SocialLoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await axios.post(`/api/v1/auth/login/${socialName}`, data);
  return response.data;
};

/** 이메일 인증 확인 */
export const POST_email_verify_check = async (data: EmailVerifyCheckRequest): Promise<ApiResponse<string>> => {
  const response = await axios.post(`/api/v1/auth/email-verification/verify`, data);
  return response.data;
};

/** 이메일 인증 */
export const POST_email_verify_send = async (email: string): Promise<ApiResponse<string>> => {
  const response = await axios.post(`/api/v1/auth/email-verification/send`, { email });
  return response.data;
};
/**
 * 소셜 로그인 인가 URL 조회
 *
 * @param socialName - 소셜 로그인 제공자 (KAKAO, GOOGLE, NAVER)
 * @param state - CSRF 방지용 state 파라미터 (Base64 인코딩된 JSON)
 * @returns 인가 URL (사용자를 리다이렉트할 OAuth 제공자 페이지 URL)
 */
export const GET_social_login_authorize = async (
  socialName: SocialLoginType,
  state?: string,
): Promise<ApiResponse<string>> => {
  const params = new URLSearchParams();

  // state 파라미터 추가 (CSRF 방지)
  if (state) {
    params.append('state', state);
  }

  // 콜백 URL 설정 (현재 origin 기준)
  const callbackUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/login/oauth/callback`
      : process.env.NEXT_PUBLIC_APP_URL + '/login/oauth/callback';

  params.append('redirect_uri', callbackUrl);

  const queryString = params.toString();
  const url = `/api/v1/auth/login/authorize/${socialName}${queryString ? `?${queryString}` : ''}`;

  const response = await axios.get(url);
  return response.data;
};

/**
 * @deprecated GET_social_login_authorize 사용을 권장합니다.
 * 소셜 로그인 인가코드 조회 (레거시)
 */
export const GET_social_login_authorize_code = async (socialName: SocialLoginType): Promise<ApiResponse<string>> => {
  return GET_social_login_authorize(socialName);
};
