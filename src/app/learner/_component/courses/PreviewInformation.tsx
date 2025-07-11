"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFile } from "react-icons/fi";
import { IoChatbubbleEllipses } from "react-icons/io5";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { getPurchaseAssistantUsageCount } from "@/app/api/ai";
import { getCourseVideoPreview, postPreviewVideo } from "@/app/api/backend";
import PurchaseAssistantChatbotModal from "@/app/learner/_component/PurChaseAssistantChatbotModal";
//import CommunitySidebar from "@/app/learner/_component/CommunitySidebar";
import { CourseDetail } from "@/app/types/course";
import { formatTime } from "@/app/utils/date";

import HLSPlayer from "./HLSPlayer";

interface PreviewInformationProps {
	data: CourseDetail;
}

function PreviewInformation({ data }: PreviewInformationProps) {
	const router = useRouter();
	const [openPurchaseAssistantChatbot, setOpenPurchaseAssistantChatbot] =
		useState(false);

	const [m3u8Url, setM3u8Url] = useState<string | null>(null);
	const [videoDuration, setVideoDuration] = useState<number>(0);

	console.log(data);

	const baseMessages = [
		{
			type: "assistant",
			text: "안녕하세요! 저는 수강 결정을 도움드리는 Insty AI 챗봇입니다. 어떤 점을 고민하고 계신가요?",
		},
	];
	const [messages, setMessages] = useState(baseMessages);
	const [remainCount, setRemainCount] = useState(0);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (!isInitialized) {
			const getUsageCount = async () => {
				const res = await getPurchaseAssistantUsageCount(data.courseId);
				setRemainCount(Number(res.data.remaining));
				setIsInitialized(true);
			};
			getUsageCount();
		}
	}, [data.courseId, isInitialized]);

	// 모달에서 사용 횟수 업데이트를 위한 콜백
	const handleUsageCountUpdate = (newCount: number) => {
		setRemainCount(newCount);
	};

	useEffect(() => {
		const getSignedUrl = async () => {
			const res = await postPreviewVideo(
				data.videoInfo.videoType,
				data.courseId,
			);
			if (res && res.data) {
				console.log(res.data.signedUrl, "이거에요");
				try {
					const previewResponse = await getCourseVideoPreview(
						res.data.signedUrl,
					);
					console.log(typeof previewResponse);
					console.log(previewResponse);

					const masterUrl = res.data.signedUrl;
					const lines = previewResponse.trim().split("\n");
					const variantM3u8 = lines.find(
						(line: string) => line.endsWith(".m3u8") && !line.startsWith("#"),
					);
					console.log(variantM3u8);

					const baseUrl = masterUrl.substring(
						0,
						masterUrl.lastIndexOf("/") + 1,
					);
					const m3u8Url = baseUrl + variantM3u8;
					console.log(m3u8Url);
					setM3u8Url(m3u8Url);
				} catch (error) {
					console.log(error);
				}
			}
		};

		getSignedUrl();
	}, [data.courseId, data.videoInfo.videoType]);

	const handleWatchCourse = () => {
		Swal.fire({
			title: "강의를 수강하시겠습니까?",
			html: "수강하기 버튼을 누르면 강의를 수강할 수 있습니다.",
			icon: "question",
			showCancelButton: true,
			cancelButtonText: "닫기",
			confirmButtonText: "수강하기",
			confirmButtonColor: "#6ead79",
		}).then((result) => {
			if (result.isConfirmed) {
				router.push(`/learner/recommend/course/${data.courseId}/watch`);
			}
		});
	};

	if (!data)
		return (
			<div className="flex flex-row w-full justify-center items-center h-screen">
				데이터 불러오는 중...
				<Loading width={60} height={60} />
			</div>
		);

	return (
		<div className="flex flex-col gap-8 items-stretch relative">
			<div className="font-bold text-2xl mt-10">{data.title}</div>

			{/* <CommunitySidebar /> */}
			<button
				className="fixed bottom-8 right-8 z-50 flex items-center bg-primary-green-400 hover:bg-primary-green-500 text-white font-semibold px-6 py-2 rounded-full shadow-none"
				onClick={() =>
					setOpenPurchaseAssistantChatbot(!openPurchaseAssistantChatbot)
				}
			>
				<span>수강 결정 도움받기</span>
				<IoChatbubbleEllipses className="w-7 h-7 ml-2" />
			</button>

			{openPurchaseAssistantChatbot && (
				<PurchaseAssistantChatbotModal
					open={openPurchaseAssistantChatbot}
					messages={messages}
					setMessages={setMessages}
					courseId={data.courseId}
					remainCount={remainCount}
					onUsageCountUpdate={handleUsageCountUpdate}
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
						<span className="text-gray-400">영상을 재생할 수 없습니다.</span>
					</div>
				)}

				<div className="flex flex-col gap-2 flex-1 justify-between ml-2">
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
					<div className="flex flex-col gap-4">
						<div className="flex gap-2 items-center aspect-auto">
							<Image src="/profile.svg" alt="user" width={48} height={48} />
							<span className="text-black-100 text-2xl">
								{data.creatorInfo?.nickname}
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
							<span className="text-black-300 text-2xl">
								{data.practiceFile &&
									data.practiceFile.length > 0 &&
									data.practiceFile.map((file) => {
										return (
											<div key={file.id}>
												<a
													href={file.url}
													target="_blank"
													rel="noopener noreferrer"
												>
													<FiFile />
													{file.name}
												</a>
											</div>
										);
									})}
							</span>
						</div>
						<div className="flex gap-2 items-center">
							<Image src="/time.svg" alt="clock" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{videoDuration > 0 ? formatTime(videoDuration) : "로딩 중..."}
							</span>
						</div>
					</div>

					<div className="flex justify-between gap-8">
						<div className="w-[60%] flex items-center mr-auto">
							<BaseButton title="수강하기" onClick={handleWatchCourse} />
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

export default PreviewInformation;
