"use client";

import { HiPencil } from "react-icons/hi2";
import { FaTrash } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { getFormattedDate } from "@/app/utils/date";

export type ActivityWritingBookmarkItemProps = {
	title: string;
	content: string;
	// category: string 피그마 내에서 삼우님이 삭제한다고 기재되어 있지만 임시 주석 처리
	createdAt: string;
	replies: number;
	isNew: boolean;
};

function ActivityWritingBookmarkItem({
	item,
	type = "writing",
}: {
	item: ActivityWritingBookmarkItemProps;
	type?: "writing" | "bookmark";
}) {
	return (
		<div className="flex flex-col w-[230px] mb-10 gap-2">
			<div className="flex flex-col gap-1">
				<div className="text-xl">{item.title}</div>
				<div className="text-lg line-clamp-2">{item.content}</div>
				<div className="text-lg">{getFormattedDate(item.createdAt)}</div>
			</div>
			<div className="flex items-center justify-start gap-2">
				<FaMessage className="text-gray-500" />
				<span>답변 {item.replies}개</span>
				{item.isNew && <span className="text-red-300">NEW</span>}
			</div>
			{type === "writing" && (
				<div className="flex h-9 gap-4 mt-4">
					<button className="flex w-full justify-center items-center gap-1 bg-primary-green-500 rounded-lg">
						<span className="text-gray-50">수정</span>
						<HiPencil className="text-gray-50" />
					</button>
					<button className="flex w-full justify-center items-center gap-1 bg-gray-100 rounded-lg">
						<span className="text-red-300">삭제</span>
						<FaTrash className="text-red-300" />
					</button>
				</div>
			)}
		</div>
	);
}

export default ActivityWritingBookmarkItem;
