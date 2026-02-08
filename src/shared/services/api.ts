import { useAuthStore } from '../stores/auth';
import { POST_logout, POST_reissue } from './auth/auth.service';

import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_BASE_URL || '',
  withCredentials: true,
  timeout: 10000, // 10초 타임아웃 설정
});

/**
 * Request Interceptor
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 서버 사이드에서는 실행하지 않음
    if (typeof window === 'undefined') {
      return config;
    }

    const { accessToken } = useAuthStore.getState();

    // 토큰이 있고, 이미 Authorization 헤더가 없을 때만 추가
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 */
let isRefreshing = false;
type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러가 아니거나 config가 없으면 그대로 에러 반환
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // 이미 재시도한 요청이면 에러 반환 (무한 루프 방지)
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 이미 토큰 갱신 중이면 큐에 추가하고 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { accessToken: newAccessToken } = await reissueToken();

      // 새 토큰을 기본 헤더에 설정
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      // 대기 중인 모든 요청에 새 토큰 전달
      processQueue(null, newAccessToken);

      // 원래 요청에 새 토큰 적용 후 재시도
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      // 토큰 갱신 실패 시 대기 중인 모든 요청 거부
      processQueue(err, null);

      // 로그아웃 처리
      const { logout } = useAuthStore.getState();
      try {
        // await POST_logout();
      } catch (logoutError) {
        // 로그아웃 API 실패해도 클라이언트에서 로그아웃 처리
        console.error('Logout API error:', logoutError);
      } finally {
        // logout();
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

// refresh 요청을 캐싱하기 위한 변수
let refreshPromise: Promise<{ accessToken: string }> | null = null;
// 토큰 갱신 함수
const reissueToken = async (): Promise<{ accessToken: string }> => {
  // 이미 refresh 요청이 진행 중이면 기존 Promise를 반환
  if (refreshPromise) {
    return refreshPromise;
  }

  // 새로운 refresh 요청 시작
  const promise = (async () => {
    try {
      const { refreshToken, setAccessToken, setRefreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await POST_reissue(refreshToken);
      setAccessToken(result.data.token.accessToken);
      setRefreshToken(result.data.token.refreshToken);

      return { accessToken: result.data.token.accessToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    } finally {
      // 성공/실패 상관없이 Promise 초기화하여 다음 요청 시 새로운 토큰 갱신 가능하도록
      refreshPromise = null;
    }
  })();

  refreshPromise = promise;
  return promise;
};

export { api };
