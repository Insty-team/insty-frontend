import {
  EmailVerifyCheckRequest,
  LoginRequest,
  LoginResponse,
  SocialLoginRequest,
} from './auth.type';

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
export const POST_email_verify_check = async (
  data: EmailVerifyCheckRequest,
): Promise<ApiResponse<string>> => {
  const response = await axios.post(`/api/v1/auth/email-verification/verify`, data);
  return response.data;
};

/** 이메일 인증 */
export const POST_email_verify_send = async (email: string): Promise<ApiResponse<string>> => {
  const response = await axios.post(`/api/v1/auth/email-verification/send`, { email });
  return response.data;
};
/** 사용자 소셜 로그인 인가코드 얻기 */
export const GET_social_login_authorize_code = async (
  socialName: SocialLoginType,
): Promise<ApiResponse<string>> => {
  const response = await axios.get(`/api/v1/auth/login/authorize/${socialName}`);
  return response.data;
};
