"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import rehypeSanitize from "rehype-sanitize";
import Swal from "sweetalert2";

import { Markdown } from "@/app/_components/common";
import {
	deleteAnswer,
	getPlaylistVideo,
	patchAnswer,
	postAnswerAccept,
	postAnswerVideo,
	postPlayListVideo,
	putAnswerVideoUpload,
} from "@/app/api/backend";
import HLSPlayer from "@/app/learner/_component/courses/HLSPlayer";
import { queryClient } from "@/app/queries";
import { Answer, CommunityAnswerUpdateReq } from "@/app/types/community";
import { mdEditorCommands } from "@/app/utils";
import { getFormattedDate } from "@/app/utils/";

import { BaseDropdown } from "../../common";
import AttachmentFileModal from "./AttachmentFileModal";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface AnswerCardProps {
	answer: Answer;
	questionStatus: string;
	userType: string;
	userNickname: string;
	questionUserNickname: string;
	questionId: number;
}

export default function AnswerCard({
	answer,
	questionStatus,
	userType,
	userNickname,
	questionUserNickname,
	questionId,
}: AnswerCardProps) {
	const router = useRouter();
	const [openDropdown, setOpenDropdown] = useState(false);
	const [editContent, setEditContent] = useState(answer.content);
	const [imagePreview, setImagePreview] = useState<string | null>(
		answer.attachments[0]?.url || null,
	);
	const [videoPreviewName, setVideoPreviewName] = useState<string | null>(
		answer.videoInfo?.originFileName || null,
	);
	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [attachmentType, setAttachmentType] = useState<"Image" | "Video">(
		"Image",
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
		[],
	);
	const [newImageFile, setNewImageFile] = useState<File[] | null>(null);
	const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
	const [isAccepting, setIsAccepting] = useState(false);
	const [m3u8Url, setM3u8Url] = useState<string | null>(null);

	useEffect(() => {
		const fetchVideo = async () => {
			if (!answer?.videoInfo) return;
			try {
				const res = await postPlayListVideo(
					answer.videoInfo.videoType,
					answer.answerId,
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
	}, [answer]);

	const handleDeleteAnswer = (answerId: number) => {
		if (isDeleting) return;
		setOpenDropdown(false);
		Swal.fire({
			title: "정말 댓글을 삭제하시겠습니까?",
			text: "삭제한 내용은 복구할 수 없습니다.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then(async (result) => {
			if (result.isConfirmed) {
				setIsDeleting(true);
				try {
					const res = await deleteAnswer(answerId);
					if (res.success) {
						Swal.fire({
							title: "댓글이 삭제되었습니다.",
							icon: "success",
							confirmButtonText: "확인",
						}).then(() => {
							queryClient.invalidateQueries({
								queryKey: ["answers", questionId],
							});
							queryClient.invalidateQueries({
								queryKey: ["acceptedAnswer", questionId],
							});
							router.refresh();
						});
					} else {
						Swal.fire({
							title: "댓글 삭제에 실패했습니다.",
							text: `${res.error.message}`,
							icon: "error",
							confirmButtonText: "확인",
						});
					}
				} catch (error) {
					console.error(error);
					Swal.fire({
						title: "댓글 삭제 중 오류가 발생했습니다.",
						text: "다시 시도해주세요.",
						icon: "error",
						confirmButtonText: "확인",
					});
				} finally {
					setIsDeleting(false);
				}
			}
		});
	};

	const handleAcceptAnswer = (questionId: number, answerId: number) => {
		if (isAccepting) return;
		Swal.fire({
			title: "해당 댓글을 채택하시겠습니까?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "채택하기",
			cancelButtonText: "취소",
			confirmButtonColor: "#ff4f64",
			cancelButtonColor: "#999",
		}).then(async (result) => {
			if (result.isConfirmed) {
				setIsAccepting(true);
				try {
					const res = await postAnswerAccept(questionId, answerId);
					if (res.success) {
						Swal.fire({
							title: "댓글 채택 완료!",
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
							title: "댓글 채택에 실패했습니다.",
							text: `${res.error.message}`,
							icon: "error",
							confirmButtonText: "확인",
						});
					}
				} catch (error) {
					console.error(error);
					Swal.fire({
						title: "댓글 채택 중 오류가 발생했습니다.",
						text: "다시 시도해주세요.",
						icon: "error",
						confirmButtonText: "확인",
					});
				} finally {
					setIsAccepting(false);
				}
			}
		});
	};

	const handleEditAnswer = () => {
		setIsEditing(true);
		setOpenDropdown(false);
		setDeletedAttachmentIds([]);
		setNewImageFile(null);
		setNewVideoFile(null);
	};

	const handleSaveEdit = async (answerId: number) => {
		if (!editContent.trim()) return;
		Swal.fire({
			title: "정말 수정하시겠습니까?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "확인",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then(async (result) => {
			if (result.isConfirmed) {
				setIsEditing(true);
				try {
					let uploadedVideoUuid: string | undefined = undefined;
					if (newVideoFile) {
						const videoInfo = {
							fileName: newVideoFile.name,
							contentType: newVideoFile.type,
						};
						const preRes = await postAnswerVideo(videoInfo);
						if (!preRes?.data?.uploadUrl || !preRes?.data?.uuid) {
							throw new Error(
								"서버에서 signedUrl 또는 uuid를 받지 못했습니다.",
							);
						}
						await putAnswerVideoUpload(preRes.data.uploadUrl, newVideoFile);
						uploadedVideoUuid = preRes.data.uuid;
					}
					let finalVideoUuid: string | undefined | null;
					if (uploadedVideoUuid) {
						finalVideoUuid = uploadedVideoUuid;
					} else {
						finalVideoUuid =
							videoPreviewName === null
								? undefined
								: answer.videoInfo?.videoUuid;
					}
					const payload: CommunityAnswerUpdateReq = {
						content: editContent,
						videoUuid: finalVideoUuid,
						deleteFileIds: deletedAttachmentIds,
					};
					const res = await patchAnswer(answerId, payload, newImageFile);
					if (res.success) {
						Swal.fire({
							title: "댓글이 수정되었습니다.",
							icon: "success",
							confirmButtonText: "확인",
						}).then(() =>
							queryClient.invalidateQueries({
								queryKey: ["answers", questionId],
							}),
						);
					} else {
						Swal.fire({
							title: "댓글 수정에 실패했습니다.",
							text: `${res.error.message}`,
							icon: "error",
							confirmButtonText: "확인",
						});
					}
				} catch (error) {
					console.error(error);
					Swal.fire({
						title: "댓글 수정 중 오류가 발생했습니다.",
						text: "다시 시도해주세요.",
						icon: "error",
						confirmButtonText: "확인",
					});
				} finally {
					setIsEditing(false);
				}
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

	const handleRemoveImage = (e: React.MouseEvent, attachmentId?: number) => {
		e.stopPropagation();
		if (attachmentId)
			setDeletedAttachmentIds((prev) => [...prev, attachmentId]);
		setImagePreview(null);
	};

	const handleRemoveVideo = (e: React.MouseEvent) => {
		e.stopPropagation();
		setVideoPreviewName(null);
		setNewVideoFile(null);
	};

	return (
		<div className="flex gap-4 py-5 transition-all duration-300 border-b-2 border-gray-200 px-4">
			<div className="flex flex-col flex-1">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-2">
						<h1 className="text-xl font-semibold text-gray-900">
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
						{userType === "LEARNER" &&
							userNickname === questionUserNickname &&
							questionStatus !== "ACCEPTED" && (
								<button
									className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-full border border-amber-200 hover:bg-amber-200 transition-colors"
									onClick={() =>
										handleAcceptAnswer(questionId, answer.answerId)
									}
								>
									채택하기
								</button>
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
											onClick: () => handleDeleteAnswer(answer.answerId),
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
							<MDEditor
								value={editContent}
								onChange={(val) => setEditContent(val || "")}
								height={200}
								commands={mdEditorCommands}
								previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
								textareaProps={{ placeholder: "댓글을 남겨주세요." }}
							/>
							<button
								onClick={() => handleSaveEdit(answer.answerId)}
								disabled={!editContent.trim()}
								className={`absolute bottom-6 right-6 p-3 rounded-full text-white z-10 transition-all duration-300 cursor-pointer ${
									editContent.trim()
										? "bg-primary-green-500 hover:bg-primary-green-600 shadow-md active:scale-95"
										: "bg-gray-300 text-gray-400 cursor-not-allowed"
								}`}
							>
								<LuSendHorizontal size={20} />
							</button>
						</div>

						<div className="flex gap-2 justify-between items-end">
							<div className="flex gap-2">
								<button
									type="button"
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
												onClick={(e) =>
													handleRemoveImage(e, answer.attachments[0]?.id)
												}
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
									type="button"
									onClick={handleOpenVideoModal}
									className="flex items-center justify-between w-60 px-4 h-12 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
								>
									{videoPreviewName ? (
										<>
											<span className="truncate">{videoPreviewName}</span>
											<span
												onClick={handleRemoveVideo}
												className="ml-2 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
											>
												×
											</span>
										</>
									) : (
										<span className="text-gray-500 text-sm">
											영상 파일 선택 (0/1)
										</span>
									)}
								</button>
							</div>

							<button
								className="px-4 py-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 rounded-full text-sm font-medium transition-all duration-200 shadow-sm"
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
										setNewImageFile([file]);
									} else {
										setVideoPreviewName(file.name);
										setNewVideoFile(file);
									}
								}}
							/>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-4 mt-3">
						<Markdown text={answer.content} />
						{answer.attachments?.length > 0 && (
							<Image
								src={answer.attachments[0].url}
								alt={answer.attachments[0].name}
								width={600}
								height={500}
								unoptimized
							/>
						)}
						{m3u8Url && <HLSPlayer src={m3u8Url} width="600px" />}
					</div>
				)}
			</div>
		</div>
	);
}
