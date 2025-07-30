"use client";

import * as Amplitude from "@amplitude/analytics-browser";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiFile } from "react-icons/fi";
import { IoChatbubbleEllipses } from "react-icons/io5";

import Loading from "@/app/_components/common/Loading";
import { getSessionMessages, postChatSession } from "@/app/api/ai";
import { getPlaylistVideo, postPlayListVideo } from "@/app/api/backend";
import CourseQuestionChatBotModal from "@/app/learner/_component/CourseQuestionChatBotModal";
import HLSPlayer from "@/app/learner/_component/courses/HLSPlayer";
import { useGetCourseDetailQuery } from "@/app/queries";
//import CommunitySidebar from "@/app/learner/_component/CommunitySidebar";
import { CourserChatbotMessage } from "@/app/types/course";
import { formatTime } from "@/app/utils/date";

function WatchCoursePage() {
	const [openChatbot, setOpenChatbot] = useState(false);
	const [m3u8Url, setM3u8Url] = useState<string | null>(null);
	const { id } = useParams();
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [videoDuration, setVideoDuration] = useState<number>(0);

	// React Query로 강의 데이터 가져오기
	const {
		data: courseData,
		isLoading: isCourseLoading,
		error: courseError,
	} = useGetCourseDetailQuery(Number(id));

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
		// Amplitude 추적
		Amplitude.track("Course Chatbot Toggle Clicked");
		setOpenChatbot((prev) => !prev);
	}, []);

	// 영상 처리만 담당하는 useEffect
	useEffect(() => {
		const processVideo = async () => {
			if (!courseData?.data) return;

			try {
				const response = await postPlayListVideo(
					courseData.data.videoInfo.videoType,
					courseData.data.courseId,
				);

				const masterUrl = response.data.signedUrl;
				const playlistResponse = await getPlaylistVideo(masterUrl);

				const lines = playlistResponse.trim().split("\n");
				const variantM3u8 = lines.find(
					(line: string) => line.endsWith(".m3u8") && !line.startsWith("#"),
				);

				const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
				const m3u8Url = baseUrl + variantM3u8;
				setM3u8Url(m3u8Url);
			} catch (error) {
				console.error("영상 처리 중 오류:", error);
			}
		};

		processVideo();
	}, [courseData?.data]);

	const createSession = useCallback(async () => {
		try {
			const res = await postChatSession(Number(id));

			if (res && res.data) {
				setSessionId(res.data.session_id);

				if (!res.data.is_new) {
					const getSessionMessagesRes = await getSessionMessages(
						res.data.session_id,
					);

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

	// 채팅 세션 생성
	useEffect(() => {
		createSession();
	}, [createSession]);

	// 로딩 상태 처리
	if (isCourseLoading) {
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen gap-2">
				<p className="text-primary-green-500">데이터 불러오는 중...</p>
				<Loading width={30} height={30} />
			</div>
		);
	}

	// 에러 또는 데이터 없음 처리
	if (courseError || !courseData?.data) {
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen">
				<p className="text-red-500">강의 데이터를 불러올 수 없습니다.</p>
			</div>
		);
	}

	const data = courseData.data;

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
					<HLSPlayer
						src={m3u8Url}
						width="600px"
						onDurationChange={setVideoDuration}
					/>
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
							<span className="text-black-100 text-2xl">
								{data.creatorInfo?.nickname ?? "작성자 정보 없음"}
							</span>
						</div>
						<div className="flex gap-2 items-center">
							<Image src="/user.svg" alt="user" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{data.targetAudience}
							</span>
						</div>

						<div className="flex gap-2 items-center">
							<Image src="/file.svg" alt="file" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{data.practiceFile && data.practiceFile.length > 0
									? "실습 자료 포함"
									: "실습 자료 미포함"}
							</span>
						</div>
						<div className="text-black-300 text-2xl">
							{data.practiceFile &&
								data.practiceFile.length > 0 &&
								data.practiceFile.map((file) => {
									return (
										<div key={file.id}>
											<a
												href={file.url}
												target="_blank"
												rel="noopener noreferrer"
												download={`${data.title} 실습 자료`}
												className="flex flex-row items-center gap-2 ml-3 text-lg"
											>
												<FiFile />
												{file.name}
											</a>
										</div>
									);
								})}
						</div>
						<div className="flex gap-2 items-center">
							<Image src="/time.svg" alt="clock" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{videoDuration > 0 ? formatTime(videoDuration) : "로딩 중..."}
							</span>
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
