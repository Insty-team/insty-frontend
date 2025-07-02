import axios from "axios";

import { ApiResponse } from "@/app/types/api";

import axiosInstance from "../interceptor";

// AI 영상 초안 제작 관련 API
const AI_BASE_URL = process.env.NEXT_PUBLIC_BACK_AI_URL;

const postSuggestMetadata = async (video_uuid: string) => {
	console.log(video_uuid);
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${AI_BASE_URL}/videos/${video_uuid}/metadata-suggestion`,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}

		throw new Error("서버와 통신 불가");
	}
};

const postSuggestTitle = async (video_uuid: string, originalTitle: string) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${AI_BASE_URL}/videos/${video_uuid}/suggest-title`,
			{
				original_title: originalTitle,
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

const postSuggestDescription = async (
	video_uuid: string,
	originalDescription: string,
) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${AI_BASE_URL}/videos/${video_uuid}/suggest-description`,
			{
				original_description: originalDescription,
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

const getTranscriptionStatus = async (video_uuid: string) => {
	try {
		const res = await axiosInstance.get(
			`${AI_BASE_URL}/videos/${video_uuid}/transcription-status`,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("상태 확인 실패");
	}
};

export {
	getTranscriptionStatus,
	postSuggestDescription,
	postSuggestMetadata,
	postSuggestTitle,
};
