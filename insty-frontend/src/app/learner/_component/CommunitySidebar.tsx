"use client";

import { useState } from "react";
import { IoChatboxEllipsesOutline, IoChatboxEllipses } from "react-icons/io5";

export default function CommunitySidebar() {
	const [isHovered, setIsHovered] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<>
			<div
				className={`flex flex-col justify-center items-center fixed top-1/6 rounded-bl-xl rounded-tl-xl border border-gray-scale-100 px-2 py-4 cursor-pointer z-[2100] transition-colors duration-200 ${
					isHovered
						? "bg-primary-green-500 shadow-lg text-white"
						: "shadow-md text-primary-green-500 bg-white"
				} transition-all`}
				style={{
					right: isSidebarOpen ? "480px" : "0",
					transition: "right 0.3s",
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
			</div>

			<div
				className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-[2000] flex flex-col border-l border-gray-200 transition-transform duration-300 ${
					isSidebarOpen
						? "translate-x-0"
						: "translate-x-full pointer-events-none"
				}`}
			>
				<div className="flex justify-between items-center p-6 border-b border-gray-100">
					<span className="text-2xl font-bold">커뮤니티</span>
				</div>
				<div className="flex-1 overflow-y-auto p-6">
					<div className="text-lg text-gray-500">
						여기에 커뮤니티 내용이 들어갑니다.
					</div>
				</div>
			</div>
		</>
	);
} 