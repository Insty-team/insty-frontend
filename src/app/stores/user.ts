import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UserInfo } from "@/app/types/index.d";

interface UserStore {
	user: UserInfo;
	setUser: (user: UserInfo) => void;
	setUserType: (userType: string) => void;
	setUserDescription: (description: string) => void;
	resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: {
				nickname: "",
				introduce: "",
				userType: "",
			},

			// 유저 정보 저장
			setUser: (user) => set({ user }),

			// 유저 타입만 설정
			setUserType: (userType: string) =>
				set((state) => ({
					user: {
						...state.user,
						userType,
					},
				})),

			//유저 소개만 설정(크리에이터만 가능)
			setUserDescription: (description: string) =>
				set((state) => ({
					user: {
						...state.user,
						description,
					},
				})),

			// 유저 정보 삭제
			resetUser: () =>
				set({
					user: {
						nickname: "",
						introduce: "",
						userType: "",
					},
				}),
		}),
		{
			name: "user_info",
		},
	),
);
