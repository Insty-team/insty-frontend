"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Markdown } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { postAISearchRecommend } from "@/app/api/ai";
import {
	useGetAISearchRecommendQuery,
	useGetUserProfileInfoQuery,
} from "@/app/queries";
import { CourseRecommend, RecommendMessage } from "@/app/types/recommend";

function Chatbot({ changeDirectSearch }: { changeDirectSearch: () => void }) {
	const { data: userInfo } = useGetUserProfileInfoQuery();
	const [messages, setMessages] = useState<
		{
			type: "user" | "assistant";
			text: string;
			created_at: string;
		}[]
	>([]);

	const {
		data: aiSearchRecommend,
		isLoading,
		error,
	} = useGetAISearchRecommendQuery();

	useEffect(() => {
		if (isLoading) return;

		if (error) {
			setMessages([
				{
					type: "assistant",
					text: "페이지 로딩에 문제가 있습니다. 다시 로그인해주세요.",
					created_at: new Date().toISOString(),
				},
			]);
			return;
		}

		if (
			aiSearchRecommend &&
			aiSearchRecommend.data &&
			aiSearchRecommend.data.messages.length > 0
		) {
			const messages = aiSearchRecommend.data.messages.map(
				(message: RecommendMessage) => ({
					type: message.sender,
					text: message.content,
					created_at: message.created_at,
				}),
			);

			const defaultMessage = {
				type: "assistant" as const,
				text: "어떤 것을 도와드릴까요?\n저는 세팅과 설치 방법에 대해 도움을 드릴 수 있어요.\n설치 환경 (OS 등), 소프트웨어 이름, 목적 등을 작성해주시면 도와드릴게요!",
				created_at: messages[0].created_at,
			};

			setMessages([defaultMessage, ...messages]);

			const lastMessage =
				aiSearchRecommend.data.messages[
					aiSearchRecommend.data.messages.length - 1
				];
			if (
				lastMessage &&
				lastMessage.courses &&
				lastMessage.courses.length > 0
			) {
				setRecommendations(lastMessage.courses);
			}
		} else {
			setMessages([
				{
					type: "assistant",
					text: "어떤 것을 도와드릴까요?\n저는 세팅과 설치 방법에 대해 도움을 드릴 수 있어요.\n설치 환경 (OS 등), 소프트웨어 이름, 목적 등을 작성해주시면 도와드릴게요!",
					created_at: new Date().toISOString(),
				},
			]);
		}
	}, [aiSearchRecommend, isLoading, error]); // 의존성 배열 변경

	const [recommendations, setRecommendations] = useState<CourseRecommend[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isRecommendLoading, setIsRecommendLoading] = useState<boolean>(false);
	const [isComposing, setIsComposing] = useState<boolean>(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 날짜 구분선을 포함한 메시지 렌더링 함수
	const renderMessagesWithDateDividers = () => {
		const result = [];

		for (let i = 0; i < messages.length; i++) {
			const currentMessage = messages[i];
			const currentDate = new Date(
				currentMessage.created_at,
			).toLocaleDateString("ko-KR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});

			// 첫 번째 메시지이거나 이전 메시지와 날짜가 다른 경우 구분선 추가
			if (i === 0) {
				result.push(
					<div key={`date-${i}`} className="flex justify-center my-4">
						<div className="bg-primary-green-500 text-white px-3 py-1 rounded-full text-sm">
							{currentDate}
						</div>
					</div>,
				);
			} else {
				const previousMessage = messages[i - 1];
				const previousDate = new Date(
					previousMessage.created_at,
				).toLocaleDateString("ko-KR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				});

				if (currentDate !== previousDate) {
					result.push(
						<div key={`date-${i}`} className="flex justify-center my-4">
							<div className="bg-primary-green-500 text-white px-3 py-1 rounded-full text-sm">
								{currentDate}
							</div>
						</div>,
					);
				}
			}

			result.push(
				<div
					key={i}
					className={`flex items-end ${currentMessage.type === "user" ? "flex-row-reverse" : "justify-start flex-row"}`}
				>
					<div
						className={`w-[50px] h-[50px] flex items-center justify-center overflow-hidden rounded-full ${currentMessage.type === "user" ? "ml-3" : "mr-3 bg-white"}`}
					>
						<Image
							src={
								currentMessage.type === "user"
									? userInfo?.thumbnailUrl
										? userInfo?.thumbnailUrl
										: "/profile.svg"
									: "/insty.png"
							}
							alt={currentMessage.type === "user" ? "user" : "insty"}
							width={50}
							height={50}
							className="object-cover w-full h-full rounded-full"
						/>
					</div>
					<div
						className={`text-primary-blue-500 rounded-2xl px-4 py-3 text-xl max-w-[600px] shadow-sm border border-gray-scale-200

						${
							currentMessage.type === "user"
								? "bg-blue-100 rounded-tl-2xl rounded-tr-md"
								: "bg-white rounded-tr-2xl rounded-tl-md"
						}
					`}
					>
						<Markdown text={currentMessage.text} />
					</div>
				</div>,
			);
		}

		return result;
	};

	const handleAiReccomend = async (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Enter" && searchQuery.trim() && !isComposing) {
			setIsRecommendLoading(true);
			setSearchQuery("");

			//먼저 이전에 추천된 영상은 지워주고
			setRecommendations([]);
			setMessages((prev) => [
				...prev,
				{
					type: "user",
					text: searchQuery,
					created_at: new Date().toISOString(),
				},
			]);
			try {
				const res = await postAISearchRecommend(searchQuery);
				//console.log(res);
				if (res && res.data) {
					setMessages((prev) => [
						...prev,
						{
							type: "assistant",
							text: res.data?.message,
							created_at: new Date().toISOString(),
						},
					]);
					if (res.data?.courses) {
						setRecommendations(res.data.courses);
					}
				} else {
					setMessages((prev) => [
						...prev,
						{
							type: "assistant",
							text: res.error?.message,
							created_at: new Date().toISOString(),
						},
					]);
				}

				setIsRecommendLoading(false);
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			//채팅 내역 안에서만 스크롤 되도록 옵션 변경~
			block: "nearest",
			inline: "nearest",
		});
	}, [messages, recommendations]);

	return (
		<div className="min-h-[90vh] flex items-center justify-center bg-[#EFEFEF] rounded-2xl">
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
						className="ml-auto bg-primary-green-500 text-white rounded-2xl px-4 py-2 disabled:bg-gray-scale-300 cursor-not-allowed"
						onClick={changeDirectSearch}
						disabled
					>
						직접 찾기
					</button>
				</div>

				<div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 h-[100vh] min-h-0">
					{isLoading ? (
						<div className="flex flex-row items-center justify-center">
							<p className="text-primary-blue-500">
								기존 채팅을 불러오는 중입니다.
							</p>
							<Loading width={30} height={30} />
						</div>
					) : (
						renderMessagesWithDateDividers()
					)}

					{isRecommendLoading && (
						<div className="flex items-end justify-start flex-row">
							<div className="w-[60px] h-[60px] flex items-center justify-center overflow-hidden mr-3 rounded-full bg-white">
								<Image
									src="/insty.png"
									alt="insty"
									width={50}
									height={50}
									className="object-contain"
								/>
							</div>
							<div className="flex flex-row text-primary-blue-500 rounded-2xl px-4 py-3 text-xl max-w-[600px] shadow-sm border border-gray-scale-200 bg-white rounded-tr-2xl rounded-tl-md">
								<p>추천 영상을 찾는 중입니다...</p>
								<Loading width={30} height={30} className="ml-2" />
							</div>
						</div>
					)}

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
						placeholder="입력 후 엔터를 눌러 주세요."
						className="flex-1 rounded-xl px-4 py-2.5 text-[15px] bg-white outline-none shadow-sm border-none"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={handleAiReccomend}
						onCompositionStart={() => setIsComposing(true)}
						onCompositionEnd={() => setIsComposing(false)}
						disabled={isRecommendLoading}
					/>
				</div>
			</div>
		</div>
	);
}

export default Chatbot;
