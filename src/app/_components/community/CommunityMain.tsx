"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { BaseSearchBar } from "@/app/_components/common";
import { EMPTY_QUESTION, EMPTY_UPLOAD_COURSE } from "@/app/constants";
import { useUserStore } from "@/app/stores";

import { Pagination } from "../common";
import { EmptyDataMessage, QuestionCard } from "./common";

// 더미데이터 형태에 따른 임시 type 정의
type IsAnsweredType = "NONE" | "HAS_COMMENT" | "COMPLETE";

interface Props {
	courses: {
		courseId: number;
		title: string;
		price: number;
		viewCount: number;
		commentCount: number;
		tags: string[];
		thumbnailUrl: string;
		isShow: boolean;
		createdAt: string;
	}[];

	questions: {
		user: {
			id: number;
			nickname: string;
			userType: string;
		};
		courseId: number;
		questionId: number; // temp
		title: string;
		content: string;
		isAnswered: IsAnsweredType;
		createdAt: string;
		updatedAt: string;
	}[];
}

interface PaginationInfo {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
}

function CommunityMain({ courses, questions }: Props) {
	const userType = useUserStore((state) => state.user.userType);

	const [value, setValue] = useState("");

	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const hasCourses = courses.length > 0;

	// 강의 있으면 가장 첫번째 강의 선택
	const [selectedCourse, setSelectedCourse] = useState<number | null>(
		hasCourses ? courses[0].courseId : null,
	);

	// courses가 바뀔 때 선택 및 페이지 초기화
	useEffect(() => {
		if (hasCourses) {
			setSelectedCourse(courses[0].courseId);
		} else {
			setSelectedCourse(null);
		}
		// 페이지네이션 초기화도 같이
		setCurrentPage(1);
	}, [courses]);

	// TODO: 질문 리스트 추후 필터링 -> API
	const filteredQuestions = selectedCourse
		? questions.filter((q) => q.courseId === selectedCourse)
		: [];

	// 페이지네이션 더미
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5;

	const paginatedCourses = courses.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const pagination: PaginationInfo = {
		totalItems: courses.length,
		totalPages: Math.max(1, Math.ceil(courses.length / pageSize)),
		currentPage,
		perPage: pageSize,
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<h3 className="text-2xl font-semibold">커뮤니티</h3>
				{hasCourses && userType === "LEARNER" && (
					<button className="bg-primary-green-400 hover:bg-primary-green-500 active:bg-primary-green-600 text-white py-2 px-4 rounded-4xl transition-all duration-300 cursor-pointer">
						질문 남기기
					</button>
				)}
			</div>

			<BaseSearchBar
				value={value}
				placeholder="원하는 질문이나 키워드를 입력하세요!"
				onChange={onChangeSearch}
			/>

			<div className="flex gap-10 mt-10">
				<div className="flex flex-col gap-4 w-[480px]">
					<div className="flex flex-row justify-between">
						<span className="text-xl font-bold">
							{userType === "CREATOR"
								? "내가 업로드한 강의"
								: "내가 수강중인 강의"}
						</span>
					</div>

					{hasCourses ? (
						<>
							{paginatedCourses.map((course) => (
								<div
									key={course.courseId}
									onClick={() => setSelectedCourse(course.courseId)}
									className={`
										relative flex gap-4 rounded-2xl p-5 cursor-pointer 
										backdrop-blur-sm transition-all duration-500 ease-out 
										hover:scale-[1.02] hover:-translate-y-1 border
										${
											selectedCourse === course.courseId
												? "bg-gradient-to-br from-primary-green-50/80 to-primary-green-100/80 shadow-xl shadow-primary-green-500/10"
												: "bg-white hover:bg-white/80 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
										}
									`}
								>
									<div className="relative w-[200px] h-[120px] rounded-xl overflow-hidden shrink-0">
										<Image
											src={course.thumbnailUrl}
											alt={course.title}
											fill
											className="rounded-xl object-cover"
										/>
									</div>
									<div className="flex flex-col justify-center flex-1 min-w-0">
										<h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-gray-800 transition-colors">
											{course.title}
										</h3>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<div className="flex items-center gap-1">
												<div className="w-2 h-2 rounded-full bg-primary-green-400" />
												<span>질문 {course.commentCount}개</span>
											</div>
										</div>
									</div>
									{selectedCourse === course.courseId && (
										<div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary-green-600" />
									)}
								</div>
							))}

							{pagination.totalPages > 1 && (
								<Pagination
									pagination={pagination}
									onPageChange={(page) => setCurrentPage(page)}
								/>
							)}
						</>
					) : (
						<EmptyDataMessage message={EMPTY_UPLOAD_COURSE} />
					)}
				</div>

				{/* 특정 강의 질문 리스트 */}
				<div className="pt-10 flex-1">
					{filteredQuestions.length === 0 ? (
						<EmptyDataMessage message={EMPTY_QUESTION} />
					) : (
						filteredQuestions.map((question) => (
							<QuestionCard key={question.questionId} question={question} />
						))
					)}
				</div>
			</div>

			{userType === "LEARNER" && (
				<button className="fixed bottom-8 right-8 z-50 flex items-center bg-primary-green-400 hover:bg-primary-green-500 text-white font-semibold px-6 py-2 rounded-full shadow-none">
					<span>AI 챗봇에게 질문하기</span>
					<IoChatbubbleEllipses className="w-7 h-7 ml-2" />
				</button>
			)}
		</div>
	);
}

export default CommunityMain;
