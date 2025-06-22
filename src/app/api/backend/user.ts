import axios from "axios";

import {
  LoginResponse,
  SignupForm,
  SocialLogin,
  UserProfileInfoResponse,
  UserType,
} from "@/app/types";

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

//사용자 프로필 조회
export const getUserProfileInfo =
  async (): Promise<UserProfileInfoResponse> => {
    const res = await axiosInstance.get(`${BASE_URL}/users/profile`);
    return res.data.data;
  };

// 사용자 프로필 정보 수정
export const putUserProfileInfoEdit = async (
  data: FormData,
): Promise<UserProfileInfoResponse> => {
  const res = await axiosInstance.put(`${BASE_URL}/users/profile/me`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// 사용자 이메일 수신 동의 상태값 변경
export const patchUserEmailAgree = async (
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
export const patchUserType = async (
  userType: UserType,
): Promise<UserProfileInfoResponse> => {
  const res = await axiosInstance.patch(`${BASE_URL}/users/profile/userType`, {
    userType,
  });
  return res.data.data;
};

/**
 * OAuth 로그인
 * (현재는 카카오/네이버만 가능합니다.)
 */
export const getSocialAuthCode = async (
  socialName: SocialLogin,
  userType: UserType,
) => {
  const res = await axios.get(
    `${BASE_URL}/auth/login/authorize/${socialName}?state=${userType}`,
  );
  return res.data.data;
};

export const postSocialLogin = async (
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
