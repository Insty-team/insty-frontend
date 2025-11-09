import { useQuery } from "@tanstack/react-query";

import {
	getAcceptedAnswer,
	getAnswer,
	getCommunityCourseQuestion,
	getQuestionDetail,
} from "../api/backend/";
import { QuestionsParamsReq } from "../types/community";
import {
	AnswerResponse,
	CommunityQuestionsResponse,
	QuestionDetail,
} from "../types/community";

// 디폴트 선택 변경하고 null 제거해야함
// 검색어, 댓글 상태 필터링 바뀌면 refetch 되도록
const useGetCommunityCourseQuestionQuery = (params: QuestionsParamsReq) => {
	return useQuery<CommunityQuestionsResponse>({
		queryKey: ["communityCourseQuestion", params],
		queryFn: () => getCommunityCourseQuestion(params),
		enabled: !!params.courseId,
	});
};

const useGetQuestionDetail = (questionId: number) => {
	return useQuery<QuestionDetail>({
		queryKey: ["questionDetail", questionId],
		queryFn: () => getQuestionDetail(questionId),
		enabled: !!questionId,
	});
};

const useGetAnswer = (questionId: number) => {
	return useQuery<AnswerResponse>({
		queryKey: ["answers", questionId],
		queryFn: () => getAnswer(questionId),
	});
};

const useGetAcceptedAnswer = (questionId: number) => {
	return useQuery({
		queryKey: ["acceptedAnswer", questionId],
		queryFn: () => getAcceptedAnswer(questionId),
		enabled: !!questionId,
	});
};

export {
	useGetAcceptedAnswer,
	useGetAnswer,
	useGetCommunityCourseQuestionQuery,
	useGetQuestionDetail,
};
