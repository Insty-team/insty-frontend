"use client";

import { FaMessage } from "react-icons/fa6";

import { getFormattedDate } from "@/app/utils/date";

export type ActivityReplyItemProps = {
	title: string;
	content: string;
	// category: string 피그마 내에서 삼우님이 삭제한다고 기재되어 있지만 임시 주석 처리
	createdAt: string;
	replyContent: string;
};

function ActivityReplyItem({ item }: { item: ActivityReplyItemProps }) {
	return (
		<div className="flex flex-col w-[230px] gap-2 mb-10">
			<div className="flex flex-col gap-1">
				<div className="text-xl line-clamp-1">{item.title}</div>
				<div className="text-lg line-clamp-2">{item.content}</div>
				<div className="text-lg">{getFormattedDate(item.createdAt)}</div>
			</div>
			<div className="flex items-start justify-start gap-2">
				<FaMessage className="text-gray-500 size-6 mt-1" />
				<span className="w-[230px] line-clamp-2">{item.replyContent}</span>
			</div>
		</div>
	);
}

export default ActivityReplyItem;
