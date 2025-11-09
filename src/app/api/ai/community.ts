import axios from "axios";

import axiosInstance from "../interceptor";

const AI_BASE_URL = process.env.NEXT_PUBLIC_BACK_AI_URL;

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

export { postDraftAnswer, postDraftQuestion };
