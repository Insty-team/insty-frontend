type LoginResponse = {
  id: number;
  nickname: string;
  userType: string;
  token: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    tokenType: string;
  };
};

export type { LoginResponse };
