"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

import Loading from "@/app/_components/common/Loading";
import PreviewInfomation from "@/app/learner/_component/courses/PreviewInformation";
import { useGetCourseDetailQuery } from "@/app/queries";

function CourseDetail() {
	const params = useParams();
	const router = useRouter();
	const {
		data: courseData,
		isLoading,
		error,
	} = useGetCourseDetailQuery(Number(params.id));

	useEffect(() => {
		if (error) {
			Swal.fire({
				title: "강의 데이터를 불러오는 데 실패하였습니다.",
				text: "다시 시도해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				router.back();
			});
		}
	}, [error, router]);

	useEffect(() => {
		if (!isLoading && !error && !courseData?.data) {
			Swal.fire({
				title: "강의 데이터를 불러오는 데 실패하였습니다.",
				text: "다시 시도해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				router.back();
			});
		}
	}, [isLoading, error, courseData, router]);

	if (isLoading) {
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen gap-2">
				<p className="text-primary-green-500">데이터 불러오는 중...</p>
				<Loading width={30} height={30} />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen">
				<p className="text-red-500">데이터를 불러올 수 없습니다.</p>
			</div>
		);
	}

	if (!courseData?.data) {
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen">
				<p className="text-gray-500">
					강의 데이터를 불러오는 데 실패하였습니다. 뒤로가기를 눌러주세요.
				</p>
			</div>
		);
	}

	return <PreviewInfomation data={courseData.data} />;
}

export default CourseDetail;
