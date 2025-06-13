"use client";

import { BaseButton } from "@/app/_components/common";
import { IoClipboardOutline } from "react-icons/io5";
import { MyCoursesItems } from "@/app/types/course";
import Image from "next/image";
import { GoCalendar } from "react-icons/go";
import { GoGraph } from "react-icons/go";
import { IoPencil } from "react-icons/io5";
import { LiaWonSignSolid } from "react-icons/lia";

function VideoList({
	myCoursesItems,
	onEdit,
	onDetail,
}: {
	myCoursesItems: MyCoursesItems[];
	onEdit: (courseId: number) => void;
	onDetail: (courseId: number) => void;
}) {
	return (
		<>
			{myCoursesItems?.map((course: MyCoursesItems) => (
				<div
					key={course.courseId}
					className="flex bg-white p-4 items-center gap-6"
				>
					<div className="overflow-hidden flex-shrink-0 flex items-center justify-center">
						{course.thumbnailUrl ? (
							<Image
								src={
									course.thumbnailUrl.length > 0
										? course.thumbnailUrl
										: "/dog.png"
								}
								alt="썸네일"
								width={300}
								height={150}
								className="object-cover w-full h-full"
							/>
						) : null}
					</div>
					<div className="flex-1 flex flex-col gap-3">
						<div className="font-semibold text-2xl text-ellipsis whitespace-nowrap overflow-hidden">
							{course.title}
						</div>
						<div className="flex flex-wrap gap-1">
							{course.tags.map((tag, idx) => (
								<span
									key={idx}
									className="text-black-100 text-2lg bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5"
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex items-center gap-2 text-xl mt-1">
							<span className="flex items-center gap-1 text-gray-500">
								<GoGraph className="size-8" />
								조회수
								<span className="text-primary-green-600 ml-1">
									{course.viewCount}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
							<span className="flex items-center gap-1 text-gray-500">
								<GoCalendar className="size-8" />
								업로드 날짜
								<span className="text-primary-green-600 ml-1">
									{course.createdAt}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
							<span className="flex items-center gap-1 text-gray-500">
								<LiaWonSignSolid className="size-8" />
								가격
								<span className="text-primary-green-600 ml-1">
									{course.price}
								</span>
							</span>
						</div>
						<div className="flex gap-2 mt-2 w-full">
							<BaseButton
								title="수정"
								textSize="text-21g"
								icon={<IoPencil />}
								className="!rounded-lg"
								onClick={() => onEdit(course.courseId)}
							/>
							<BaseButton
								title="상세보기"
								fill={false}
								textSize="text-21g"
								icon={<IoClipboardOutline />}
								className="!rounded-lg"
								onClick={() => onDetail(course.courseId)}
							/>
						</div>
					</div>
				</div>
			))}
		</>
	);
}

export default VideoList;
