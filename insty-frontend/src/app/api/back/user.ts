import { SignupForm } from "@/app/types/index.d";
import axios from "axios";

//닉네임 중복 체크
export const getNicknameCheck = async (nickname: string) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_BACK_BASE_URL}/users/nickname/check`,
		{
			params: {
				nickname,
			},
		}
	);

	return res.data.data;
};

//이메일 중복 체크
export const getEmailCheck = async (email: string) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_BACK_BASE_URL}/users/email/check`,
		{
			params: {
				email,
			},
		}
	);

	return res.data.data;
};

//회원 가입
export const postSignup = async (data: SignupForm) => {
	const res = await axios.post(
		`${process.env.NEXT_PUBLIC_BACK_BASE_URL}/users`,
		data
	);

	return res.data.data;
};
