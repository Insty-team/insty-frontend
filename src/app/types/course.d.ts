type MyCoursesItems = {
	courseId: number;
	title: string;
	price?: number;
	viewCount?: number;
	commentCount: number;
	tags?: string[];
	thumbnailUrl: string | null;
	isShow?: boolean;
	createdAt: string;
};

type CourseDetailRes = {
	data: CourseDetail;
};

type CourseDetail = {
	courseId: number;
	creatorInfo?: {
		id: number;
		nickname: string;
	};
	title: string;
	description: string;
	targetAudience: string;
	price: number;
	installEnvChecklist: { content: string; isSupported: boolean }[];
	keyPoints: string[];
	tags: string[];
	thumbnailUrl: string | null;
	practiceFile: {
		id: number;
		name: string;
		contentType: string;
		size: number;
		url: string;
	}[];
	createdAt: string;
	videoInfo: {
		videoType: string;
		videoUuid: string;
		originFileName: string;
	};
};

type CourseFormProps = {
	subject: string;
	initialData?: CourseDetail;
	courseId?: number;
	onSubmit?: (formData: UploadformData) => void;
	submitText?: string;
	onBack?: () => void;
};

type AllowedFileType = {
	image: {
		accept: string;
		types: string[];
	};
	document: {
		accept: string;
		types: string[];
	};
	video: {
		accept: string;
		types: string[];
	};
};

type CourseUpdateReq = {
	title: string;
	description: string;
	targetAudience: string;
	price: number;
	installEnvChecklist: { content: string; isSupported: boolean }[];
	keyPoints: string[];
	tags: string[];
	deletePracticeField: number[];
	updateVideoUuid: string | null;
};

type UploadformData = {
	keyPoints: string[];
	isShow: boolean;
	price: number;
	installEnvChecklist: { content: string; isSupported: boolean }[];
	targetAudience: string;
	videoUuid: string | null;
	videoFile?: File | null;
	thumbnailFile?: File | null;
	thumbnailUrl?: string | null;
	practiceFiles?: File[];
	title: string;
	description: string;
	tags: string[];
};

type PurchaseAssistantChatbotReq = {
	course_id: number;
	query: string;
};

type ChatbotAttachment = {
	name: string;
	type: string;
	preview: string | null;
};

type CourserChatbotMessage = {
	sender: string;
	content: string;
	created_at?: string;
	attachments?: ChatbotAttachment[];
};

type PostMessageStreamReq = {
	course_id: number;
	message_text: string;
	file: string | null;
};

export type {
	AllowedFileType,
	CourseDetail,
	CourseDetailRes,
	CourseFormProps,
	CourserChatbotMessage,
	CourseUpdateReq,
	MyCoursesItems,
	PostMessageStreamReq,
	PurchaseAssistantChatbotReq,
	UploadformData,
};
