import { LoginForm } from "@/app/types/index.d";
import axios from "axios";

export const postLogin = async (data: LoginForm) => {
	const res = await axios.post(
		`${process.env.NEXT_PUBLIC_BACK_API_URL}/auth/login`,
		data
	);
  
	return res.data.data;
};
