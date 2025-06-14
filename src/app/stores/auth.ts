import { create } from "zustand";

import {
	INSTY_ACCESS_TOKEN_KEY,
	INSTY_REFRESH_TOKEN_KEY,
} from "@/app/constants";

interface AuthStore {
	accessToken: string | null;
	refreshToken: string | null;
	setAccessToken: (accessToken: string) => void;
	resetAccessToken: () => void;
	setRefreshToken: (refreshToken: string) => void;
	resetRefreshToken: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	accessToken: null,
	refreshToken: null,

	// 액세스 토큰 저장
	setAccessToken: (accessToken: string) => {
		if (typeof window !== "undefined") {
			localStorage.setItem(INSTY_ACCESS_TOKEN_KEY, accessToken);
		}
		set({ accessToken: accessToken });
	},

	// 액세스 토큰 삭제
	resetAccessToken: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem(INSTY_ACCESS_TOKEN_KEY);
		}
		set({ accessToken: null });
	},

	// 리프레시 토큰 저장
	setRefreshToken: (refreshToken: string) => {
		if (typeof window !== "undefined") {
			sessionStorage.setItem(INSTY_REFRESH_TOKEN_KEY, refreshToken);
		}
		set({ refreshToken: refreshToken });
	},

	// 리프레시 토큰 삭제
	resetRefreshToken: () => {
		if (typeof window !== "undefined") {
			sessionStorage.removeItem(INSTY_REFRESH_TOKEN_KEY);
		}
		set({ refreshToken: null });
	},
}));
