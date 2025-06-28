"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { postAiSearchRecommend } from "@/app/api/ai";
import { CourseRecommend } from "@/app/types/recommend";

function Chatbot({ changeDirectSearch }: { changeDirectSearch: () => void }) {
	const [messages, setMessages] = useState<
		{
			type: "user" | "bot";
			text: string;
		}[]
	>([
		{
			type: "bot",
			text: "어떤 것을 도와드릴까요?\n저는 세팅과 설치 방법에 대해 도움을 드릴 수 있어요.\n설치 환경 (OS 등), 소프트웨어 이름, 목적 등을 작성해주시면 도와드릴게요!",
		},
	]);

	useEffect(() => {}, []);

	const [recommendations, setRecommendations] = useState<CourseRecommend[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleAiReccomend = async (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Enter" && searchQuery.trim()) {
			//먼저 이전에 추천된 영상은 지워주고고
			setRecommendations([]);
			setMessages((prev) => [...prev, { type: "user", text: searchQuery }]);
			try {
				const res = await postAiSearchRecommend(searchQuery);
				setMessages((prev) => [
					...prev,
					{ type: "bot", text: res.data.message },
				]);
				setRecommendations(res.data.courses);
				setSearchQuery("");
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, recommendations]);

	return (
		<div className="min-h-[90vh] flex items-center justify-center bg-[#EFEFEF]">
			<div className="w-full h-[90dvh] rounded-2xl shadow-lg bg-[#EFEFEF] flex flex-col overflow-hidden border border-gray-scale-200">
				<div className="px-6 py-4 flex items-center border-b border-gray-scale-200">
					<div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center mr-3">
						<Image
							src="/insty.png"
							alt="INSTY"
							width={100}
							height={100}
							className="object-contain"
						/>
					</div>
					<div className="flex flex-col ml-8">
						<div className="font-bold text-3xl">INSTY</div>
						<div className="text-2xl font-semibold">
							어떤 도움이 필요하세요?
						</div>
					</div>
					<button
						className="ml-auto bg-primary-green-500 text-white rounded-2xl px-4 py-2"
						onClick={changeDirectSearch}
					>
						직접 찾기
					</button>
				</div>

				<div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 h-[100vh] min-h-0">
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex items-end ${msg.type === "user" ? "flex-row-reverse" : "justify-start flex-row"}`}
						>
							<div
								className={`w-[60px] h-[60px] flex items-center justify-center overflow-hidden ${msg.type === "user" ? "ml-3" : "mr-3 rounded-full bg-white"}`}
							>
								<Image
									src={msg.type === "user" ? "/profile.svg" : "/insty.png"}
									alt={msg.type === "user" ? "user" : "insty"}
									width={50}
									height={50}
									className="object-contain"
								/>
							</div>
							<div
								className={`text-primary-blue-500 rounded-2xl px-4 py-3 text-xl max-w-[600px] shadow-sm border border-gray-scale-200

								${
									msg.type === "user"
										? "bg-blue-100 rounded-tl-2xl rounded-tr-md"
										: "bg-white rounded-tr-2xl rounded-tl-md"
								}
							`}
							>
								{msg.text}
							</div>
						</div>
					))}

					{recommendations.length > 0 && (
						<div className="flex gap-3 mt-10">
							{recommendations.map((course) => (
								<Link
									key={course.course_id}
									href={`/learner/recommend/course/${course.course_id}`}
									className="flex flex-col w-[400px] h-auto bg-white rounded-xl shadow p-4 text-lg text-black-100 border border-gray-scale-100 flex-shrink-0 mb-2 cursor-pointer"
								>
									<div className="w-full h-[160px] bg-gray-scale-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
										<Image
											src={course.thumbnail_url || "/dog.png"}
											alt={course.course_title}
											width={100}
											height={100}
											className="object-cover w-full h-full"
										/>
									</div>
									<span className="line-clamp-1">{course.course_title}</span>
								</Link>
							))}
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				<div className="p-4 border-t border-[#e0e7ef] bg-[#f4f8fc] flex items-center gap-2">
					<Image src="/profile.svg" alt="profile" width={50} height={50} />
					<input
						type="text"
						placeholder="입력해주세요 ..."
						className="flex-1 rounded-xl px-4 py-2.5 text-[15px] bg-white outline-none shadow-sm border-none"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={handleAiReccomend}
					/>
				</div>
			</div>
		</div>
	);
}

export default Chatbot;
