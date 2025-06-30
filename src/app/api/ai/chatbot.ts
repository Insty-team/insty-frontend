import axios from "axios";

import { ApiResponse } from "@/app/types/api";
import { PurchaseAssistantChatbotReq } from "@/app/types/course";
import { RecommendMessage } from "@/app/types/recommend";

import axiosInstance from "../interceptor";

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

const postPurchaseAssistantChatbot = async (
	course_id: number,
	query: string,
) => {
	try {
		const res = await axiosInstance.post<
			ApiResponse<PurchaseAssistantChatbotReq>
		>(`${AI_BASE_URL}/courses/purchase-assistant`, {
			course_id,
			query,
		});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}

		throw new Error("서버와 통신 불가");
	}
};

const postChatSession = async (course_id: number) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string[]>>(
			`${AI_BASE_URL}/chatbot/sessions`,
			{
				course_id,
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

const getSessionMessages = async (session_id: number) => {
	try {
		const res = await axiosInstance.get<ApiResponse<string[]>>(
			`${AI_BASE_URL}/chatbot/sessions/${session_id}/messages`,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}

		throw new Error("서버와 통신 불가");
	}
};

const postMessageStream = async (session_id: number, formData: FormData) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string[]>>(
			`${AI_BASE_URL}/chatbot/sessions/${session_id}/messages/stream`,
			{
				formData,
				headers: { "Content-Type": "multipart/form-data" },
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

export {
	getAiSearchReccomend,
	getSessionMessages,
	postAiSearchRecommend,
	postChatSession,
	postMessageStream,
	postPurchaseAssistantChatbot,
};
