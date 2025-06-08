import axios from "axios";

import { LoginForm } from "@/app/types/index.d";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

export const postLogin = async (data: LoginForm) => {
	const res = await axios.post(`${BASE_URL}/auth/login`, data);

	return res.data.data;
};
