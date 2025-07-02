/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Swal from "sweetalert2";

import { getAccessToken, getRefreshToken, setAccessToken } from "@/app/utils";

import { postLogout, postReissueToken } from "./backend";

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
				const refreshToken = getRefreshToken();
				const res = await postReissueToken(refreshToken ?? "");

				const newAccessToken = res.token.accessToken;
				setAccessToken(newAccessToken);

				axiosInstance.defaults.headers.common["Authorization"] =
					`Bearer ${newAccessToken}`;
				processQueue(null, newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (err) {
				processQueue(err, null);
				await postLogout();
				Swal.fire({
					icon: "warning",
					title: "로그인 만료",
					text: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
					confirmButtonText: "확인",
					confirmButtonColor: "#6ead79",
				}).then(() => {
					window.location.href = "/login";
				});
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
export default axiosInstance;
