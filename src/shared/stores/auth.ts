import { UserType } from '../types/auth.enum';

import cookieStorage from '@/shared/lib/cookie-storage';
import { UserResponse } from '@/shared/services/user/user.type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthActions = {
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

export const useAuthStore = create(
  persist<AuthState & AuthActions>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
    }),
    {
      name: '@insty-app.token',
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);

type UserState = {
  nickname: string | null;
  userType: UserType | null;
};

type UserActions = {
  setNickname: (nickname: string) => void;
  setUserType: (userType: UserType) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  nickname: null,
  userType: null,
  setNickname: (nickname: string) => set({ nickname }),
  setUserType: (userType: UserType) => set({ userType }),
}));
