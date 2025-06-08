"use client";

import Image from "next/image";
import { useState } from "react";
import { GoCalendar, GoGraph } from "react-icons/go";
import { IoClipboardOutline, IoPencil } from "react-icons/io5";
import { LiaWonSignSolid } from "react-icons/lia";

import { BaseButton } from "@/app/_components/common";
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
								<GoGraph className="size-8" />
								조회수
								<span className="text-primary-green-600 ml-1">
									{video.views}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
							<span className="flex items-center gap-1 text-gray-500">
								<GoCalendar className="size-8" />
								업로드 날짜
								<span className="text-primary-green-600 ml-1">
									{video.uploadDate}
								</span>
							</span>
							<span className="mx-2 text-gray-300">·</span>
							<span className="flex items-center gap-1 text-gray-500">
								<LiaWonSignSolid className="size-8" />
								가격
								<span className="text-primary-green-600 ml-1">
									{video.price}
								</span>
							</span>
						</div>
						<div className="flex gap-2 mt-2 w-full">
							<BaseButton
								title="수정"
								textSize="text-21g"
								icon={<IoPencil />}
								className="!rounded-lg"
								onClick={() => {
									setSelectedVideoId(video.id);
									setMode("edit");
								}}
							/>
							<BaseButton
								title="상세보기"
								fill={false}
								textSize="text-21g"
								icon={<IoClipboardOutline />}
								className="!rounded-lg"
								onClick={() => {
									setSelectedVideoId(video.id);
									setMode("detail");
								}}
							/>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
