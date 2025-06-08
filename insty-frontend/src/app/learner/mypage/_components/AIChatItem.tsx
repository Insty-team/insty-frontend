"use client";

import { getFormattedDate } from "@/app/utils";

type AIChatItemProps = {
	date: string;
};

function AIChatItem({ date }: AIChatItemProps) {
	return (
		<div className="flex flex-col gap-4 w-full">
			<span className="text-xl">
				{getFormattedDate(date, "YYYY년 MM월 DD일")}
			</span>
			<div className="flex gap-12 w-full">
				<div className="border-[3px] h-full shadow-line-200"></div>
				<div className="flex flex-col w-full gap-2">
					<span className="text-2lg">강의 제목</span>
					<span className="text-21g line-clamp-2">
						질문 내용 : 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문
						질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문
						질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문
						질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문
						질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문 질문
					</span>
					<button className="text-primary-blue-600 text-right cursor-pointer">
						자세히 보기
					</button>
				</div>
			</div>
		</div>
	);
}

export default AIChatItem;
