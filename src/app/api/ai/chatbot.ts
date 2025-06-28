import { ApiResponse } from "@/app/types/api";
import axiosInstance from "../interceptor";
import axios from "axios";
import { RecommendMessage } from "@/app/types/recommend";

// AI 챗봇 관련 API
const AI_BASE_URL = "http://13.125.92.232:8000/api/v1/ai";

const postAiSearchRecommend = async (query: string) => {
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

const getAiSearchReccomend = async () => {
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
export { postAiSearchRecommend, getAiSearchReccomend };
