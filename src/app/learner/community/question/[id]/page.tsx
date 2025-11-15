import { use } from "react";

import { QuestionDetail } from "@/app/_components/community";

export default function CommunityQuestionDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	return <QuestionDetail questionId={Number(id)} />;
}
