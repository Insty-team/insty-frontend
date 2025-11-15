import axios from "axios";

import {
	CommunityAnswerCreateReq,
	CommunityAnswerUpdateReq,
	CommunityQuestionReq,
	CommunityQuestionUpdateReq,
} from "@/app/types/community";
import { QuestionsParamsReq } from "@/app/types/community";

import axiosInstance from "../interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACK_BASE_URL;

// 멘션 유저 검색
interface MentionUserParams {
	search: string;
	size: number;
}

const getCommunityCourseQuestion = async ({
	courseId,
	page = 1,
	pageSize = 20,
	orderBy = "createdAt",
	order = "desc",
	keyword,
	statuses,
}: QuestionsParamsReq) => {
	const res = await axiosInstance.get(
		`${BASE_URL}/community/questions/course/${courseId}`,
		{
			params: { page, pageSize, orderBy, order, keyword, statuses },
			paramsSerializer: (params) => {
				const searchParams = new URLSearchParams();
				Object.entries(params).forEach(([key, value]) => {
					if (Array.isArray(value)) {
						value.forEach((v) => searchParams.append(key, v));
					} else if (value !== undefined && value !== null && value !== "") {
						searchParams.append(key, String(value));
					}
				});
				return searchParams.toString();
			},
		},
	);

	console.log(res.data.data);
	return res.data.data;
};

// 질문 상세보기
const getQuestionDetail = async (questionId: number) => {
	console.log("질문 상세보기 API 호출");
	const res = await axiosInstance.get(
		`${BASE_URL}/community/questions/${questionId}`,
	);
	return res.data.data;
};

// 질문 작성
const postCommunityQuestion = async (
	communityQuestionData: CommunityQuestionReq,
	attachmentFile: File[] | null,
) => {
	try {
		const formData = new FormData();

		formData.append(
			"communityQuestionReq",
			JSON.stringify(communityQuestionData),
		);

		if (attachmentFile && attachmentFile.length > 0) {
			attachmentFile.forEach((file) => {
				formData.append("attachments", file);
			});
		}

		const res = await axiosInstance.post(
			`${BASE_URL}/community/questions`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			},
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
	}

	throw new Error("서버와 통신 불가");
};

// 질문 수정
const patchCommunityQuestion = async (
	questionId: number,
	communityQuestionUpdateReq: CommunityQuestionUpdateReq,
	attachmentFile: File[] | null,
) => {
	try {
		const formData = new FormData();

		formData.append(
			"communityQuestionUpdateReq",
			JSON.stringify(communityQuestionUpdateReq),
		);

		if (attachmentFile && attachmentFile.length > 0) {
			attachmentFile.forEach((file) => {
				formData.append("attachments", file);
			});
		}
		const res = await axiosInstance.patch(
			`${BASE_URL}/community/questions/${questionId}`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			},
		);
		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 질문 삭제
const deleteCommunityQuestion = async (questionId: number) => {
	try {
		const res = await axiosInstance.delete(
			`${BASE_URL}/community/questions/${questionId}`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 댓글 조회
const getAnswer = async (
	questionId: number,
	page: number = 1,
	pageSize: number = 10,
) => {
	console.log("댓글 조회 API 호출");

	const res = await axiosInstance.get(
		`${BASE_URL}/community/questions/${questionId}/answer`,
		{
			params: { page, pageSize },
		},
	);
	return res.data.data;
};

// 댓글 작성
const postAnswer = async (
	communityAnswerCreateReq: CommunityAnswerCreateReq,
	questionId: string,
	attachmentFile?: File[] | null,
) => {
	try {
		const formData = new FormData();

		formData.append(
			"communityAnswerCreateReq",
			JSON.stringify(communityAnswerCreateReq),
		);

		if (attachmentFile && attachmentFile.length > 0) {
			attachmentFile.forEach((file) => {
				formData.append("attachments", file);
			});
		}

		const res = await axiosInstance.post(
			`${BASE_URL}/community/questions/${questionId}/answer`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			},
		);

		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response?.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 댓글 수정
const patchAnswer = async (
	answerId: number,
	communityAnswerUpdateReq: CommunityAnswerUpdateReq,
	attachmentFile?: File[] | null,
) => {
	try {
		const formData = new FormData();

		formData.append(
			"communityAnswerUpdateReq",
			JSON.stringify(communityAnswerUpdateReq),
		);

		// 새 첨부파일 추가
		if (attachmentFile && attachmentFile.length > 0) {
			attachmentFile.forEach((file) => {
				formData.append("attachments", file);
			});
		}

		const res = await axiosInstance.patch(
			`${BASE_URL}/community/answer/${answerId}`,
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

// 댓글 삭제
const deleteAnswer = async (answerId: number) => {
	try {
		const res = await axiosInstance.delete(
			`${BASE_URL}/community/answer/${answerId}`,
		);

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 댓글 채택 - 러너
const postAnswerAccept = async (questionId: number, answerId: number) => {
	try {
		const res = await axiosInstance.post(
			`${BASE_URL}/community/questions/${questionId}/answer/${answerId}/accept`,
		);
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 채택된 답변 조회
const getAcceptedAnswer = async (questionId: number) => {
	try {
		const res = await axiosInstance.get(
			`${BASE_URL}/community/questions/${questionId}/answer/accepted`,
		);
		return res.data.data[0] ?? null;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

// 댓글 멘션 사용자 검색 (본인 제외)
const getMentionUser = async ({ search, size }: MentionUserParams) => {
	try {
		const res = await axiosInstance.get(`${BASE_URL}/mentions/users/search`, {
			params: { search, size },
		});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data;
		}
		throw new Error("서버와 통신 불가");
	}
};

export {
	deleteAnswer,
	deleteCommunityQuestion,
	getAcceptedAnswer,
	getAnswer,
	getCommunityCourseQuestion,
	getMentionUser,
	getQuestionDetail,
	patchAnswer,
	patchCommunityQuestion,
	postAnswer,
	postAnswerAccept,
	postCommunityQuestion,
};
