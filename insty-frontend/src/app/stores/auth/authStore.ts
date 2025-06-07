import { create } from "zustand";

interface AuthStore {
	accessToken: string | null;
	setAccessToken: (accessToken: string) => void;
	resetAccessToken: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	accessToken: null,
	setAccessToken: (accessToken) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem("accessToken", accessToken);
		}
		set({ accessToken: accessToken });
	},
	resetAccessToken: () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem("accessToken");
		}
		set({ accessToken: null });
	},
}));
