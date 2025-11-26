import axios from "axios";

import axiosInstance from "../interceptor";

const AI_BASE_URL = process.env.NEXT_PUBLIC_BACK_AI_URL;

import { ApiResponse } from "@/app/types/api";
import type {
	ApiCourseRequestItem,
	ApiFormResponse,
	SubmitCourseRequestData,
} from "@/app/types/community";

interface DraftReq {
	courseId: number;
	query: string;
	hasAttachment?: boolean;
	files?: File[] | null;
}

// 질문 초안 작성
const postDraftQuestion = async ({
	courseId,
	query,
	hasAttachment = false,
	files = [],
}: DraftReq) => {
	try {
		const formData = new FormData();
		formData.append("course_id", String(courseId));
		formData.append("query", query);
		formData.append("has_attachment", String(hasAttachment));

		if (files && files.length > 0) {
			files.forEach((file: File) => {
				formData.append("files", file);
			});
		}

		const res = await axiosInstance.post(
			`${AI_BASE_URL}/community/question-draft`,
			formData,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

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

const getCreatorRecommendationForm = async () => {
	try {
		const res = await axiosInstance.get<ApiResponse<ApiFormResponse>>(
			`${AI_BASE_URL}/community/creator-recommendation/form`,
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

// 댓글 초안 작성
const postDraftAnswer = async ({
	courseId,
	query,
	hasAttachment = false,
	files = [],
}: DraftReq) => {
	try {
		const formData = new FormData();
		formData.append("course_id", String(courseId));
		formData.append("query", query);
		formData.append("has_attachment", String(hasAttachment));

		if (files && files.length > 0) {
			files.forEach((file: File) => {
				formData.append("files", file);
			});
		}

		const res = await axiosInstance.post(
			`${AI_BASE_URL}/community/answer-draft`,
			formData,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const postCourseRequestWithBase = async () => {
	try {
		const res = await axiosInstance.post(
			`${AI_BASE_URL}/community/course-request-recommendation/with-base`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const postCourseRequestWithoutBase = async (data: SubmitCourseRequestData) => {
	try {
		const res = await axiosInstance.post(
			`${AI_BASE_URL}/community/course-request-recommendation/without-base`,
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

const getCheckCourseRequestAvailibility = async (requestId: number) => {
	try {
		const res = await axiosInstance.get(
			`${AI_BASE_URL}/community/course-request-recommendation/${requestId}/availability`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const getLastCreatorForm = async () => {
	try {
		const res = await axiosInstance.get(
			`${AI_BASE_URL}/community/creator-recommendation/form/last`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const deleteCourseRequest = async (requestId: number) => {
	try {
		const res = await axiosInstance.delete(
			`${AI_BASE_URL}/community/course-requests/${requestId}`,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

const patchRecommendationStatus = async (requestId: number, status: string) => {
	try {
		const res = await axiosInstance.patch(
			`${AI_BASE_URL}/community/course-request-recommendation/${requestId}/status`,
			{ action_status: status },
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
	deleteCourseRequest,
	getCheckCourseRequestAvailibility,
	getCourseRequestForm,
	getCreatorRecommendationForm,
	getLastCreatorForm,
	getMyCourseRequests,
	patchRecommendationStatus,
	postCourseRequests,
	postCourseRequestWithBase,
	postCourseRequestWithoutBase,
	postDraftAnswer,
	postDraftQuestion,
};
