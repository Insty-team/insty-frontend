import axios, { AxiosResponse } from "axios";
import axiosInstance from "../interceptor";

import { LoginForm, LoginResponse } from "@/app/types/index.d";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

export const postLogin = async (data: LoginForm): Promise<AxiosResponse<LoginResponse>> => {
	try {
		//테스트 코드 추가
		console.log(BASE_URL);
		const res = await axios.post(
			`${BASE_URL}/auth/login`,
			data,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

export const postLogout = async () => {
	const res = await axiosInstance.post(`${BASE_URL}/auth/logout`);
	return res.data.data;
};

export const postReissueToken = async (refreshToken: string): Promise<LoginResponse> => {
	const res = await axiosInstance.post(`${BASE_URL}/auth/reissue`, {}, {
		headers: {
			Authorization: `Bearer ${refreshToken}`
		}
	})
	return res.data.data;
}
