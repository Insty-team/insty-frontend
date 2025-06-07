"use client";

import Image from "next/image";
import { useState } from "react";

import { IconButton } from "@/app/_components/common";
import { VIDEOS_DUMMY_LIST } from "@/app/constants";

import VideoDetail from "./VideoDetail";
import VideoEdit from "./VideoEdit";

export default function VideoManagement() {
	const [mode, setMode] = useState<"list" | "edit" | "detail">("list");
	const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

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

	return (
		<>
			<h2 className="text-3xl font-semibold mt-6 mb-4">업로드한 영상 리스트</h2>
			{VIDEOS_DUMMY_LIST.map((video) => (
				<div key={video.id} className="flex bg-white p-4 items-center gap-6">
					<div className="overflow-hidden flex-shrink-0 flex items-center justify-center">
						{video.thumbnail ? (
							<Image
								src={video.thumbnail}
								alt="썸네일"
								width={300}
								height={150}
								className="object-cover w-full h-full"
							/>
						) : null}
					</div>
					<div className="flex-1 flex flex-col gap-3">
						<div className="font-semibold text-2xl text-ellipsis whitespace-nowrap overflow-hidden">
							{video.title}
						</div>
						<div className="flex flex-wrap gap-1">
							{video.tags.map((tag, idx) => (
								<span
									key={idx}
									className="text-black-100 text-2lg bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5"
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex items-center gap-2 text-xl mt-1">
							<span className="flex items-center gap-1 text-gray-500">
								<Image
									src="/userGraph.svg"
									alt="조회수"
									width={36}
									height={36}
								/>
								조회수{" "}
								<span className="text-primary-green-600 ml-1">
									{video.views}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
							<span className="flex items-center gap-1 text-gray-500">
								<Image
									src="/date.svg"
									alt="업로드 날짜"
									width={36}
									height={36}
								/>
								업로드 날짜{" "}
								<span className="text-primary-green-600 ml-1">
									{video.uploadDate}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
							<span className="flex items-center gap-1 text-gray-500">
								<Image src="/money.svg" alt="가격" width={36} height={36} />
								가격{" "}
								<span className="text-primary-green-600 ml-1">
									{video.price}
								</span>
							</span>
						</div>
						<div className="flex gap-2 mt-2 w-full">
							<IconButton
								align="right"
								title="수정"
								icon="/edit.svg"
								textSize="text-2lg"
								className="w-[20%] flex items-center justify-center px-4 py-2 rounded-lg bg-primary-green-400 hover:bg-primary-green-500 active:bg-primary-green-600 text-white"
								onClick={() => {
									setSelectedVideoId(video.id);
									setMode("edit");
								}}
							/>
							<button
								onClick={() => {
									setSelectedVideoId(video.id);
									setMode("detail");
								}}
								className={`w-[20%] flex items-center justify-center px-4 py-2 rounded-lg border border-primary-green-600 hover:bg-primary-green-500 active:bg-primary-green-600 text-primary-green-600 hover:text-white active:text-white`}
							>
								상세 보기
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="w-6 h-6 ml-1"
								>
									<path
										d="M18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3Z"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<path d="M7 7H17" stroke="currentColor" strokeWidth="1.5" />
									<path d="M7 11H17" stroke="currentColor" strokeWidth="1.5" />
									<path d="M7 15H12" stroke="currentColor" strokeWidth="1.5" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
