"use client";

import Image from "next/image";
import { useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";

import { useUserStore } from "@/app/stores";
import { getFormattedDate } from "@/app/utils/";

import { AttachmentFileModal } from "./common";
import AnswerCard from "./common/AnswerCard";

interface QuestionDetailProps {
	data: QuestionDetail;
}

interface QuestionDetail {
	user: {
		id: number;
		nickname: string;
		userType: "LEARNER" | "CREATOR" | string;
	};
	courseId: number;
	title: string;
	content: string;
	answers: Answer[];
	attachments: Attachment[];
	videoInfo: VideoInfo;
	createdAt: string;
	updatedAt: string;
	status: string; // 질문 상태
}

interface Answer {
	user: {
		id: number;
		nickname: string;
		userType: "LEARNER" | "CREATOR" | string;
		url: string;
	};
	content: string;
	attachments: Attachment[];
	videoInfo?: VideoInfo;
	isAccepted: boolean;
	createdAt: string;
	updatedAt: string;
}

interface Attachment {
	id: number;
	name: string;
	contentType: string;
	size: number;
	url: string;
}

export interface VideoInfo {
	videoType: "COURSE" | "REVIEW" | string;
	videoUuid: string;
	originFileName: string;
}

export default function QuestionDetail({ data }: QuestionDetailProps) {
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

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAnswerContent(e.target.value);
	};

	const handleSubmit = () => {
		// TODO: 서버 전송 로직 추가
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
		<div className="mx-auto px-6 py-8">
			<section className="flex items-center gap-4 p-4 mb-8 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
				<div className="relative w-[120px] h-[80px] rounded-xl overflow-hidden shadow-md">
					<Image src="/cat.jpeg" fill alt="profile" className="object-cover" />
				</div>
				<span className="font-semibold text-gray-900 text-xl">
					강의 타이틀입니다.
				</span>
			</section>

			{/* 질문 섹션 */}
			<section className="mb-10 p-8 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-sm">
				<div className="flex items-center gap-4 mb-6 text-xl text-gray-500">
					<span className="font-semibold">{data.user.nickname}</span>
					<span>{getFormattedDate(data.createdAt)}</span>
				</div>

				<h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
					{data.title}
				</h1>
				<div className="text-gray-800 leading-relaxed">
					<p className="whitespace-pre-wrap text-xl">{data.content}</p>

					{data.attachments.length > 0 &&
						data.attachments.map((attachment) => (
							<Image
								key={attachment.id}
								src={attachment.url}
								alt={attachment.name}
								width={500}
								height={300}
								unoptimized
								className="my-4"
							/>
						))}

					{/* TODO: 영상 첨부파일 영역 추가 */}
				</div>
			</section>

			{/* 댓글 섹션 */}
			<section className="mb-10">
				<div className="flex items-center mb-4 justify-between">
					<h2 className="text-2xl font-bold text-gray-900">댓글</h2>
					<button
						className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-green-300 border shadow-primary-green-500/10
              hover:bg-primary-green-400
              font-semibold shadow-lg text-white
              transform hover:scale-[1.03] transition-all duration-300 cursor-pointer"
					>
						<span>AI 응답 추천받기</span>
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
					{data.answers.map((answer, idx) => (
						<AnswerCard
							key={idx}
							answer={answer}
							questionStatus={data.status}
							userType={userType}
							userNickname={userNickname}
							questionUserNickname={data.user.nickname}
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
