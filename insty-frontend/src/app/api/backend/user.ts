import axios from "axios";

import { SignupForm } from "@/app/types/index.d";

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
export const getUserProfileInfo = async () => {
	const res = await axios.get(`${BASE_URL}/user/profile`);
	console.log("getUserInfo", res);
};
