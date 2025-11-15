"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import Swal from "sweetalert2";

import { AttachmentFileModal } from "@/app/_components/community/common";
import {
	patchCommunityQuestion,
	postQuestionVideo,
	putQuestionVideoUpload,
} from "@/app/api/backend";
import { useGetQuestionDetail } from "@/app/queries";

export default function QuestionUpdateForm() {
	const router = useRouter();
	const params = useParams();
	const questionId = Number(params.id);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	// 기존 데이터
	const [originImages, setOriginImages] = useState<
		{ id: number; url: string }[]
	>([]);
	const [originVideo, setOriginVideo] = useState<{
		videoUuid: string;
		originFileName: string;
	} | null>(null);

	// 새로 추가
	const [newImages, setNewImages] = useState<File[]>([]);
	const [newVideo, setNewVideo] = useState<File | null>(null);
	const [videoUuid, setVideoUuid] = useState<string | null>(null);

	const [deleteFileIds, setDeleteFileIds] = useState<number[]>([]);
	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [attachmentType, setAttachmentType] = useState<"Image" | "Video">(
		"Image",
	);

	const { data: original } = useGetQuestionDetail(questionId);

	useEffect(() => {
		if (!original) return;
		setTitle(original.title);
		setContent(original.content);
		if (original.attachments?.length) {
			setOriginImages(
				original.attachments.map((att) => ({ id: att.id, url: att.url })),
			);
		}
		if (original.videoInfo) {
			setOriginVideo({
				videoUuid: original.videoInfo.videoUuid,
				originFileName: original.videoInfo.originFileName,
			});
			setVideoUuid(original.videoInfo.videoUuid);
		}
	}, [original]);

	// 이미지 제거
	const handleRemoveImage = (index: number, attachmentId?: number) => {
		if (attachmentId) {
			setDeleteFileIds((prev) => [...prev, attachmentId]);
			setOriginImages((prev) => prev.filter((_, i) => i !== index));
		} else {
			setNewImages((prev) => prev.filter((_, i) => i !== index));
		}
	};

	// 비디오 제거
	const handleRemoveVideo = () => {
		setOriginVideo(null);
		setNewVideo(null);
		setVideoUuid(null);
	};

	// 질문 수정 제출
	const handleSubmit = async () => {
		if (!title.trim()) {
			return Swal.fire({
				icon: "error",
				title: "제목을 입력해주세요.",
				confirmButtonText: "확인",
			});
		}
		if (!content.trim()) {
			return Swal.fire({
				icon: "error",
				title: "내용을 입력해주세요.",
				confirmButtonText: "확인",
			});
		}

		try {
			let uploadedVideoUuid = videoUuid;

			if (newVideo) {
				const videoInfo = {
					fileName: newVideo.name,
					contentType: newVideo.type,
				};

				const res = await postQuestionVideo(videoInfo);

				if (!res?.data?.uploadUrl || !res?.data?.uuid) {
					throw new Error("서버에서 signedUrl 또는 uuid를 받지 못했습니다.");
				}

				await putQuestionVideoUpload(res.data.uploadUrl, newVideo);

				uploadedVideoUuid = res.data.uuid;
				setVideoUuid(res.data.uuid);
				console.log("videoUuid 저장 완료:", uploadedVideoUuid);
			}

			await patchCommunityQuestion(
				questionId,
				{
					title,
					content,
					videoUuid: uploadedVideoUuid,
					deleteFileIds,
				},
				newImages,
			);

			Swal.fire({
				icon: "success",
				title: "질문이 수정되었습니다!",
				confirmButtonText: "확인",
			}).then(() => {
				router.push(`/learner/community/question/${questionId}`);
			});
		} catch (err) {
			console.error("❌ 질문 수정 중 오류:", err);
			Swal.fire({
				icon: "error",
				title: "질문 수정 중 오류가 발생했습니다.",
				confirmButtonText: "확인",
			});
		}
	};

	return (
		<div className="flex flex-col gap-4 relative px-10 py-10">
			<h3 className="text-2xl font-semibold">질문 수정하기</h3>

			{/* 제목 */}
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="제목을 입력하세요"
				className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green-400"
			/>

			{/* 내용 */}
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="내용을 입력해주세요"
				className="w-full h-[300px] border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-green-400 resize-none"
			/>

			{/* 첨부 파일 */}
			<div className="flex gap-3 items-end mt-4">
				{/* 이미지 */}
				<div className="flex gap-2">
					{originImages.map((img, idx) => (
						<div
							key={`origin-${img.id}`}
							className="relative w-20 h-20 border-2 border-dashed rounded-md overflow-hidden"
						>
							<Image
								src={img.url}
								alt="기존 이미지"
								fill
								className="object-cover"
							/>
							<span
								onClick={() => handleRemoveImage(idx, img.id)}
								className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
							>
								×
							</span>
						</div>
					))}
					{newImages.map((file, idx) => (
						<div
							key={`new-${idx}`}
							className="relative w-20 h-20 border-2 border-dashed rounded-md overflow-hidden"
						>
							<Image
								src={URL.createObjectURL(file)}
								alt="새 이미지"
								fill
								className="object-cover"
							/>
							<span
								onClick={() => handleRemoveImage(idx)}
								className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
							>
								×
							</span>
						</div>
					))}

					{/* 이미지 업로드 버튼 */}
					{originImages.length + newImages.length < 2 && (
						<button
							onClick={() => {
								setAttachmentType("Image");
								setAttachmentModalOpen(true);
							}}
							className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer overflow-hidden"
						>
							<IoImageOutline size={24} className="text-gray-600" />
							<span className="text-sm text-gray-500">
								({originImages.length + newImages.length}/2)
							</span>
						</button>
					)}
				</div>

				{/* 비디오 */}
				<div className="flex flex-col">
					{originVideo ? (
						<div className="flex items-center justify-between w-72 px-4 h-12 border-2 border-dashed border-gray-400 rounded-md bg-white overflow-hidden">
							<span className="truncate">{originVideo.originFileName}</span>
							<span
								onClick={handleRemoveVideo}
								className="ml-2 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
							>
								×
							</span>
						</div>
					) : newVideo ? (
						<div className="flex items-center justify-between w-72 px-4 h-12 border-2 border-dashed border-gray-400 rounded-md bg-white overflow-hidden">
							<span className="truncate">{newVideo.name}</span>
							<span
								onClick={handleRemoveVideo}
								className="ml-2 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
							>
								×
							</span>
						</div>
					) : (
						<button
							onClick={() => {
								setAttachmentType("Video");
								setAttachmentModalOpen(true);
							}}
							className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer overflow-hidden"
						>
							<HiOutlineVideoCamera size={24} className="text-gray-600" />
							<span className="text-sm text-gray-500">(0/1)</span>
						</button>
					)}
				</div>
			</div>

			{/* 파일 모달 */}
			{attachmentModalOpen && (
				<AttachmentFileModal
					type={attachmentType}
					onClose={() => setAttachmentModalOpen(false)}
					onFileSelect={(file: File) => {
						if (attachmentType === "Image") {
							setNewImages((prev) => [...prev, file]);
						} else if (attachmentType === "Video") {
							setNewVideo(file);
						}
					}}
				/>
			)}

			{/* 수정 버튼 */}
			<button
				onClick={handleSubmit}
				className="mt-6 bg-primary-green-600 hover:bg-primary-green-700 text-white py-3 px-6 rounded-full transition"
			>
				수정하기
			</button>
		</div>
	);
}
