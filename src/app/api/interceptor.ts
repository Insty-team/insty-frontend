import axios from "axios";

import { getAccessToken } from "@/app/utils";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACK_BASE_URL,
	withCredentials: true,
});

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

export default axiosInstance;
