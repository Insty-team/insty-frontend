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

export type {
	Answer,
	AnswerResponse,
	CommunityAnswerUpdateReq,
	CommunityQuestionReq,
	CommunityQuestions,
	CommunityQuestionsResponse,
	CommunityQuestionUpdateReq,
	MyQuestionItem,
	MyQuestionResponse,
	QuestionDetail,
	QuestionsParamsReq,
};
