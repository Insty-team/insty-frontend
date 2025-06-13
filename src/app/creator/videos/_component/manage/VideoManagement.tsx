"use client";

import { useState } from "react";
import { useGetMyCoursesQuery } from "@/app/queries";

import VideoDetail from "./VideoDetail";
import VideoEdit from "./VideoEdit";
import VideoList from "./VideoList";

export default function VideoManagement() {
	const [mode, setMode] = useState<"list" | "edit" | "detail">("list");
	const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
	const {
		data: myCoursesItems,
		isLoading,
		error,
	} = useGetMyCoursesQuery(1, 100);

	console.log("Query 상태:", { myCoursesItems, isLoading, error });

	if (mode === "edit" && selectedVideoId) {
		return (
			<VideoEdit videoId={selectedVideoId} onBack={() => setMode("list")} />
		);
	}
	if (mode === "detail" && selectedVideoId) {
		return (
			<VideoDetail videoId={selectedVideoId} onBack={() => setMode("list")} />
		);
	}

	if (isLoading) return <div>로딩중...</div>;
	if (error) return <div>에러가 발생했습니다</div>;
	if (!myCoursesItems) return <div>데이터가 없습니다</div>;

	return (
		<>
			<h2 className="text-3xl font-semibold mt-6 mb-4">업로드한 강의 리스트</h2>
			<VideoList
				myCoursesItems={myCoursesItems.items}
				onEdit={(courseId) => {
					setSelectedVideoId(courseId);
					setMode("edit");
				}}
				onDetail={(courseId) => {
					setSelectedVideoId(courseId);
					setMode("detail");
				}}
			/>
		</>
	);
}
