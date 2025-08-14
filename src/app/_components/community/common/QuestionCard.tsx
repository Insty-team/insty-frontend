"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FaMessage, FaRegMessage } from "react-icons/fa6";

import { useUserStore } from "@/app/stores";

interface QuestionCardProps {
	question: {
		questionId: number;
		title: string;
		content: string;
		isAnswered: string;
		createdAt: string;
	};
}

// TODO: 임시로 NONE, HAS_COMMENT, COMPLETE 를 반환받았다 생각하고 (논의 필요)
const answerStatusInfo = {
	NONE: {
		label: "댓글 대기중",
		bg: "bg-gray-100",
		text: "text-gray-600",
		icon: <FaRegMessage className="w-3 h-3" />,
	},
	HAS_COMMENT: {
		label: "댓글 있음",
		bg: "bg-primary-green-100",
		text: "text-primary-green-700",
		icon: <FaMessage className="w-3 h-3" />,
	},
	COMPLETE: {
		label: "답변 완료",
		bg: "bg-blue-100",
		text: "text-blue-600",
		icon: <FaMessage className="w-3 h-3" />,
	},
} as const;

export default function QuestionCard({ question }: QuestionCardProps) {
	const userType = useUserStore((state) => state.user.userType);

	const router = useRouter();
	const status =
		answerStatusInfo[question.isAnswered as keyof typeof answerStatusInfo] ??
		answerStatusInfo.NONE;

	const handleClick = () => {
		userType === "CREATOR"
			? router.push(`/creator/community/question/${question.questionId}`)
			: router.push(`/learner/community/question/${question.questionId}`);
	};

	return (
		<div
			className="
				group relative cursor-pointer py-6 px-2
				border-b last:border-b-0
				hover:bg-primary-green-50/30 hover:px-4
				transition-all duration-300 ease-out"
			onClick={handleClick}
		>
			<h4 className="font-semibold text-xl text-gray-900 mb-3 transition-colors line-clamp-2 leading-relaxed">
				{question.title}
			</h4>
			<p className="text-gray-600 mb-4 line-clamp-1 leading-relaxed">
				{question.content}
			</p>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div
						className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
					>
						{status.icon}
						<span>{status.label}</span>
					</div>
				</div>
				<div className="text-sm text-gray-500">
					{dayjs(question.createdAt).format("YYYY.MM.DD")}
				</div>
			</div>
			<div className="absolute left-0 top-0 w-1 h-full bg-primary-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</div>
	);
}
