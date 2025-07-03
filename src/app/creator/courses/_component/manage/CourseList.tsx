"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { GoCalendar } from "react-icons/go";
import { GoGraph } from "react-icons/go";
import { IoClipboardOutline } from "react-icons/io5";
import { IoPencil } from "react-icons/io5";

import { BaseButton } from "@/app/_components/common";
import { MyCoursesItems } from "@/app/types/course";

function CourseList({
	myCoursesItems,
	onEdit,
	onDetail,
}: {
	myCoursesItems: MyCoursesItems[];
	onEdit: (courseId: number) => void;
	onDetail: (courseId: number) => void;
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const totalPages = Math.ceil(myCoursesItems.length / itemsPerPage);

	const currentCourses = myCoursesItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			let start = Math.max(1, currentPage - 2);
			const end = Math.min(totalPages, start + maxVisiblePages - 1);

			if (end === totalPages) {
				start = Math.max(1, end - maxVisiblePages + 1);
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	console.log(myCoursesItems);
	return (
		<>
			{currentCourses?.map((course: MyCoursesItems) => (
				<div
					key={course.courseId}
					className="flex bg-white p-4 items-center gap-6"
				>
					<div className="overflow-hidden flex-shrink-0 flex items-center justify-center w-[390px] h-[220px]">
						{course?.thumbnailUrl ? (
							<Image
								src={course.thumbnailUrl}
								alt="썸네일"
								width={390}
								height={220}
								className="object-contain w-full h-full border border-black-300"
								onError={(e) => {
									console.error("이미지 로딩 실패:", course.thumbnailUrl);
									e.currentTarget.src = "/dog.png";
								}}
							/>
						) : (
							<Image
								src="/dog.png"
								alt="기본 썸네일"
								width={390}
								height={220}
								className="object-contain w-full h-full border border-black-300"
							/>
						)}
					</div>
					<div className="flex-1 flex flex-col gap-3">
						<div className="font-semibold text-2xl text-ellipsis whitespace-nowrap overflow-hidden">
							{course.title.length > 35
								? `${course.title.slice(0, 35)}...`
								: course.title}
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
									{dayjs(course.createdAt).format("YYYY년 MM월 DD일")}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
						</div>
						<div className="flex gap-2 mt-2 w-[60%]">
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

			{/* 페이지네이션 부분 */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 mt-8 mb-4">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className={`px-3 py-2 rounded-lg text-lg border border-gray-scale-200 ${
							currentPage === 1
								? "text-gray-400 cursor-not-allowed"
								: "text-black-100 hover:bg-gray-100 cursor-pointer"
						}`}
					>
						이전
					</button>

					{getPageNumbers().map((page) => (
						<button
							key={page}
							onClick={() => handlePageChange(page)}
							className={`px-4 py-2 rounded-lg text-lg cursor-pointer ${
								currentPage === page
									? "bg-primary-green-600 text-white"
									: "text-black-100 hover:bg-gray-100"
							}`}
						>
							{page}
						</button>
					))}

					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className={`px-3 py-2 rounded-lg text-lg border border-gray-scale-200 ${
							currentPage === totalPages
								? "text-gray-400 cursor-not-allowed"
								: "text-black-100 hover:bg-gray-100 cursor-pointer"
						}`}
					>
						다음
					</button>
				</div>
			)}
		</>
	);
}

export default CourseList;
