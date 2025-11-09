"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import rehypeSanitize from "rehype-sanitize";
import Swal from "sweetalert2";

import { Markdown } from "@/app/_components/common";
import { postDraftAnswer } from "@/app/api/ai/";
import {
	getPlaylistVideo,
	postAnswer,
	postAnswerAccept,
	postAnswerVideo,
	postPlayListVideo,
	putAnswerVideoUpload,
} from "@/app/api/backend/";
import HLSPlayer from "@/app/learner/_component/courses/HLSPlayer";
import { queryClient } from "@/app/queries";
import {
	useGetAcceptedAnswer,
	useGetAnswer,
	useGetQuestionDetail,
} from "@/app/queries/community";
import { useUserStore } from "@/app/stores";
import { mdEditorCommands } from "@/app/utils";
import { getFormattedDate } from "@/app/utils/";

import { AttachmentFileModal } from "./common";
import AnswerCard from "./common/AnswerCard";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Attatchment {
	id: number;
	name: string;
	contentType: string;
	size: number;
	url: string;
}

interface QuestionDetailProps {
	questionId: number;
}

export default function QuestionDetail({
	questionId: questionId,
}: QuestionDetailProps) {
	const userType = useUserStore((state) => state.user.userType);
	const userNickname = useUserStore((state) => state.user.nickname);

	const [answerContent, setAnswerContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [attachmentType, setAttachmentType] = useState<"Image" | "Video">(
		"Image",
	);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [videoPreview, setVideoPreview] = useState<string | null>(null);

	const [aiDraft, setAiDraft] = useState<string | null>(null);
	const [m3u8Url, setM3u8Url] = useState<string | null>(null);

	const {
		data: questionData,
		isLoading,
		error,
	} = useGetQuestionDetail(questionId);
	const { data: answersData, isLoading: isAnswersLoading } =
		useGetAnswer(questionId);
	const { data: acceptedAnswer } = useGetAcceptedAnswer(questionId);

	// HLS 영상 불러오기
	useEffect(() => {
		const fetchVideo = async () => {
			if (!questionData?.videoInfo) return;
			try {
				const res = await postPlayListVideo(
					questionData.videoInfo.videoType,
					questionId,
				);
				const masterUrl = res.data.signedUrl;

				const playlistResponse = await getPlaylistVideo(masterUrl);
				const lines = playlistResponse.trim().split("\n");
				const variantM3u8 = lines.find(
					(line: string) => line.endsWith(".m3u8") && !line.startsWith("#"),
				);
				const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
				if (variantM3u8) setM3u8Url(baseUrl + variantM3u8);
			} catch (err) {
				console.error("HLS URL 생성 실패", err);
			}
		};
		fetchVideo();
	}, [questionData, questionId]);

	if (isLoading) return <p>Loading...</p>;
	if (error || !questionData) return <p>데이터를 불러오는데 실패했습니다.</p>;
	if (isAnswersLoading) return <p>답변을 불러오는 중...</p>;

	const answerItems = answersData?.items;
	const answerPage = answersData?.pagination;

	// 댓글 제출
	const handleSubmit = async () => {
		if (!answerContent.trim() || isSubmitting) return;

		try {
			let uploadedVideoUuid = null;

			if (selectedVideo) {
				const videoInfo = {
					fileName: selectedVideo.name,
					contentType: selectedVideo.type,
				};
				const res = await postAnswerVideo(videoInfo);
				if (!res?.data?.uploadUrl || !res?.data?.uuid)
					throw new Error("서버에서 signedUrl 또는 uuid를 받지 못했습니다.");
				await putAnswerVideoUpload(res.data.uploadUrl, selectedVideo);
				uploadedVideoUuid = res.data.uuid;
			}

			const result = await Swal.fire({
				title: "댓글을 등록하시겠습니까?",
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "등록",
				cancelButtonText: "취소",
				confirmButtonColor: "#6ead79",
				cancelButtonColor: "#ff4f64",
				customClass: {
					popup: "z-[9999]",
				},
			});

			if (!result.isConfirmed) return;

			setIsSubmitting(true);
			try {
				const payload = {
					content: answerContent,
					videoUuid: uploadedVideoUuid,
				};
				const attachments = selectedImage ? [selectedImage] : [];
				await postAnswer(payload, String(questionId), attachments);

				queryClient.invalidateQueries({ queryKey: ["answers", questionId] });

				setAnswerContent("");
				setSelectedImage(null);
				setSelectedVideo(null);
				setImagePreview(null);
				setVideoPreview(null);
			} finally {
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("❌ 질문 등록 과정 중 오류:", error);
			Swal.fire({
				icon: "error",
				title: "질문 등록 중 오류가 발생했습니다.",
				confirmButtonText: "확인",
			});
		}
	};

	// AI 추천 답변 받기
	const handleAiDraft = async () => {
		if (!questionId) return;
		try {
			const imageFiles = selectedImage ? [selectedImage] : [];
			const payload = {
				courseId: questionData.courseId,
				query: answerContent,
				hasAttachment: imageFiles.length > 0,
				files: imageFiles,
			};
			const draftRes = await postDraftAnswer(payload);
			if (draftRes?.data?.answer_content)
				setAiDraft(draftRes.data.answer_content);
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "AI 응답 실패",
				text: "다시 시도해주세요.",
			});
		}
	};

	const handleApplyAiDraft = () => {
		if (aiDraft) {
			setAnswerContent(aiDraft);
			setAiDraft(null);
		}
	};

	// 첨부파일 모달
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

	// 채택 취소
	const handleCancelAcceptedAnswer = (questionId: number, answerId: number) => {
		Swal.fire({
			title: "정말 채택을 취소하시겠습니까?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "확인",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then(async (result) => {
			if (!result.isConfirmed) return;
			try {
				const res = await postAnswerAccept(questionId, answerId);
				if (res.success) {
					Swal.fire({
						title: "채택이 취소되었습니다.",
						icon: "success",
						confirmButtonText: "확인",
					}).then(() => {
						queryClient.invalidateQueries({
							queryKey: ["answers", questionId],
						});
						queryClient.invalidateQueries({
							queryKey: ["questionDetail", questionId],
						});
						queryClient.invalidateQueries({
							queryKey: ["acceptedAnswer", questionId],
						});
					});
				} else {
					Swal.fire({
						title: "채택 취소에 실패했습니다.",
						text: `${res.error.message}`,
						icon: "error",
						confirmButtonText: "확인",
					});
				}
			} catch (err) {
				console.error(err);
				Swal.fire({
					title: "채택 취소 중 오류가 발생했습니다.",
					text: "다시 시도해주세요.",
					icon: "error",
					confirmButtonText: "확인",
				});
			}
		});
	};

	return (
		<div className="mx-auto px-6 py-8">
			{/* 질문 섹션 */}
			<section className="mb-10 p-8 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-sm">
				<div className="flex items-center gap-4 mb-6 text-xl text-gray-500">
					<span className="font-semibold">{questionData.user.nickname}</span>
					<span>{getFormattedDate(questionData?.createdAt)}</span>
				</div>
				<h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
					{questionData.title}
				</h1>
				<div className="text-gray-800 leading-relaxed">
					<Markdown text={questionData.content} />
					{questionData.attachments.length > 0 &&
						questionData.attachments.map((att) => (
							<div key={att.id} className="relative my-4">
								<Image
									src={att.url}
									alt={att.name}
									width={600}
									height={500}
									style={{ objectFit: "contain" }}
									unoptimized
								/>
							</div>
						))}
					{m3u8Url && <HLSPlayer src={m3u8Url} width="600px" />}
				</div>
			</section>

			{/* 댓글 섹션 */}
			<section className="mb-10">
				<div className="flex items-center mb-4 justify-between">
					<h2 className="text-2xl font-bold text-gray-900">댓글</h2>
					<button
						onClick={handleAiDraft}
						className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-green-300 border shadow-primary-green-500/10 hover:bg-primary-green-400 font-semibold shadow-lg text-white transform hover:scale-[1.03] transition-all duration-300 cursor-pointer"
					>
						AI 응답 추천받기
					</button>
				</div>

				{aiDraft && (
					<div className="mb-4 p-4 rounded-2xl border border-primary-green-300 bg-primary-green-50 shadow-sm">
						<h3 className="font-semibold text-gray-800 mb-2">AI 추천 답변</h3>
						<Markdown text={aiDraft} />
						<div className="flex justify-end mt-3 gap-2">
							<button
								onClick={() => setAiDraft(null)}
								className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
							>
								취소
							</button>
							<button
								onClick={handleApplyAiDraft}
								className="px-4 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors"
							>
								적용하기
							</button>
						</div>
					</div>
				)}

				<div className="relative mb-4">
					<MDEditor
						value={answerContent}
						onChange={(val) => setAnswerContent(val || "")}
						height={200}
						commands={mdEditorCommands}
						previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
						textareaProps={{ placeholder: "댓글을 남겨주세요." }}
					/>
					<button
						onClick={handleSubmit}
						disabled={!answerContent.trim()}
						className={`absolute bottom-2 right-2 p-3 rounded-full text-white z-10 transition-all duration-300 cursor-pointer ${answerContent.trim() ? "bg-primary-green-500 hover:bg-primary-green-600 shadow-md active:scale-95" : "bg-gray-300 text-gray-400 cursor-not-allowed"}`}
					>
						<LuSendHorizontal size={20} />
					</button>
				</div>

				{/* 첨부 이미지/비디오 */}
				<div className="flex items-center gap-2 mt-2">
					<button
						onClick={handleOpenImageModal}
						className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer overflow-hidden"
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
						onClick={handleOpenVideoModal}
						className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
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

				{/* 답변 리스트 */}
				<div className="flex flex-col gap-4 mt-10">
					{acceptedAnswer && (
						<div className="flex gap-4 py-5 border-2 bg-gradient-to-r from-green-50/80 to-green-50/60 rounded-2xl px-6 transition-all duration-300">
							<div className="flex flex-col flex-1">
								<div className="flex justify-between items-start">
									<div className="flex items-center gap-2">
										<h1 className="text-xl font-semibold text-green-800">
											{acceptedAnswer.user?.nickname}
										</h1>
										<button
											onClick={() =>
												handleCancelAcceptedAnswer(
													questionId,
													acceptedAnswer.answerId,
												)
											}
											className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-full hover:bg-red-200 transition"
										>
											채택 취소
										</button>
										<span className="ml-auto px-4 py-1.5 text-sm bg-green-500 text-white rounded-full font-bold shadow-md">
											✨ 채택된 답변
										</span>
									</div>
									<span className="text-gray-400 text-lg">
										{getFormattedDate(acceptedAnswer.createdAt)}
									</span>
								</div>
								<div className="flex flex-col gap-4 mt-3 text-gray-800 leading-relaxed whitespace-pre-wrap">
									{acceptedAnswer.content}
									{acceptedAnswer.attachments?.length > 0 &&
										acceptedAnswer.attachments.map((att: Attatchment) => (
											<Image
												key={att.id}
												src={att.url}
												alt={att.name}
												width={500}
												height={300}
												unoptimized
												className="my-4 rounded-md"
											/>
										))}
								</div>
								<div className="mt-4 p-3 bg-green-100/60 rounded-xl border">
									<div className="flex items-center gap-2 text-lg text-green-700">
										<span className="text-base">💚</span>
										<span className="font-medium">
											이 댓글이 질문자에게 가장 도움이 되었습니다.
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{answerItems &&
						answerItems.map((answer, idx) => (
							<AnswerCard
								key={idx}
								answer={answer}
								questionStatus={questionData.status}
								userType={userType}
								userNickname={userNickname}
								questionUserNickname={questionData.user.nickname}
								questionId={questionId}
							/>
						))}

					{answerItems && answerPage!.totalPages > answerItems.length && (
						<button className="flex items-center justify-center rounded-2xl border-2 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
							답변 더보기 ({answerPage?.currentPage} / {answerPage!.totalPages})
						</button>
					)}
				</div>
			</section>
		</div>
	);
}
