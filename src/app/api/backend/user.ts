import axios from "axios";

import { ChangeProfileForm, SignupForm, UserProfileInfoResponse } from "@/app/types/index.d";

import axiosInstance from "../interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

// 닉네임 중복 체크
export const getNicknameCheck = async (nickname: string) => {
	const res = await axios.get(`${BASE_URL}/users/nickname/check`, {
		params: {
			nickname,
		},
	});

	return res.data.data;
};

// 이메일 중복 체크
export const getEmailCheck = async (email: string) => {
	const res = await axios.get(`${BASE_URL}/users/email/check`, {
		params: {
			email,
		},
	});

	return res.data.data;
};

// 회원 가입
export const postSignup = async (data: SignupForm) => {
	const res = await axios.post(`${BASE_URL}/users`, data);

	return res.data.data;
};

// 사용자 프로필 정보
export const getUserProfileInfo =
	async (): Promise<UserProfileInfoResponse> => {
		const res = await axiosInstance.get(`${BASE_URL}/users/profile`);
		return res.data.data;
	};

// 사용자 프로필 정보 수정
export const putUserProfileInfoEdit = async (data: FormData): Promise<UserProfileInfoResponse> => {
	const res = await axiosInstance.put(`${BASE_URL}/users/profile/me`, data, {
		headers: { 'Content-Type': 'multipart/form-data' }
	});
	return res.data.data;
}
