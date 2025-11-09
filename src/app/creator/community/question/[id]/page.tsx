import { QuestionDetail } from "@/app/_components/community/";

export default function CommunityQuestionDetail({
	params,
}: {
	params: { id: string };
}) {
	const questionId = Number(params.id);
	return <QuestionDetail questionId={questionId} />;
}
