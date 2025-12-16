// 강의 수강 화면 사이드바 - 강의 질문 목록 컴포넌트
"use client";
import { useParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { FaPlus } from "react-icons/fa6";

import { BaseSearchBar } from "@/app/_components/common";
import { QuestionCard } from "@/app/_components/community/common";
import { EmptyDataMessage } from "@/app/_components/community/common";
import { EMPTY_QUESTION } from "@/app/constants";
import { useGetCommunityCourseQuestionQuery } from "@/app/queries";

function QuestionList({
	onSelect,
	onAddQuestion,
}: {
	onSelect: (id: number) => void;
	onAddQuestion: () => void;
}) {
	const { id } = useParams();
	const courseId = Number(id);
	console.log(courseId);

	const [keyword, setKeyword] = useState("");

	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	};

	const { data: questions, isLoading } = useGetCommunityCourseQuestionQuery({
		courseId,
		keyword,
	});
	const courseQuestions = questions?.items || [];

	return (
		<div className="flex-1 overflow-y-auto p-6">
			<button
				onClick={onAddQuestion}
				className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-primary-green-300 to-primary-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 ease-in-out flex items-center justify-center gap-2 cursor-pointer"
			>
				<FaPlus className="w-5 h-5" />
				질문 남기기
			</button>
			<BaseSearchBar
				value={keyword}
				placeholder="원하는 질문이나 키워드를 입력하세요!"
				onChange={onChangeSearch}
				className="mb-4"
			/>
			{isLoading ? (
				<div className="flex items-center justify-center py-12 text-gray-500">
					Loading...
				</div>
			) : courseQuestions.length > 0 ? (
				courseQuestions.map((question) => (
					<QuestionCard
						key={question.questionId}
						question={question}
						onClick={() => onSelect(question.questionId)}
					/>
				))
			) : (
				<EmptyDataMessage message={EMPTY_QUESTION} />
			)}
		</div>
	);
}

export default QuestionList;
