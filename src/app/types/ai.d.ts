export type AIHistoryResponse = {
	question_history_by_date: AISession[];
};

export type AISession = {
	session_id: number;
	course_id: number;
	status: string;
	created_at: string;
	ended_at?: string;
	is_installed: boolean;
};
