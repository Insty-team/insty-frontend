import axios from "axios";
import axiosInstance from "../interceptor";
import { ApiResponse } from "@/app/types/api";

// AI 영상 초안 제작 관련 API
const AI_BASE_URL = "http://13.125.92.232:8000/api/v1/ai";

const postSuggestMetadata = async (videoUuid: string) => {
	console.log(videoUuid);
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${AI_BASE_URL}/videos/${videoUuid}/metadata-suggestion`,
			{
				videoUuid,
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

const postSuggestTitle = async (videoUuid: string, originalTitle: string) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${AI_BASE_URL}/videos/${videoUuid}/suggest-title`,
			{
				originalTitle,
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

const postSuggestDescription = async (videoUuid: string, originalDescription: string) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${AI_BASE_URL}/videos/${videoUuid}/suggest-description`,
			{
				originalDescription,
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

export { postSuggestMetadata, postSuggestTitle, postSuggestDescription };
