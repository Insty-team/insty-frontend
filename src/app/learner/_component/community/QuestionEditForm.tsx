// 초안 질문 다듬는 컴포넌트

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import rehypeSanitize from "rehype-sanitize";
import Swal from "sweetalert2";

import { AttachmentFileModal } from "@/app/_components/community/common";
import {
	postCommunityQuestion,
	postQuestionVideo,
	putQuestionVideoUpload,
} from "@/app/api/backend";
import { useQuestionDraftStore } from "@/app/stores";
import { mdEditorCommands } from "@/app/utils";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function QuestionEditForm() {
	const router = useRouter();
	const {
		courseId: draftCourseId,
		title: draftTitle,
		content: draftContent,
		images,
	} = useQuestionDraftStore();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [uploadImages, setUploadImages] = useState<File[]>([]);
	const [uploadVideo, setUploadVideo] = useState<File | null>(null);
	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [attachmentType, setAttachmentType] = useState<"Image" | "Video">(
		"Image",
	);

	// 이미지/비디오 미리보기
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [videoPreview, setVideoPreview] = useState<string | null>(null);

	useEffect(() => {
		if (draftTitle || draftContent || images.length > 0) {
			setTitle(draftTitle);
			setContent(draftContent);
			setUploadImages(images);
			if (images[0]) setImagePreview(URL.createObjectURL(images[0]));
		}
	}, [draftTitle, draftContent, images]);

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
			let uploadedVideoUuid = null;

			// 비디오가 있을 경우 업로드 진행
			if (uploadVideo) {
				console.log("🎬 [1단계] 비디오 업로드 요청 시작");
				const videoInfo = {
					fileName: uploadVideo.name,
					contentType: uploadVideo.type,
				};

				const res = await postQuestionVideo(videoInfo);

				if (!res?.data?.uploadUrl || !res?.data?.uuid) {
					throw new Error("서버에서 signedUrl 또는 uuid를 받지 못했습니다.");
				}

				await putQuestionVideoUpload(res.data.uploadUrl, uploadVideo);

				uploadedVideoUuid = res.data.uuid;
				console.log("videoUuid 저장 완료:", uploadedVideoUuid);
			} else {
				console.log("비디오 없음");
			}

			console.log("요청 데이터:", {
				courseId: draftCourseId,
				title,
				content,
				videoUuid: uploadedVideoUuid,
				images: uploadImages,
			});

			await postCommunityQuestion(
				{
					courseId: draftCourseId,
					title,
					content,
					videoUuid: uploadedVideoUuid,
				},
				uploadImages,
			);

			Swal.fire({
				icon: "success",
				title: "질문이 등록되었습니다!",
				confirmButtonText: "확인",
			});

			setTitle("");
			setContent("");
			setUploadImages([]);
			setUploadVideo(null);
			setImagePreview(null);
			setVideoPreview(null);

			router.push("/learner/community");
		} catch (error) {
			console.error("❌ [에러 발생] 질문 등록 과정 중 오류:", error);
			Swal.fire({
				icon: "error",
				title: "질문 등록 중 오류가 발생했습니다.",
				confirmButtonText: "확인",
			});
		}
	};

	return (
		<div className="flex flex-col gap-4 relative px-10 py-10">
			<h3 className="text-2xl font-semibold">질문 남기기</h3>

			{/* 제목 */}
			<input
				type="text"
				placeholder="제목을 입력하세요"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green-400"
			/>

			{/* 내용 */}
			<MDEditor
				value={content}
				onChange={(val) => setContent(val || "")}
				height={400}
				commands={mdEditorCommands}
				previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
				textareaProps={{ placeholder: "질문을 입력해주세요." }}
			/>

			<div className="flex items-center gap-2 mt-4">
				{/* 이미지 */}
				<button
					onClick={() => {
						setAttachmentType("Image");
						setAttachmentModalOpen(true);
					}}
					className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer overflow-hidden"
				>
					{imagePreview ? (
						<>
							<Image
								src={imagePreview}
								alt="첨부 이미지 미리보기"
								fill
								className="object-cover"
							/>
							<span
								onClick={(e) => {
									e.stopPropagation();
									setUploadImages([]);
									setImagePreview(null);
								}}
								className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
							>
								×
							</span>
						</>
					) : (
						<>
							<IoImageOutline size={24} className="text-gray-600" />
							<span className="text-sm text-gray-500">
								({uploadImages.length}/2)
							</span>
						</>
					)}
				</button>

				{/* 비디오 */}
				<button
					onClick={() => {
						setAttachmentType("Video");
						setAttachmentModalOpen(true);
						console.log("🎥 비디오 첨부 모달 오픈");
					}}
					className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer overflow-hidden"
				>
					{videoPreview ? (
						<>
							<video
								src={videoPreview}
								className="w-full h-full object-cover rounded-md"
								muted
								autoPlay
								loop
							/>
							<span
								onClick={(e) => {
									e.stopPropagation();
									setUploadVideo(null);
									setVideoPreview(null);
									console.log("🧹 비디오 미리보기 초기화");
								}}
								className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
							>
								×
							</span>
						</>
					) : (
						<>
							<HiOutlineVideoCamera size={24} className="text-gray-600" />
							<span className="text-sm text-gray-500">
								{uploadVideo ? "1/1" : "0/1"}
							</span>
						</>
					)}
				</button>
			</div>

			{/* 첨부 파일 모달 */}
			{attachmentModalOpen && (
				<AttachmentFileModal
					type={attachmentType}
					onClose={() => {
						setAttachmentModalOpen(false);
						console.log("🔒 첨부 모달 닫힘");
					}}
					onFileSelect={(file: File) => {
						console.log("📂 파일 선택됨:", file);
						if (attachmentType === "Image") {
							setUploadImages([file]);
							setImagePreview(URL.createObjectURL(file));
						} else {
							setUploadVideo(file);
							setVideoPreview(URL.createObjectURL(file));
						}
					}}
				/>
			)}

			{/* 등록 버튼 */}
			<button
				onClick={handleSubmit}
				className="mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full transition"
			>
				등록하기
			</button>
		</div>
	);
}

export default QuestionEditForm;
