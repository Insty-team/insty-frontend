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

type UserUpdateRequest = {
	email: string;
	nickname: string;
	currentPassword: string;
	newPassword?: string;
	introduce?: string;
};

export type { LoginResponse, UserUpdateRequest };
