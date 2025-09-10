import axios from "axios";

import { ApiResponse } from "@/app/types/api";
import type {
	ApiCourseRequestItem,
	ApiFormResponse,
	SubmitCourseRequestData,
} from "@/app/types/community";

import axiosInstance from "../interceptor";

const AI_BASE_URL = process.env.NEXT_PUBLIC_BACK_AI_URL;

const getMyCourseRequests = async () => {
	try {
		const res = await axiosInstance.get<ApiResponse<ApiCourseRequestItem[]>>(
			`${AI_BASE_URL}/community/course-requests`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const getCourseRequestForm = async () => {
	try {
		const res = await axiosInstance.get<ApiResponse<ApiFormResponse>>(
			`${AI_BASE_URL}/community/course-requests/form`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const postCourseRequests = async (data: SubmitCourseRequestData) => {
	try {
		const res = await axiosInstance.post(
			`${AI_BASE_URL}/community/course-requests`,
			data,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

export { getCourseRequestForm, getMyCourseRequests, postCourseRequests };
