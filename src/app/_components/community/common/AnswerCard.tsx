import Image from "next/image";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import Swal from "sweetalert2";

import { getFormattedDate } from "@/app/utils/";

import { BaseDropdown } from "../../common";
import AttachmentFileModal from "./AttachmentFileModal";

interface AnswerCardProps {
	answer: Answer;
	questionStatus: string;
	userType: string;
	userNickname: string;
	questionUserNickname: string;
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

export default function AnswerCard({
	answer,
	questionStatus,
	userType,
	userNickname,
	questionUserNickname,
}: AnswerCardProps) {
	const [openDropdown, setOpenDropdown] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [editContent, setEditContent] = useState(answer.content);
	const [imagePreview, setImagePreview] = useState<string | null>(
		answer.attachments[0]?.url || null,
	);
	const [videoPreview, setVideoPreview] = useState<string | null>(
		answer.videoInfo?.videoUuid || null,
	);

	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [attachmentType, setAttachmentType] = useState<"Image" | "Video">(
		"Image",
	);

	const handleDeleteAnswer = () => {
		setOpenDropdown(false);
		Swal.fire({
			title: "삭제하시겠습니까?",
			text: "삭제한 내용은 복구할 수 없습니다.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				// TODO: 삭제 처리 api
				console.log("삭제");
			}
		});
	};

	const handleAcceptAnswer = () => {
		Swal.fire({
			title: "해당 댓글을 채택하시겠습니까?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "채택하기",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				// TODO: 채택 처리 api
				console.log("채택");
			}
		});
	};

	const handleEditAnswer = () => {
		setIsEditing(true);
		setOpenDropdown(false);
	};

	const handleSaveEdit = () => {
		Swal.fire({
			title: "정말 수정하시겠습니까?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "확인",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				console.log("수정하기");
				setIsEditing(false);
				// 수정 api 호출
			}
		});
	};

	const handleCancelEdit = () => {
		Swal.fire({
			title: "편집을 취소하시겠어요?",
			text: "작성 중인 내용이 저장되지 않습니다.",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "취소",
			cancelButtonText: "돌아가기",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				console.log("편집 취소");
				setIsEditing(false);
			}
		});
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
		setImagePreview(null);
	};

	const handleRemoveVideo = (e: React.MouseEvent) => {
		e.stopPropagation();
		setVideoPreview(null);
	};

	return (
		<div
			className={`flex gap-4 py-5 transition-all duration-300 ${
				answer.isAccepted
					? "border-2 bg-gradient-to-r from-green-50/80 to-green-50/60 rounded-2xl px-6"
					: "border-b-2 border-gray-200 px-4"
			}`}
		>
			<div className="flex flex-col flex-1">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-2">
						<h1
							className={`text-xl font-semibold ${
								answer.isAccepted ? "text-green-800" : "text-gray-900"
							}`}
						>
							{answer.user.nickname}
						</h1>

						{questionUserNickname === answer.user.nickname &&
						answer.user.userType === userType ? (
							<span className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-full">
								작성자
							</span>
						) : answer.user.userType === "LEARNER" ? (
							<span className="px-2 py-1 text-sm bg-blue-100 text-primary-blue-400 rounded-full">
								러너
							</span>
						) : (
							<span className="px-2 py-1 text-sm bg-primary-green-100 text-primary-green-700 rounded-full">
								크리에이터
							</span>
						)}

						{questionStatus !== "ACCEPTED" &&
							userType === "LEARNER" &&
							userNickname === questionUserNickname &&
							answer.user.nickname !== questionUserNickname && (
								<button
									className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-full border border-amber-200 hover:bg-amber-200 transition-colors"
									onClick={handleAcceptAnswer}
								>
									채택하기
								</button>
							)}

						{answer.isAccepted && (
							<span className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-full font-bold shadow-md">
								✨ 채택된 답변
							</span>
						)}
					</div>

					<div className="relative">
						{answer.user.userType === userType &&
							answer.user.nickname === userNickname && (
								<BaseDropdown
									isOpen={openDropdown}
									setIsOpen={setOpenDropdown}
									trigger={
										<button className="outline-none">
											<BsThreeDots className="cursor-pointer size-5 text-gray-500" />
										</button>
									}
									items={[
										{ label: "수정", onClick: handleEditAnswer },
										{
											label: "삭제",
											onClick: handleDeleteAnswer,
											danger: true,
										},
									]}
								/>
							)}
					</div>
				</div>

				<span className="text-gray-400 text-lg">
					{getFormattedDate(answer.createdAt)}
				</span>

				{isEditing ? (
					<div className="flex flex-col gap-4 mt-3">
						<div className="relative">
							<textarea
								className="w-full min-h-[200px] p-6 pr-20 border-2 rounded-3xl resize-none text-xl
                placeholder:text-gray-400 text-gray-900 leading-relaxed
                transition-all duration-300 ease-out
                border-primary-green-400 shadow-2xl shadow-primary-green-500/10 outline-none"
								placeholder="댓글을 남겨주세요."
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
							/>
							<button
								onClick={handleSaveEdit}
								disabled={!editContent.trim()}
								className={`absolute bottom-6 right-6 p-3 rounded-full text-white z-10 transition-all duration-300 cursor-pointer
                  ${
										editContent.trim()
											? "bg-primary-green-500 hover:bg-primary-green-600 shadow-md active:scale-95"
											: "bg-gray-300 text-gray-400 cursor-not-allowed"
									}`}
							>
								<LuSendHorizontal size={20} />
							</button>
						</div>

						{/* 첨부 파일 영역 */}
						<div className="flex gap-2 justify-between items-end">
							<div className="flex">
								<button
									type="button"
									onClick={handleOpenImageModal}
									className="relative flex flex-col items-center justify-center w-20 h-20
                  border-2 border-dashed border-gray-400 rounded-md
                  bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer overflow-hidden"
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

								{/* 영상 업로드 */}
								<button
									type="button"
									onClick={handleOpenVideoModal}
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
											<HiOutlineVideoCamera
												size={24}
												className="text-gray-600"
											/>
											<span className="text-sm text-gray-500">(0/1)</span>
										</>
									)}
								</button>
							</div>
							<button
								className="px-4 py-2 bg-white border-2 border-gray-300 
								hover:border-gray-400 text-gray-600 hover:text-gray-700 rounded-full text-sm 
								font-medium transition-all duration-200 shadow-sm"
								onClick={handleCancelEdit}
							>
								취소
							</button>
						</div>

						{attachmentModalOpen && (
							<AttachmentFileModal
								type={attachmentType}
								onClose={() => setAttachmentModalOpen(false)}
								onFileSelect={(file: File) => {
									if (attachmentType === "Image") {
										setImagePreview(URL.createObjectURL(file));
									} else {
										setVideoPreview(URL.createObjectURL(file));
									}
								}}
							/>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-4 mt-3">
						<p className="text-xl text-gray-900">{answer.content}</p>
						{answer.attachments?.length > 0 && (
							<Image
								src={answer.attachments[0].url}
								alt={answer.attachments[0].name}
								width={500}
								height={300}
								unoptimized
							/>
						)}
						{/* TODO: 영상 미리보기 */}
					</div>
				)}

				{/* 채택된 답변 표시 */}
				{answer.isAccepted && (
					<div className="mt-4 p-3 bg-green-100/60 rounded-xl border">
						<div className="flex items-center gap-2 text-lg text-green-700">
							<span className="text-base">💚</span>
							<span className="font-medium">
								이 댓글이 질문자에게 가장 도움이 되었습니다.
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
