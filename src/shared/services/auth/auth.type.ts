export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  nickname: string;
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
};

export type EmailVerifyCheckRequest = {
  email: string;
  code: string;
};
