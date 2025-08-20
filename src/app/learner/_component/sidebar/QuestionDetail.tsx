// 강의 수강 화면 사이드바 -

"use client";

import Image from "next/image";
import { useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";

import { AttachmentFileModal } from "@/app/_components/community/common";
import { AnswerCard } from "@/app/_components/community/common";
import { useUserStore } from "@/app/stores";
import { getFormattedDate } from "@/app/utils/";

interface QuestionDetailProps {
	questionId: number;
}

function QuestionDetail({ questionId }: QuestionDetailProps) {
	console.log(questionId);
	const userType = useUserStore((state) => state.user.userType);
	const userNickname = useUserStore((state) => state.user.nickname);

	const [answerContent, setAnswerContent] = useState("");

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isFocused, setIsFocused] = useState(false);

	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [attachmentType, setAttachmentType] = useState<"Image" | "Video">(
		"Image",
	);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [videoPreview, setVideoPreview] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		setAnswerContent(e.target.value);
	const handleSubmit = () => {
		console.log("답변 내용:", answerContent);
		setAnswerContent("");
	};
	const handleOpenImageModal = () => {
		setAttachmentType("Image");
		setAttachmentModalOpen(true);
	};
	const handleOpenVideoModal = () => {
		setAttachmentType("Video");
		setAttachmentModalOpen(true);
	};
	const handleRemoveImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedImage(null);
		setImagePreview(null);
	};
	const handleRemoveVideo = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedVideo(null);
		setVideoPreview(null);
	};

	return (
		<div>
			<section className="mb-10 p-8 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-sm">
				<div className="flex items-center gap-4 mb-6 text-xl text-gray-500">
					<span className="font-semibold">{dummyData.user.nickname}</span>
					<span>{getFormattedDate(dummyData.createdAt)}</span>
				</div>
				<h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
					{dummyData.title}
				</h1>
				<div className="text-gray-800 leading-relaxed">
					<p className="whitespace-pre-wrap text-xl">{dummyData.content}</p>
					{dummyData.attachments.map((att) => (
						<Image
							key={att.id}
							src={att.url}
							alt={att.name}
							width={500}
							height={300}
							unoptimized
							className="my-4"
						/>
					))}
				</div>
			</section>

			<section className="mb-10">
				<div className="flex items-center mb-4 justify-between">
					<h2 className="text-2xl font-bold text-gray-900">댓글</h2>
					<button className="px-4 py-2 bg-primary-green-300 rounded hover:bg-primary-green-400 text-white font-semibold">
						AI 응답 추천받기
					</button>
				</div>

				<div className="relative">
					<textarea
						className="w-full min-h-[200px] p-6 pr-20 border-2 rounded-3xl resize-none text-xl
              placeholder:text-gray-400 text-gray-900 leading-relaxed
              transition-all duration-300 ease-out
              border-primary-green-400 shadow-2xl shadow-primary-green-500/10 outline-none"
						placeholder="댓글을 남겨주세요."
						value={answerContent}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
					/>

					<button
						onClick={handleSubmit}
						disabled={!answerContent.trim()}
						className={`absolute bottom-6 right-6 p-3 rounded-full text-white z-10 transition-all duration-300 cursor-pointer
						${
							answerContent.trim()
								? "bg-primary-green-500 hover:bg-primary-green-600 shadow-md active:scale-95"
								: "bg-gray-300 text-gray-400 cursor-not-allowed"
						}`}
					>
						<LuSendHorizontal size={20} />
					</button>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => handleOpenImageModal()}
						className="relative flex flex-col items-center justify-center w-20 h-20
                       border-2 border-dashed border-gray-400 rounded-md
                       bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer
                       overflow-hidden"
					>
						{imagePreview ? (
							<>
								<Image
									src={imagePreview}
									alt="첨부한 이미지 미리보기"
									fill
									className="relative object-cover"
								/>
								<span
									onClick={handleRemoveImage}
									className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs"
								>
									×
								</span>
							</>
						) : (
							<>
								<IoImageOutline size={24} className="text-gray-600" />
								<span className="text-sm text-gray-500">(0/1)</span>
							</>
						)}
					</button>
					<button
						onClick={() => handleOpenVideoModal()}
						className="relative flex flex-col items-center justify-center w-20 h-20
                       border-2 border-dashed border-gray-400 rounded-md
                       bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
					>
						{videoPreview ? (
							<>
								<video
									src={videoPreview}
									className="w-20 h-20 object-cover rounded-md"
									muted
									autoPlay
									loop
								/>
								<span
									onClick={handleRemoveVideo}
									className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs"
								>
									×
								</span>
							</>
						) : (
							<>
								<HiOutlineVideoCamera size={24} className="text-gray-600" />
								<span className="text-sm text-gray-500">(0/1)</span>
							</>
						)}
					</button>
				</div>
				{attachmentModalOpen && (
					<AttachmentFileModal
						type={attachmentType}
						onClose={() => setAttachmentModalOpen(false)}
						onFileSelect={(file: File) => {
							if (attachmentType === "Image") {
								setSelectedImage(file);
								setImagePreview(URL.createObjectURL(file));
							} else {
								setSelectedVideo(file);
								setVideoPreview(URL.createObjectURL(file));
							}
						}}
					/>
				)}

				{/* 답변 리스트 - 페이지네이션 데이터 필요*/}
				<div className="flex flex-col gap-4 mt-10">
					{dummyData.answers.map((answer, idx) => (
						<AnswerCard
							key={idx}
							answer={answer}
							questionStatus={dummyData.status}
							userType={userType}
							userNickname={userNickname}
							questionUserNickname={dummyData.user.nickname}
						/>
					))}

					<button className="flex items-center justify-center rounded-2xl border-2 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
						답변 더보기 (1 / 10)
					</button>
				</div>
			</section>
		</div>
	);
}
export default QuestionDetail;

const dummyData = {
	user: {
		id: 1,
		nickname: "덥당",
		userType: "LEARNER",
	},
	courseId: 101,
	title: "React + TypeScript에서 상태 관리 전략 추천 부탁드립니다",
	content:
		"현재 React로 사이드 프로젝트를 진행 중인데, 컴포넌트가 많아지고 상태가 깊어지면서 useState만으로 관리하기가 너무 힘들어졌습니다. 이제는 props drilling이 장난 아니고, 상태 변경 로직이 여기저기 흩어져 있어요. Redux나 Zustand, Recoil 같은 라이브러리들이 있다고는 아는데, 각각 어떤 장단점이 있는지 잘 모르겠습니다. 제 상황에 맞는 추천과 경험담 부탁드립니다! 참고로, 저희 앱은 게시글 작성, 댓글, 좋아요 기능, 알림 기능 정도가 있습니다. 추가로, 이미지 업로드 기능도 있는데 업로드 시 상태 관리가 너무 복잡해서 어려움을 겪고 있습니다.",
	answers: [
		{
			user: {
				id: 2,
				nickname: "리덕스장인",
				userType: "CREATOR",
				url: "/dog.png",
			},
			content:
				"전역 상태 관리가 필요한 상황 같네요. 저라면 Redux Toolkit을 추천합니다. 미들웨어와 DevTools가 잘 갖춰져 있어서 디버깅이 편하고, RTK Query를 쓰면 서버 상태 관리도 깔끔하게 해결됩니다. 다만 러닝 커브가 약간 있을 수 있으니 초반에 팀원들과 컨벤션을 잘 잡으세요. 참고로 Zustand도 가볍고 사용법이 단순해서 좋아요. 다만 규모가 커질수록 액션 구조를 잘 설계해야 혼란이 줄어듭니다.",
			attachments: [
				{
					id: 1,
					name: "상태관리비교.pdf",
					contentType: "application/pdf",
					size: 204800,
					url: "/dog.png",
				},
			],
			videoInfo: {
				videoType: "COURSE",
				videoUuid: "abc123",
				originFileName: "redux-vs-zustand.mp4",
			},
			isAccepted: false,
			createdAt: "2025-08-01T10:00:00Z",
			updatedAt: "2025-08-01T12:00:00Z",
		},
		{
			user: {
				id: 3,
				nickname: "덥당",
				userType: "LEARNER",
				url: "/dog.png",
			},
			content:
				"저는 Recoil을 추천드려요! 특히 비동기 상태 관리가 간단하고, atom/selector 개념이 익숙해지면 굉장히 직관적으로 다룰 수 있습니다. React 18의 Concurrent Mode와도 잘 맞고요. 단, 프로젝트 규모가 커지면 atom이 많아질 수 있으니 구조화를 잘 해두셔야 합니다. npm install recoil 후 바로 적용 가능하니 가볍게 테스트해보셔도 좋습니다.",
			attachments: [
				{
					id: 2,
					name: "recoil-example.pdf",
					contentType: "application/pdf",
					size: 204800,
					url: "/dog.png",
				},
			],
			videoInfo: {
				videoType: "COURSE",
				videoUuid: "def456",
				originFileName: "recoil-demo.mp4",
			},
			isAccepted: false,
			createdAt: "2025-08-01T11:30:00Z",
			updatedAt: "2025-08-01T12:30:00Z",
		},
		{
			user: {
				id: 4,
				nickname: "프론트고인물",
				userType: "LEARNER",
				url: "/dog.png",
			},
			content:
				"저는 Zustand로 실서비스를 운영하고 있는데, 간단한 API 캐싱이나 모달 상태 관리 같은 건 정말 편합니다. 특히 Redux 대비 보일러플레이트 코드가 거의 없어요. 단점은 상태 변경 추적이 Redux DevTools만큼 강력하지 않아서, 디버깅은 조금 불편할 수 있습니다. 결론적으로, 규모가 크고 복잡하면 Redux, 중소형 프로젝트면 Zustand를 추천합니다.",
			attachments: [
				{
					id: 3,
					name: "zustand-pattern.jpeg",
					contentType: "image/jpeg",
					size: 204800,
					url: "/cat.jpeg",
				},
			],
			videoInfo: {
				videoType: "COURSE",
				videoUuid: "ghi789",
				originFileName: "zustand-tutorial.mp4",
			},
			isAccepted: false,
			createdAt: "2025-08-01T13:00:00Z",
			updatedAt: "2025-08-01T13:30:00Z",
		},
	],
	attachments: [
		{
			id: 1,
			name: "프로젝트구조.png",
			contentType: "image/png",
			size: 512000,
			url: "/dog.png",
		},
		{
			id: 2,
			name: "상태흐름다이어그램.jpg",
			contentType: "image/jpeg",
			size: 512000,
			url: "/dog2.jpeg",
		},
	],
	videoInfo: {
		videoType: "COURSE",
		videoUuid: "xyz456",
		originFileName: "state-management-overview.mp4",
	},
	createdAt: "2025-07-31T15:30:00Z",
	updatedAt: "2025-07-31T15:30:00Z",
	status: "NONE",
};
