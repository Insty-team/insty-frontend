import { QuestionDetail } from "@/app/_components/community";
export default function CommunityQuestionDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const questionId = Number(params.id);
	return <QuestionDetail questionId={questionId} />;
}
