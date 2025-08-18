"use client";

import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoChatboxEllipses, IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";

import QuestionDetail from "./sidebar/QuestionDetail";
import QuestionList from "./sidebar/QuestionList";

export default function CourseSidebar() {
	const [isHovered, setIsHovered] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [mode, setMode] = useState<"LIST" | "DETAIL">("LIST");
	const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
		null,
	);

	const handleSelectQuestion = (id: number) => {
		setSelectedQuestionId(id);
		setMode("DETAIL");
	};

	return (
		<>
			{!isSidebarOpen && (
				<div
					className={`group flex flex-col justify-center items-center fixed top-1/6 rounded-bl-xl rounded-tl-xl border border-gray-scale-100 px-2 py-4 cursor-pointer z-[2100] transition-colors duration-200 ${
						isHovered
							? "bg-primary-green-500 shadow-lg text-white"
							: "shadow-md text-primary-green-500 bg-white"
					} transition-all`}
					style={{
						right: isSidebarOpen ? "700px" : "0",
						transition: "right 0.5s",
					}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					onClick={() => setIsSidebarOpen((prev) => !prev)}
				>
					{isHovered ? (
						<IoChatboxEllipses className="w-8 h-8" />
					) : (
						<IoChatboxEllipsesOutline className="w-8 h-8" />
					)}
					<p className="text-lg">Community</p>
					{isHovered && (
						<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
							<div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
								사이드바 열기
							</div>
						</div>
					)}
				</div>
			)}

			<div
				className={`fixed top-0 right-0 h-full w-[700px] bg-white shadow-2xl z-[2000] flex flex-col border-l border-gray-200 transition-transform duration-300 ${
					isSidebarOpen
						? "translate-x-0"
						: "translate-x-full pointer-events-none"
				}`}
			>
				<div className="flex justify-between items-center p-6 border-b border-gray-100">
					<span className="text-2xl font-bold">커뮤니티</span>
					<button
						onClick={() => setIsSidebarOpen(false)}
						aria-label="사이드바 닫기"
						className="group relative p-2 rounded-full bg-gray-50 hover:bg-primary-green-100 border border-gray-200 hover:border-red-200 transition-all duration-200 ease-in-out hover:shadow-md"
					>
						<IoChevronForwardOutline className="w-5 h-5 text-gray-400 group-hover:text-primary-green-500 transition-colors duration-200" />
						<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
							<div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
								닫기
							</div>
						</div>
					</button>
				</div>
				<div className="flex-1 overflow-y-auto">
					{mode === "LIST" && <QuestionList onSelect={handleSelectQuestion} />}
					{mode === "DETAIL" && selectedQuestionId && (
						<div className="mx-auto px-6 py-8">
							<span className="inline-flex items-center justify-center p-2 mb-4 cursor-pointer hover:bg-gray-100 hover:rounded-full text-gray-500">
								<FaArrowLeft size={24} onClick={() => setMode("LIST")} />
							</span>
							<QuestionDetail questionId={selectedQuestionId} />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
