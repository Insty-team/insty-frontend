import {
  GET_social_login_authorize_code,
  POST_email_verify_check,
  POST_email_verify_send,
  POST_login,
  POST_logout,
  POST_social_login,
} from './auth.service';
import { EmailVerifyCheckRequest, LoginRequest, SocialLoginRequest } from './auth.type';

import { SocialLoginType } from '@/shared/types/auth.enum';
import { useMutation, useQuery } from '@tanstack/react-query';

/** 사용자 로그아웃 */
export const usePostLogout = () => {
  return useMutation({
    mutationKey: [POST_logout.name],
    mutationFn: () => POST_logout(),
  });
};

/** 사용자 이메일 로그인 */
export const usePostLogin = () => {
  return useMutation({
    mutationKey: [POST_login.name],
    mutationFn: (data: LoginRequest) => POST_login(data),
  });
};

/** 사용자 소셜 로그인 */
export const usePostSocialLogin = (socialName: SocialLoginType) => {
  return useMutation({
    mutationKey: [POST_social_login.name, socialName],
    mutationFn: (data: SocialLoginRequest) => POST_social_login(socialName, data),
  });
};

/** 이메일 인증 확인 */
export const usePostEmailVerifyCheck = () => {
  return useMutation({
    mutationKey: [POST_email_verify_check.name],
    mutationFn: (data: EmailVerifyCheckRequest) => POST_email_verify_check(data),
  });
};

/** 이메일 인증 */
export const usePostEmailVerifySend = () => {
  return useMutation({
    mutationKey: [POST_email_verify_send.name],
    mutationFn: (email: string) => POST_email_verify_send(email),
  });
};

/** 사용자 소셜 로그인 인가코드 얻기 */
export const useGetSocialLoginAuthorizeCode = (socialName: SocialLoginType) => {
  return useQuery({
    queryKey: [GET_social_login_authorize_code.name, socialName],
    queryFn: () => GET_social_login_authorize_code(socialName),
  });
};
