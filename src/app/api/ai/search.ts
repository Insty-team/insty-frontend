import axios from "axios";

import { ApiResponse } from "@/app/types/api";
import { RecommendMessage } from "@/app/types/recommend";

import axiosInstance from "../interceptor";

const AI_BASE_URL = process.env.NEXT_PUBLIC_BACK_AI_URL;

// AI 추천 관련 API
const postAISearchRecommend = async (query: string) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string[]>>(
			`${AI_BASE_URL}/search/recommend`,
			{
				query,
			},
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}

		throw new Error("서버와 통신 불가");
	}
};

const getAISearchRecommend = async () => {
	try {
		const res = await axiosInstance.get<ApiResponse<RecommendMessage[]>>(
			`${AI_BASE_URL}/search/recommend`,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}

		throw new Error("서버와 통신 불가");
	}
};

export { getAISearchRecommend, postAISearchRecommend };
