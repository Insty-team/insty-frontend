import axios from "axios";

import {
	LoginResponse,
	SignupForm,
	SocialLogin,
	UserProfileInfoResponse,
	UserType,
} from "@/app/types";
import { QuestionsParamsReq } from "@/app/types/community";

import axiosInstance from "../interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

// 닉네임 중복 체크
const getNicknameCheck = async (nickname: string) => {
	try {
		const res = await axios.get(`${BASE_URL}/users/nickname/check`, {
			params: {
				nickname,
			},
		});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		return { error: "닉네임 중복 확인에 실패했습니다." };
	}
};

// 이메일 중복 체크
const getEmailCheck = async (email: string) => {
	try {
		const res = await axios.get(`${BASE_URL}/users/email/check`, {
			params: {
				email,
			},
		});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		return { error: "이메일 중복 확인에 실패했습니다." };
	}
};

// 회원 가입
const postSignup = async (data: SignupForm) => {
	const res = await axios.post(`${BASE_URL}/users`, data);
	return res.data.data;
};

//사용자 프로필 조회
const getUserProfileInfo = async (): Promise<UserProfileInfoResponse> => {
	const res = await axiosInstance.get(`${BASE_URL}/users/profile`);
	return res.data.data;
};

// 사용자 프로필 정보 수정
const putUserProfileInfoEdit = async (
	data: FormData,
): Promise<UserProfileInfoResponse> => {
	const res = await axiosInstance.put(`${BASE_URL}/users/profile/me`, data, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data.data;
};

// 사용자 이메일 수신 동의 상태값 변경
const patchUserEmailAgree = async (
	isEmailAgree: boolean,
): Promise<UserProfileInfoResponse> => {
	const res = await axiosInstance.patch(
		`${BASE_URL}/users/profile/email-agree`,
		{
			isEmailAgree,
		},
	);
	return res.data.data;
};

// 사용자 타입 변경
const patchUserType = async (
	userType: UserType,
): Promise<UserProfileInfoResponse> => {
	const res = await axiosInstance.patch(`${BASE_URL}/users/profile/userType`, {
		userType,
	});
	return res.data.data;
};

/**
 * OAuth 로그인
 */
const getSocialAuthCode = async (
	socialName: SocialLogin,
	userType: UserType,
) => {
	const res = await axios.get(
		`${BASE_URL}/auth/login/authorize/${socialName}?state=${userType}`,
	);
	return res.data.data;
};

const postSocialLogin = async (
	socialName: SocialLogin,
	data: {
		code: string;
		userType: UserType;
	},
): Promise<LoginResponse> => {
	const res = await axiosInstance.post(`${BASE_URL}/auth/login/${socialName}`, {
		code: data.code,
		userType: data.userType,
	});
	return res.data.data;
};

const deleteUserInformation = async () => {
	try {
		const res = await axiosInstance.delete(`${BASE_URL}/users/withdraw`);
		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		return { error: "회원 탈퇴에 실패했습니다." };
	}
};

const getMyQuestion = async ({
	page,
	pageSize,
	orderBy,
	order,
	keyword,
	statuses,
}: QuestionsParamsReq) => {
	try {
		const res = await axiosInstance.get(`${BASE_URL}/community/questions/my`, {
			params: { page, pageSize, orderBy, order, keyword, statuses },
			paramsSerializer: (params) => {
				const searchParams = new URLSearchParams();
				Object.entries(params).forEach(([key, value]) => {
					if (Array.isArray(value)) {
						value.forEach((v) => searchParams.append(key, v));
					} else if (value !== undefined && value !== null && value !== "") {
						searchParams.append(key, String(value));
					}
				});
				return searchParams.toString();
			},
		});

		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

export {
	deleteUserInformation,
	getEmailCheck,
	getMyQuestion,
	getNicknameCheck,
	getSocialAuthCode,
	getUserProfileInfo,
	patchUserEmailAgree,
	patchUserType,
	postSignup,
	postSocialLogin,
	putUserProfileInfoEdit,
};
