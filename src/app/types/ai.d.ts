export type AIHistoryResponse = {
	question_history_by_date: AIHistoryByDate[];
};

export type AIHistoryByDate = {
	date: string;
	questions: AIHistoryItem[];
};

export type AIHistoryItem = {
	session_id: number;
	course_title: string;
	message_id: number;
	question_title: string;
};

export type AIMessageResponse = {
	session_id: number;
	course_id: number;
	messages: AIMessage[];
};

export type AIMessage = {
	message_id: number;
	sender: AISender;
	content: string;
	created_at: string;
	attachments: AIMessageAttachment[];
};

export type AIMessageAttachments = {
	file_url: string;
	file_type: string;
	file_size: number;
	file_name: string;
};

export type AISender = "assistant" | "user";
