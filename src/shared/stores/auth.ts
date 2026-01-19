import cookieStorage from '@/shared/lib/cookie-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthActions = {
  setAccessToken: (accessToken: AuthState['accessToken']) => void;
  setRefreshToken: (refreshToken: AuthState['refreshToken']) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState & AuthActions>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken: AuthState['accessToken']) => set({ accessToken }),
      setRefreshToken: (refreshToken: AuthState['refreshToken']) => set({ refreshToken }),
      logout: () => {
        set({ accessToken: null, refreshToken: null });
        window.location.href = '/login';
      },
    }),
    {
      name: '@insty-app.token',
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);

type UserState = {
  nickname: string | null;
};

type UserActions = {
  setNickname: (nickname: string) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  nickname: null,
  setNickname: (nickname: string) => set({ nickname }),
}));
