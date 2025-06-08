"use client";

import { useState } from "react";

import VideoManagement from "./_component/manage/VideoManagement";
import ConfirmRevenue from "./_component/revenue/ConfirmRevenue";
import VideoUpload from "./_component/upload/VideoUpload";
import VideosHeader from "./_component/VideosHeader";

function Videos() {
	const [activeTab, setActiveTab] = useState("manage");

	return (
		<>
			<VideosHeader activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="w-full p-4 flex flex-col">
				{activeTab === "manage" && <VideoManagement />}
				{activeTab === "upload" && <VideoUpload />}
				{activeTab === "revenue" && <ConfirmRevenue />}
			</div>
		</>
	);
}

export default Videos;
