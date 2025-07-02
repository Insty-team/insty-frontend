import axios from "axios";

import { AIHistoryResponse, AIMessageResponse } from "@/app/types/ai";
import { ApiResponse } from "@/app/types/api";
import { PurchaseAssistantChatbotReq } from "@/app/types/course";

import axiosInstance from "../interceptor";

// AI 챗봇 관련 API
const AI_BASE_URL = process.env.NEXT_PUBLIC_BACK_AI_URL;

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
			formData,
			{
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

// AI 챗봇 질문 이력 (마이페이지)
const getAIChatHistory = async ({
	relativeDate = "",
	keyword = "",
}: {
	relativeDate?: string;
	keyword?: string;
}): Promise<AIHistoryResponse> => {
	try {
		const rawParams = { relativeDate, keyword };
		const cleanedParams = Object.fromEntries(
			Object.entries(rawParams).filter(([, v]) => v !== ""),
		);

		const res = await axiosInstance.get(
			`${AI_BASE_URL}/chatbot/question-history`,
			Object.keys(cleanedParams).length > 0
				? { params: cleanedParams }
				: undefined,
		);
		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 세션별 대화 내용 조회
const getAIMessageList = async (
	sessionId: number,
): Promise<AIMessageResponse> => {
	try {
		const res = await axiosInstance.get(
			`${AI_BASE_URL}/chatbot/sessions/${sessionId}/messages`,
		);
		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

export {
	getAIChatHistory,
	getAIMessageList,
	getSessionMessages,
	postChatSession,
	postMessageStream,
	postPurchaseAssistantChatbot,
};
