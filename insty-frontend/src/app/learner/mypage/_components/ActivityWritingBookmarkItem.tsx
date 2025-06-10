"use client";

import { FaTrash } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { HiPencil } from "react-icons/hi2";

import { BaseButton } from "@/app/_components/common";
import { getFormattedDate } from "@/app/utils";

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
					<BaseButton
						title="수정"
						icon={<HiPencil className="text-gray-50" />}
						className="!rounded-lg"
					/>
					<BaseButton
						title="삭제"
						icon={<FaTrash className="text-red-300" />}
						className={"!bg-gray-100 !text-red-300 !rounded-lg"}
					/>
				</div>
			)}
		</div>
	);
}

export default ActivityWritingBookmarkItem;
