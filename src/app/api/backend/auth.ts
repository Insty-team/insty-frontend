import axios from "axios";

import { LoginForm, LoginResponse } from "@/app/types/index.d";
import axiosInstance from "../interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

export const postLogin = async (body: LoginForm): Promise<LoginResponse> => {
	const res = await axios.post(`${BASE_URL}/auth/login`, body);
	return res.data.data;
};

export const postLogout = async () => {
	const res = await axiosInstance.post(
		`${BASE_URL}/auth/logout`,
		{},
	);

	return res.data.data;
};
