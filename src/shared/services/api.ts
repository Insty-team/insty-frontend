import { POST_logout, POST_reissue } from './auth/auth.service';

import cookieStorage from '@/shared/lib/cookie-storage';
import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_BASE_URL,
  withCredentials: true,
});

/**
 * Request Interceptor
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const accessToken = cookieStorage.getItem('accessToken') as string;
      if (accessToken && !config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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
        const refreshToken = cookieStorage.getItem('refreshToken') as string;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await reissueToken();

        const newAccessToken = response.token.accessToken;
        cookieStorage.setItem('accessToken', newAccessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        await POST_logout().then(() => {
          // Swal.fire({
          //   icon: 'warning',
          //   title: '로그인 만료',
          //   text: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.',
          //   confirmButtonText: '확인',
          //   confirmButtonColor: '#6ead79',
          // }).then(() => {
          //   window.location.replace('/login');
          // });
        });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// refresh 요청을 캐싱하기 위한 변수
let refreshPromise: Promise<any> | null = null;
// 토큰 갱신 함수
const reissueToken = async () => {
  // 이미 refresh 요청이 진행 중이면 기존 Promise를 반환
  if (refreshPromise) {
    return refreshPromise;
  }

  // 새로운 refresh 요청 시작
  refreshPromise = (async () => {
    try {
      const refreshToken = cookieStorage.getItem('refreshToken') as string;

      const result = await POST_reissue(refreshToken);
      return result.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  })();

  return refreshPromise;
};

export { api };
