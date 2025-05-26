"use client";
import React, { useState } from "react";
import { FiSearch, FiHeart } from "react-icons/fi";
import { TbCircleX } from "react-icons/tb";
import Chatbot from "../_component/Chatbot";

function Recommend() {
	const dummyCards = Array.from({ length: 8 });
	const [searchText, setSearchText] = useState("");
	const [mode, setMode] = useState<"chatbot" | "directSearch">("chatbot");

	if(mode === "chatbot") {
		return (<Chatbot changeDirectSearch={() => setMode("directSearch")} />);
	}

	return (
		<div className="w-full min-h-screen">
			<div className="max-w-[1400px] mx-auto px-6">
				<div className="flex justify-between items-center">
					<h2 className="text-3xl font-bold mt-12 mb-12">맞춤 콘텐츠 추천</h2>
					<button className="bg-primary-green-500 text-white px-4 py-2 rounded-2xl" onClick={() => setMode("chatbot")}>챗봇 이용하기</button>
				</div>
				<div className="flex items-center  bg-gray-scale-100 rounded-full px-9 py-4 mb-9">
					<FiSearch className="text-black-100 mr-6 text-2xl" />
					<input
						type="text"
						placeholder="설치 환경(OS), 소프트웨어 이름을 입력해보세요!"
						className="bg-transparent outline-none w-full text-2xl"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					{searchText.length ? (
						<TbCircleX
							className="text-black-100 text-3xl cursor-pointer"
							onClick={() => setSearchText("")}
						/>
					) : (
						""
					)}
				</div>

				<div className="text-3xl font-semibold mb-12"> 인기 영상 </div>
				<div className="grid grid-cols-4 gap-6">
					{dummyCards.map((_, idx) => (
						<div
							key={idx}
							className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2 relative min-h-[180px]"
						>
							<div className="bg-gray-scale-100 rounded-lg h-[177px] w-full flex items-center justify-center relative">
								<button className="absolute top-2 right-2">
									<FiHeart
										className={`text-2xl ${
											idx === 1
												? "text-primary-green-500 fill-primary-green-500"
												: "text-gray-400"
										}`}
									/>
								</button>

								<span className="absolute bottom-1 right-3 text-black-100 text-xl font-medium">
									1:07:32
								</span>
							</div>

							<div className="text-xl font-medium line-clamp-2 mt-4 text-black-200">
								설치가이드 주제 설치가이드 주제 설치가이드 주제 설치가이드 주제
								설치가이드 주제
							</div>

							<div className="text-2lg text-gray-scale-500 mt-1 line-clamp-1">
								카테고리 · 크리에이터 닉네임 크리에이터...
							</div>

							<div className="flex flex-wrap gap-1 mt-2">
								<span className="bg-gray-scale-100 border border-gray-scale-200 text-black-100 text-2lg px-4 py-0.5 rounded-full">
									우분투
								</span>
								<span className="bg-gray-scale-100 border border-gray-scale-200 text-black-100 text-2lg px-4 py-0.5 rounded-full">
									리눅스
								</span>
								<span className="bg-gray-scale-100 border border-gray-scale-200 text-black-100 text-2lg px-4 py-0.5 rounded-full">
									RTX 3060
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Recommend;
