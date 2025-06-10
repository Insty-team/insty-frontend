import { LoginForm } from "@/app/types/index.d";
import axios from "axios";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

const postLogin = async (data: LoginForm) => {
	const res = await axios.post(`${BASE_URL}/auth/login`, data);

	return res.data.data;
};

const postLogout = async () => {
	const res = await axios.post(
		`${BASE_URL}/auth/logout`,
		{},
		{
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		},
	);

	return res.data.data;
};

export { postLogin, postLogout };
