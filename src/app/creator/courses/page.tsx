"use client";

import { BaseTab } from "@/app/_components/common";

import CourseManagement from "./_component/manage/CourseManagement";
import ConfirmRevenue from "./_component/revenue/ConfirmRevenue";
import CourseUpload from "./_component/upload/CourseUpload";

function Courses() {
	const tabItems = [
		{ label: "강의 관리", content: <CourseManagement /> },
		{ label: "강의 업로드", content: <CourseUpload /> },
		{ label: "수익 확인하기", content: <ConfirmRevenue /> },
	];
	return <BaseTab items={tabItems} defaultIndex={0} />;
}

export default Courses;
