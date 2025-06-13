"use client";

import { BaseTab } from "@/app/_components/common";

import VideoManagement from "./_component/manage/VideoManagement";
import ConfirmRevenue from "./_component/revenue/ConfirmRevenue";
import VideoUpload from "./_component/upload/VideoUpload";

function Videos() {
	const tabItems = [
		{ label: "강의 관리", content: <VideoManagement /> },
		{ label: "강의 업로드", content: <VideoUpload /> },
		{ label: "수익 확인하기", content: <ConfirmRevenue /> },
	];
	return <BaseTab items={tabItems} defaultIndex={0} />;
}

export default Videos;
