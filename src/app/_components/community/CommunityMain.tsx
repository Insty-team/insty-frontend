"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { BaseButton, BaseSearchBar } from "@/app/_components/common";
import { EMPTY_QUESTION } from "@/app/constants";
import { useGetCommunityCourseQuestionQuery } from "@/app/queries"; // 강좌별 질문 검색
import { useUserStore } from "@/app/stores";
import { MyCoursesItems } from "@/app/types/course";

import { Pagination } from "../common";
import { EmptyDataMessage, QuestionCard } from "./common";

interface CommunityMainProps {
	mode: "CREATOR" | "LEARNER";
	courses: MyCoursesItems[];
	coursePagination: Pagination;
	currentPage: number;
	onPageChange: (page: number) => void;
}

interface Pagination {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
}

function CommunityMain({
	mode,
	courses,
	coursePagination,
	onPageChange,
}: CommunityMainProps) {
	const router = useRouter();
	const userType = useUserStore((state) => state.user.userType);

	const [selectedCourse, setSelectedCourse] = useState<number | null>(
		courses.length > 0 ? courses[0].courseId : null,
	);

	const [keyword, setKeyword] = useState("");

	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
		"WAITING",
		"ANSWERED",
		"ACCEPTED",
	]);

	const toggleStatus = (status: string) => {
		setSelectedStatuses((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status],
		);
	};

	// 검색 관련
	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	};

	const hasCourses = courses.length > 0;

	const { data: questions } = useGetCommunityCourseQuestionQuery({
		courseId: selectedCourse!,
		page: 1,
		pageSize: 20,
		keyword,
		statuses: selectedStatuses,
	});

	console.log(selectedStatuses);
	console.log("질문 목록", questions);
	const courseQuestions = questions?.items || [];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<h3 className="text-2xl font-semibold">커뮤니티</h3>
				{hasCourses && mode === "LEARNER" && (
					<button
						onClick={() => router.push("/learner/community/question")}
						className="bg-primary-green-400 hover:bg-primary-green-500 active:bg-primary-green-600 text-white py-2 px-4 rounded-4xl transition-all duration-300 cursor-pointer"
					>
						질문 남기기
					</button>
				)}
			</div>

			<div>
				<BaseSearchBar
					value={keyword}
					placeholder="원하는 질문이나 키워드를 입력하세요!"
					onChange={onChangeSearch}
				/>
			</div>

			<div className="flex gap-10 mt-10">
				{hasCourses ? (
					<>
						<div className="flex flex-col gap-4 w-[480px]">
							<div className="flex flex-row justify-between">
								<span className="text-xl font-bold">
									{mode === "CREATOR"
										? "내가 업로드한 강의"
										: "내가 수강중인 강의"}
								</span>
							</div>

							{courses.map((course: MyCoursesItems) => (
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
											src={course.thumbnailUrl || ""}
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

							{coursePagination.totalPages > 1 && (
								<Pagination
									pagination={coursePagination}
									onPageChange={onPageChange}
								/>
							)}
						</div>

						{/* 특정 강의 질문 리스트 */}
						<div className="pt-10 flex-1">
							{/* 필터링 버튼 */}
							<div className="flex gap-3 mb-6">
								{["WAITING", "ANSWERED", "ACCEPTED"].map((status) => {
									const isSelected = selectedStatuses.includes(status);
									const label =
										status === "WAITING"
											? "답변 대기"
											: status === "ANSWERED"
												? "답변 완료"
												: "채택 완료";

									return (
										<button
											key={status}
											onClick={() => toggleStatus(status)}
											className={`
          px-4 py-2 rounded-lg border text-sm font-medium transition-colors
          ${
						isSelected
							? "bg-primary-green-200 text-primary-green-600 border-primary-green-300"
							: "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
					}
        `}
										>
											{label}
										</button>
									);
								})}
							</div>
							{courseQuestions && courseQuestions.length > 0 ? (
								courseQuestions.map((question) => {
									const handleClick = () => {
										if (userType === "CREATOR") {
											router.push(
												`/creator/community/question/${question.questionId}`,
											);
										} else {
											router.push(
												`/learner/community/question/${question.questionId}`,
											);
										}
									};

									return (
										<QuestionCard
											key={question.questionId}
											question={question}
											onClick={handleClick}
										/>
									);
								})
							) : (
								<EmptyDataMessage message={EMPTY_QUESTION} />
							)}
						</div>

						{mode === "LEARNER" && (
							<button className="fixed bottom-8 right-8 z-50 flex items-center bg-primary-green-400 hover:bg-primary-green-500 text-white font-semibold px-6 py-2 rounded-full shadow-none">
								<span>AI 챗봇에게 질문하기</span>
								<IoChatbubbleEllipses className="w-7 h-7 ml-2" />
							</button>
						)}
					</>
				) : //  강의가 없을 경우
				mode === "CREATOR" ? (
					<div className="flex flex-col w-full h-[50vh] justify-center items-center text-center text-2xl text-primary-green-600">
						<Image
							src="/insty.png"
							alt="로고"
							width={120}
							height={120}
							className="aspect-square"
						/>
						<p className="mt-4 text-2lg">아직 업로드한 강의가 없네요!</p>
						<BaseButton
							title="강의 업로드 하러가기"
							onClick={() => router.push("/creator/courses/course-upload")}
							className="!w-[30%] mt-4"
						/>
					</div>
				) : (
					<div className="flex flex-col w-full h-[50vh] justify-center items-center text-center text-2xl text-primary-green-600">
						<Image
							src="/insty.png"
							alt="로고"
							width={120}
							height={120}
							className="aspect-square"
						/>
						<p className="mt-4 text-2lg">아직 수강중인 강의가 없네요!</p>
						<BaseButton
							title="강의 추천받으러 가기"
							onClick={() => router.push("/learner/recommend")}
							className="!w-[30%] mt-4"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default CommunityMain;
