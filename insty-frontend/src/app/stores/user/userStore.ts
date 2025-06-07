import { UserInfo } from "@/app/types/index.d";
import { create } from "zustand";

interface UserStore {
  user: UserInfo;
  setUser: (user: UserInfo) => void;
  setUserType: (userType: string) => void;
  setUserDescription: (description: string) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    nickname: "",
    userType: "",
    description: "",
  },
  setUser: (user) => set({ user }),
  // 유저 타입만 설정
  setUserType: (userType: string) => set((state) => ({
    user: {
      ...state.user,
      userType,
    }
  })),
  //유저 소개만 설정(크리에이터만 가능)
  setUserDescription: (description: string) => set((state) => ({
    user: {
      ...state.user,
      description,
    }
  })),
  resetUser: () => set({ user: {
    nickname: "",
    userType: "",
    description: "",
  }}),
}));
