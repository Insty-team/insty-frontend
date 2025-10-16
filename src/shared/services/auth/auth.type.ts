import { UserType } from '@/shared/types/auth.enum';

export type LoginRequest = {
  email: string;
  password: string;
  userType: UserType;
};

export type LoginResponse = {
  id: number;
  nickname: string;
  userType: UserType;
  token: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    tokenType: string;
  };
};

export type ReissueTokenResponse = {
  id: 0;
  nickname: string;
  userType: UserType;
  token: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    tokenType: string;
  };
};

export type SocialLoginRequest = {
  code: string;
  userType: UserType;
};

export type EmailVerifyCheckRequest = {
  email: string;
  code: string;
};
