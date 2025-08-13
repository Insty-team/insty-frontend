import axios from "axios";

import { ApiResponse } from "@/app/types/api";
import { LoginForm, LoginResponse } from "@/app/types/index.d";

import axiosInstance from "../interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

const postLogin = async (
	data: LoginForm,
): Promise<ApiResponse<LoginResponse>> => {
	try {
		//테스트 코드 추가
		//console.log(BASE_URL);
		const res = await axios.post(`${BASE_URL}/auth/login`, data);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const postLogout = async () => {
	const res = await axiosInstance.post(`${BASE_URL}/auth/logout`);
	return res.data.data;
};

const postReissueToken = async (
	refreshToken: string,
): Promise<LoginResponse> => {
	const res = await axiosInstance.post(
		`${BASE_URL}/auth/reissue`,
		{},
		{
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		},
	);
	return res.data.data;
};

const postEmailVerification = async (email: string) => {
	try {
		const res = await axiosInstance.post(
			`${BASE_URL}/auth/email-verification/send`,
			{
				email: email,
			},
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		return { error: "이메일 인증 요청에 실패했습니다." };
	}
};

const postEmailVerificationCheck = async (email: string, code: string) => {
	const res = await axiosInstance.post(
		`${BASE_URL}/auth/email-verification/verify`,
		{
			email: email,
			code: code,
		},
	);
	return res.data;
};
export {
	postEmailVerification,
	postEmailVerificationCheck,
	postLogin,
	postLogout,
	postReissueToken,
};
