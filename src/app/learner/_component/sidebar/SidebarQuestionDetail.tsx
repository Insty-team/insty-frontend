// 강의 수강 화면 사이드바

"use client";

import { QuestionDetail } from "@/app/_components/community";

interface QuestionDetailProps {
	questionId: number;
}

function SidebarQuestionDetail({ questionId }: QuestionDetailProps) {
	return <QuestionDetail questionId={questionId} />;
}

export default SidebarQuestionDetail;
