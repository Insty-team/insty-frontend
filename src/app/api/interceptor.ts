import axios from "axios";

import { postLogout, postReissueToken } from "./backend";
import { getAccessToken, setAccessToken, getRefreshToken } from "@/app/utils";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACK_BASE_URL,
	withCredentials: true,
});

/**
 * Request Interceptor
 */
axiosInstance.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const accessToken = getAccessToken();
			if (accessToken) {
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

axiosInstance.interceptors.response.use(
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
					return axiosInstance(originalRequest);
				});
			}

			isRefreshing = true;

			try {
				const refreshToken = getRefreshToken()
				const res = await postReissueToken(refreshToken ?? '')
				// const res = await axiosInstance.post(`${BASE_URL}/auth/reissue`, {}, {
				// 	withCredentials: true
				// })

				const newAccessToken = res.token.accessToken;
				setAccessToken(newAccessToken);

				axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
				processQueue(null, newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (err) {
				processQueue(err, null);
				postLogout()
				window.location.href = "/login";
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);
export default axiosInstance;
