"use client";
import { useState } from "react";
import VideosHeader from "./_component/VideosHeader";
import VideoManagement from "./_component/VideoManagement";

function Videos() {
	const [activeTab, setActiveTab] = useState("manage");

	return (
		<>
			<VideosHeader activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="w-full p-4 flex flex-col">
				{activeTab === "manage" && <VideoManagement />}
				{activeTab === "upload" && <div>업로드 탭 내용</div>}
				{activeTab === "revenue" && <div>수익 탭 내용</div>}
			</div>
		</>
	);
}

export default Videos; 