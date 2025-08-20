"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { useGetMyCoursesQuery } from "@/app/queries";

import CourseEdit from "./CourseEdit";
import CourseList from "./CourseList";

function CourseManagement() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data: myCoursesItems,
		isLoading,
		error,
	} = useGetMyCoursesQuery(currentPage, 5); // 페이지별 5개씩

	const mode = (searchParams.get("mode") as "list" | "edit") || "list";
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
	const handleModeChange = (newMode: "list" | "edit", courseId?: number) => {
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
				key={selectedCourseId}
				courseId={selectedCourseId}
				onBack={() => handleModeChange("list")}
			/>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading width={100} height={100} />
			</div>
		);
	}
	//오류 처리
	if (error) {
		Swal.fire({
			title: `${error.name}`,
			text: `${error.message}`,
			icon: "error",
			confirmButtonText: "확인",
		});
	}

	return (
		<>
			{myCoursesItems.items.length === 0 ? (
				<div className="flex flex-col h-[50vh] justify-center items-center text-center text-2xl text-primary-green-600">
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
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={myCoursesItems.pagination.totalPages}
						onEdit={(courseId) => {
							handleModeChange("edit", courseId);
						}}
					/>
				</>
			)}
		</>
	);
}

export default CourseManagement;
