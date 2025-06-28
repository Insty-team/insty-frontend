"use client";

import { BaseButton } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { useGetMyCoursesQuery } from "@/app/queries";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseDetail from "./CourseDetail";
import CourseEdit from "./CourseEdit";
import CourseList from "./CourseList";

function CourseManagement() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const {
		data: myCoursesItems,
		isLoading,
		error,
	} = useGetMyCoursesQuery(1, 100);

	const mode =
		(searchParams.get("mode") as "list" | "edit" | "detail") || "list";
	const courseIdFromUrl = searchParams.get("courseId");

	useEffect(() => {
		if (courseIdFromUrl) {
			setSelectedCourseId(Number(courseIdFromUrl));
		}
	}, [courseIdFromUrl]);

	const handleMoveUpload = () => {
		router.push("/creator/courses/course-upload");
	};

	//누를때마다 쿼리스트링으로 모드 변경(뒤로가기 흔적 남기기 위함...)
	const handleModeChange = (
		newMode: "list" | "edit" | "detail",
		courseId?: number,
	) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("mode", newMode);
		if (courseId) {
			params.set("courseId", courseId.toString());
		} else {
			params.delete("courseId");
		}
		router.push(`?${params.toString()}`, { scroll: false });
	};

	if (mode === "edit" && selectedCourseId) {
		return (
			<CourseEdit
				courseId={selectedCourseId}
				onBack={() => handleModeChange("list")}
			/>
		);
	}
	if (mode === "detail" && selectedCourseId) {
		return (
			<CourseDetail
				courseId={selectedCourseId}
				onBack={() => handleModeChange("list")}
			/>
		);
	}

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading width={100} height={100} />
			</div>
		);
	if (error) return <div>에러가 발생했습니다</div>;

	return (
		<>
			{myCoursesItems.items.length === 0 ? (
				<div className="flex flex-col h-[50vh] justify-center items-center text-center text-2xl text-primary-green-600">
					<Image src="/insty.png" alt="로고" width={120} height={120} />
					<p className="mt-4 text-2lg">아직 업로드한 강의가 없네요!</p>
					<BaseButton
						title="강의 업로드 하러가기"
						onClick={handleMoveUpload}
						className="!w-[30%] mt-4"
					/>
				</div>
			) : (
				<>
					<h2 className="text-3xl font-semibold mt-6 mb-4">
						업로드한 강의 리스트
					</h2>
					<CourseList
						myCoursesItems={myCoursesItems.items}
						onEdit={(courseId) => {
							handleModeChange("edit", courseId);
						}}
						onDetail={(courseId) => {
							handleModeChange("detail", courseId);
						}}
					/>
				</>
			)}
		</>
	);
}

export default CourseManagement;
