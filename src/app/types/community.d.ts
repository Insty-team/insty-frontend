// 강의 요청 관련 타입 정의

import type { ApiResponse } from "./api";
// 페이지네이션
type Pagination = {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
};

type CommunityQuestionReq = {
	courseId: number;
	title: string;
	content: string;
	videoUuid?: string | null;
};

// 강좌별 질문
type CommunityQuestionsResponse = {
	pagination: Pagination;
	items: CommunityQuestions[];
};

type CommunityQuestions = {
	user: {
		id: number;
		nickname: string;
		userType: string;
	};
	courseId: number;
	questionId: number;
	title: string;
	content: string;
	status: "WAITING" | "ANSWERED" | "ACCEPTED";
	createdAt: string;
	updatedAt: string;
};

// 질문 상세보기
interface QuestionDetail {
	questionId: number;
	user: {
		id: number;
		nickname: string;
		userType: "LEARNER" | "CREATOR" | string;
	};
	courseId: number;
	title: string;
	content: string;
	attachments: Attachment[];
	videoInfo: VideoInfo;
	createdAt: string;
	updatedAt: string;
	status: string; // 질문 상태
}

interface AnswerResponse {
	pagination: Pagination;
	items: Answer[];
}

interface Answer {
	user: {
		id: number;
		nickname: string;
		userType: "LEARNER" | "CREATOR" | string;
		url: string;
	};
	answerId: number;
	content: string;
	attachments: Attachment[];
	videoInfo?: VideoInfo;
	isAccepted: boolean;
	createdAt: string;
	updatedAt: string;
}

interface Attachment {
	id: number;
	name: string;
	contentType: string;
	size: number;
	url: string;
}

export interface VideoInfo {
	videoType: "COURSE" | "REVIEW" | string;
	videoUuid: string;
	originFileName: string;
}

// 댓글 달기
export interface CommunityAnswerCreateReq {
	content: string;
	videoUuid?: string | null;
}

export interface CommunityAnswerUpdateReq {
	content: string;
	videoUuid?: string;
	deleteFileIds?: number[];
}

// 커뮤니티 질문 수정 요청
interface CommunityQuestionUpdateReq {
	title: string;
	content: string;
	videoUuid?: string | null;
	deleteFileIds?: number[];
}

// 질문 목록 조회
interface QuestionsParamsReq {
	courseId?: number;
	page?: number;
	pageSize?: number;
	orderBy?: string;
	order?: string;
	keyword?: string;
	statuses?: string[];
}

// 사용자 관련

type MyQuestionItem = {
	questionId: number;
	user: {
		id: number;
		nickname: string;
		userType: string;
	};
	courseId: number;
	title: string;
	content: string;
	status: string;
	answerCount: number;
	hasNewAnswer: boolean;
	createdAt: string;
	updatedAt: string;
};

type Pagination = {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
};

type MyQuestionResponse = {
	items: MyQuestionItem[];
	pagination: Pagination;
};

// API 응답에서 받는 강의 요청 항목 타입 (snake_case)
interface ApiCourseRequestItem {
	request_id: number;
	title: string;
	description: string;
	requests_status: string;
	created_at: string;
}

// 프론트엔드에서 사용할 강의 요청 항목 타입 (camelCase)
interface CourseRequestItem {
	requestId: number;
	title: string;
	status: string;
	requestDate: string;
	description?: string;
}

// 강의 요청 생성 시 사용할 타입
interface CreateCourseRequestData {
	title: string;
	description: string;
}

// 강의 요청 답변 타입
interface CourseRequestAnswer {
	field_id: number;
	answer_option_ids?: number[];
	answer_text?: string;
}

// 강의 요청 제출 데이터 타입
interface SubmitCourseRequestData {
	title?: string;
	description?: string;
	answers: CourseRequestAnswer[];
}

// 강의 요청 폼 필드 관련 타입들

// API 응답에서 받는 옵션 타입
interface ApiFormOption {
	id: number;
	label: string;
	order_no: number;
}

// API 응답에서 받는 폼 필드 타입 (snake_case)
interface ApiFormField {
	id: number;
	field_key: string;
	label: string;
	type: "radio" | "input_text" | "text_area" | "checkbox";
	is_required: boolean;
	order_no: number;
	options: ApiFormOption[];
}

// API 응답 구조
interface ApiFormResponse {
	form: ApiFormField[];
}

// 프론트엔드에서 사용할 옵션 타입
interface FormOption {
	id: number;
	label: string;
	orderNo: number;
}

// 프론트엔드에서 사용할 폼 필드 타입 (camelCase)
interface FormField {
	id: number;
	fieldKey: string;
	label: string;
	type: "radio" | "text" | "textarea" | "checkbox";
	isRequired: boolean;
	orderNo: number;
	options: FormOption[];
}

// 강의 요청 API 응답 타입
type CourseRequestApiResponse = ApiResponse<ApiCourseRequestItem[]>;

// 강의 요청 폼 필드 API 응답 타입
type CourseRequestFormFieldsApiResponse = ApiResponse<ApiFormResponse>;

export type {
	Answer,
	AnswerResponse,
	ApiCourseRequestItem,
	ApiFormField,
	ApiFormOption,
	ApiFormResponse,
	CommunityAnswerUpdateReq,
	CommunityQuestionReq,
	CommunityQuestions,
	CommunityQuestionsResponse,
	CommunityQuestionUpdateReq,
	CourseRequestAnswer,
	CourseRequestApiResponse,
	CourseRequestFormFieldsApiResponse,
	CourseRequestItem,
	CreateCourseRequestData,
	FormField,
	FormOption,
	MyQuestionItem,
	MyQuestionResponse,
	QuestionDetail,
	QuestionsParamsReq,
	SubmitCourseRequestData,
};
