// 강의 요청 관련 타입 정의

import type { ApiResponse } from "./api";

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
	ApiCourseRequestItem,
	ApiFormField,
	ApiFormOption,
	ApiFormResponse,
	CourseRequestAnswer,
	CourseRequestApiResponse,
	CourseRequestFormFieldsApiResponse,
	CourseRequestItem,
	CreateCourseRequestData,
	FormField,
	FormOption,
	SubmitCourseRequestData,
};
