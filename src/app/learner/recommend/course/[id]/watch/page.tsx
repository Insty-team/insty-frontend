"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { getSessionMessages, postChatSession } from "@/app/api/ai";
import {
	getCourseDetail,
	getPlaylistVideo,
	postPlayListVideo,
} from "@/app/api/backend";
import CourseQuestionChatBotModal from "@/app/learner/_component/CourseQuestionChatBotModal";
import HLSPlayer from "@/app/learner/_component/courses/HLSPlayer";
//import CommunitySidebar from "@/app/learner/_component/CommunitySidebar";
import { CourseDetail, CourserChatbotMessage } from "@/app/types/course";

function WatchCoursePage() {
	const [openChatbot, setOpenChatbot] = useState(false);
	const [data, setData] = useState<CourseDetail | null>(null);
	const [m3u8Url, setM3u8Url] = useState<string | null>(null);
	const { id } = useParams();
	const [sessionId, setSessionId] = useState<number | null>(null);

	const baseMessages: CourserChatbotMessage[] = [
		{
			sender: "bot",
			content:
				"안녕하세요! 저는 강의에서 궁금한 점에 대해 도움을 드리는 Insty AI 챗봇입니다. 어떤 점이 궁금하신가요?",
		},
	];
	const [messages, setMessages] = useState(baseMessages);

	// 챗봇 토글 함수를 useCallback으로 메모이제이션
	const toggleChatbot = useCallback(() => {
		setOpenChatbot((prev) => !prev);
	}, []);

	useEffect(() => {
		if (sessionId) {
			console.log("sessionId가 설정되었습니다:", sessionId);
		}
	}, [sessionId]);

	// 강의 데이터 가져오기 함수를 useCallback으로 메모이제이션
	const getCourseData = useCallback(async () => {
		try {
			const res = await getCourseDetail(Number(id));
			if (res && res.data) {
				setData(res.data);
				const response = await postPlayListVideo(
					res.data.videoInfo.videoType,
					res.data.courseId,
				);
				//console.log(response);
				const masterUrl = response.data.signedUrl;
				const playlistResponse = await getPlaylistVideo(masterUrl);
				console.log(typeof playlistResponse);

				const lines = playlistResponse.trim().split("\n");
				const variantM3u8 = lines.find(
					(line: string) => line.endsWith(".m3u8") && !line.startsWith("#"),
				);
				console.log(variantM3u8);

				const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
				const m3u8Url = baseUrl + variantM3u8;
				console.log(m3u8Url);
				setM3u8Url(m3u8Url);
			}
		} catch (error) {
			console.error(error);
		}
	}, [id]);

	const createSession = useCallback(async () => {
		try {
			const res = await postChatSession(Number(id));
			console.log("postChatSession 응답:", res);

			if (res && res.data) {
				setSessionId(res.data.session_id);
				console.log("설정된 sessionId:", res.data.session_id);

				if (!res.data.is_new) {
					console.log("기존 세션입니다. 메시지를 가져옵니다.");
					const getSessionMessagesRes = await getSessionMessages(
						res.data.session_id,
					);
					console.log("기존 메시지:", getSessionMessagesRes);

					setMessages((prev) => [
						...prev,
						...getSessionMessagesRes.data.messages.map(
							(message: CourserChatbotMessage) => ({
								sender: message.sender,
								content: message.content,
								attachments: message.attachments,
								created_at: message.created_at,
							}),
						),
					]);
				}
			}
		} catch (error) {
			console.error("createSession 에러:", error);
		}
	}, [id]);

	// id가 변경될 때만 강의 데이터 가져오기
	useEffect(() => {
		getCourseData();
		createSession();
	}, [getCourseData, createSession]);

	if (!data) return <div>데이터가 없습니다.</div>;

	return (
		<div className="flex flex-col gap-8 items-stretch relative">
			<div className="font-bold text-2xl mt-10">{data.title}</div>

			{/* <CommunitySidebar /> */}
			<button
				className="fixed bottom-8 right-8 z-50 flex items-center bg-primary-green-400 hover:bg-primary-green-500 text-white font-semibold px-6 py-2 rounded-full shadow-none"
				onClick={toggleChatbot}
			>
				<span className="text-base">AI 챗봇에게 질문하기</span>
				<IoChatbubbleEllipses className="w-7 h-7 ml-2" />
			</button>

			{openChatbot && sessionId && (
				<CourseQuestionChatBotModal
					open={openChatbot}
					messages={messages}
					setMessages={setMessages}
					sessionId={sessionId}
					courseId={Number(id)}
				/>
			)}

			<div className="flex gap-4 w-full">
				{m3u8Url ? (
					<HLSPlayer src={m3u8Url} width="600px" height="450px" />
				) : (
					<div className="w-[600px] h-auto bg-gray-200 rounded-2xl flex items-center justify-center">
						<span className="text-gray-400">영상 미리보기</span>
					</div>
				)}

				<div className="flex flex-col gap-2 flex-1 ml-2">
					<div className="flex gap-2 flex-wrap">
						{data.tags.map((tag) => (
							<span
								key={tag}
								className="px-3 py-1 bg-gray-scale-200 rounded-full text-2lg text-black-100"
							>
								{tag}
							</span>
						))}
					</div>
					<div className="flex flex-col gap-4 mt-4">
						<div className="flex gap-2 items-center aspect-auto">
							<Image src="/profile.svg" alt="user" width={48} height={48} />
							<span className="text-black-100 text-2xl">{"작성자"}</span>
						</div>
						<div className="flex gap-2 items-center">
							<Image src="/user.svg" alt="user" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{data.targetAudience}
							</span>
						</div>

						<div className="flex gap-2 items-center">
							<Image src="/file.svg" alt="file" width={36} height={36} />
							<span className="text-black-300 text-2xl">실습 자료 포함</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-8 mt-8">
				<div className="flex-1">
					<div className="font-semibold text-3xl">
						이 영상이 다루는 핵심 내용
					</div>
					<ul className="list-disc pl-5 space-y-4 mt-8 text-2xl">
						{data.keyPoints.map((content, idx) => (
							<li key={idx}>{content}</li>
						))}
					</ul>
				</div>
				<div className="flex-1">
					<div className="font-semibold text-3xl">설치 환경 체크리스트</div>
					<ul className="space-y-1 mt-8 text-2xl">
						{data.installEnvChecklist.map((env, idx) => (
							<li key={idx} className="flex items-center gap-2">
								{env.isSupported ? (
									<Image
										src="/ableEnvironment.svg"
										alt="ableEnvironment"
										width={48}
										height={48}
									/>
								) : (
									<Image
										src="/disableEnvironment.svg"
										alt="disableEnvironment"
										width={48}
										height={48}
									/>
								)}
								<span className="ml-4">{env.content}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default WatchCoursePage;
