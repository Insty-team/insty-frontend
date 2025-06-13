import { LoginForm, LoginResponse } from "@/app/types/index.d";
import axios from "axios";
import axiosInstance from "../interceptor";
import { ApiResponse } from "@/app/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

const postLogin = async (data: LoginForm) => {
	try {
		const res = await axios.post<ApiResponse<LoginResponse>>(
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

const postLogout = async () => {
	const res = await axiosInstance.post(`${BASE_URL}/auth/logout`);
	return res.data.data;
};

export { postLogin, postLogout };
