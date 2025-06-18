import axios from "axios";
import axiosInstance from "../interceptor";
import { ApiResponse } from "@/app/types/api";

// AI 영상 초안 제작 관련 API
const BASE_URL = "http://13.125.92.232:8000/api/v1/ai";

const postSuggestMetadata = async (videoUuid: string) => {
	try {
		const res = await axiosInstance.post<ApiResponse<string>>(
			`${BASE_URL}/video/${videoUuid}/metadata-suggestion`,
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

export { postSuggestMetadata };
