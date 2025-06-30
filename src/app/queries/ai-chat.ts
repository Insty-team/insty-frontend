import { useQuery } from "@tanstack/react-query";

import { getAIChatHistory, getAIMessageList } from "@/app/api";

// AI 챗봇 히스토리 조회
const useGetAIChatHistoryQuery = ({
	relativeDate = "",
	keyword = "",
	enabled = true,
}: {
	relativeDate?: string;
	keyword?: string;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: ["ai-history", relativeDate, keyword],
		queryFn: async () => {
			const res = await getAIChatHistory({ relativeDate, keyword });
			return res.question_history_by_date;
		},
		enabled,
	});
};

// AI 챗봇 세션별 메세지 목록 조회
const useGetAIMessageListQuery = (sessionId: number | undefined) => {
	return useQuery({
		queryKey: ["ai-messages", sessionId],
		queryFn: async () => {
			if (!sessionId) return;
			const res = await getAIMessageList(sessionId);
			return res;
		},
		enabled: !!sessionId,
	});
};

export { useGetAIChatHistoryQuery, useGetAIMessageListQuery };
