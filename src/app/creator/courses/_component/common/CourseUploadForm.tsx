"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaRegFile } from "react-icons/fa6";
import { RiDeleteBinFill, RiFolderUploadLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import { postSuggestMetadata } from "@/app/api/ai";
import { postCourseVideo, putCourseVideoUpload } from "@/app/api/backend";
import { useVideoUploadStore } from "@/app/stores/videoUpload";
import { ALLOWED_FILE_TYPES } from "@/app/types/allowedFileTypes";
import { UploadformData } from "@/app/types/course";

import { useCourseForm } from "../../../../hooks/useCourseForm";
import { useTranscriptionProgress } from "./TranscriptionProgress";

interface CourseUploadFormProps {
	subject: string;
	initialData?: UploadformData;
	onSubmit: (formData: UploadformData) => void;
	onBack?: () => void;
}

const CourseUploadForm: React.FC<CourseUploadFormProps> = ({
	subject,
	initialData,
	onSubmit,
}) => {
	const { data, setData } = useVideoUploadStore();

	// store에 데이터가 있으면 그것을 우선 사용, 없으면 initialData 사용
	const effectiveInitialData = data || initialData;

	const {
		title,
		setTitle,
		description,
		setDescription,
		targetAudience,
		setTargetAudience,
		price,
		setPrice,
		installEnvChecklist,
		setInstallEnvChecklist,
		keyPoints,
		setKeyPoints,
		tags,
		setTags,
		tagInput,
		setTagInput,
		handleAddTag,
		handleRemoveTag,
		handleAddEnv,
		handleEnvChange,
		handleRemoveEnv,
		handleCoreChange,
		handleAddCore,
		handleRemoveCore,
	} = useCourseForm(effectiveInitialData);

	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [videoFile, setVideoFile] = useState<File | null>(
		effectiveInitialData?.videoFile || null,
	);
	const [practiceFiles, setPracticeFiles] = useState<File[]>([]);
	const [videoUuid, setVideoUuid] = useState<string>(
		effectiveInitialData?.videoUuid || "",
	);

	// 전사 진행률 커스텀 훅 사용
	const { transcriptionStatus, transcriptionProgress, transcriptionStep } =
		useTranscriptionProgress(videoUuid);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const practiceFileInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const dataToUse = data || initialData;
		if (dataToUse) {
			setTitle(dataToUse.title || "");
			setDescription(dataToUse.description || "");
			setTargetAudience(dataToUse.targetAudience || "");
			setPrice(dataToUse.price || 0);
			setTags(dataToUse.tags || []);
			setInstallEnvChecklist(
				dataToUse.installEnvChecklist?.length
					? dataToUse.installEnvChecklist
					: [{ content: "", isSupported: true }],
			);
			setKeyPoints(dataToUse.keyPoints?.length ? dataToUse.keyPoints : [""]);
			if (dataToUse.videoFile) {
				setVideoFile(dataToUse.videoFile);
			}
			if (dataToUse.videoUuid) {
				setVideoUuid(dataToUse.videoUuid);
			}
		}
	}, [
		data,
		initialData,
		setDescription,
		setInstallEnvChecklist,
		setKeyPoints,
		setPrice,
		setTags,
		setTitle,
		setTargetAudience,
	]);

	const handleUploadThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && !ALLOWED_FILE_TYPES.image.types.includes(file.type)) {
			alert("이미지 관련 파일만 업로드 가능합니다.(jpg, jpeg, png, webp)");
			return;
		}
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setThumbnailUrl(e.target?.result as string);
				setThumbnailFile(file);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveThumbnail = () => {
		setThumbnailUrl("");
		setThumbnailFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleThumbnailClick = () => {
		fileInputRef.current?.click();
	};

	const handlePracticeFileClick = () => {
		practiceFileInputRef.current?.click();
	};

	const handleUploadPracticeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const validFiles = files.filter((file) =>
			ALLOWED_FILE_TYPES.document.types.includes(file.type),
		);

		//파일 형식 디버깅용
		console.log("파일 형식 비교(설정한 확장자)", validFiles);
		console.log("파일 형식 비교(내가 올린 파일)", files);

		if (validFiles.length !== files.length) {
			alert(
				"PDF, HWP, DOC, DOCX, ZIP, JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.",
			);
			return;
		}

		if (practiceFiles.length + validFiles.length > 2) {
			alert("최대 2개의 파일만 업로드 가능합니다.");
			return;
		}

		setPracticeFiles((prev) => [...prev, ...validFiles]);
	};

	const handleRemovePracticeFile = (index: number) => {
		setPracticeFiles((prev) => prev.filter((_, i) => i !== index));
		if (practiceFileInputRef.current) {
			practiceFileInputRef.current.value = "";
		}
	};

	const handleUploadVideo = () => {
		videoInputRef.current?.click();
	};

	const handleVideoFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_FILE_TYPES.video.types.includes(file.type)) {
			alert(
				"지원하지 않는 비디오 형식입니다. MP4, MOV, AVI 파일만 업로드 가능합니다.",
			);
			return;
		}

		if (file.size > 2 * 1024 * 1024 * 1024) {
			alert("파일 크기가 너무 큽니다. 2GB 이하의 파일만 업로드 가능합니다.");
			return;
		}

		setVideoFile(file);
		console.log("선택된 비디오:", file);

		try {
			const videoInfo = {
				fileName: file.name,
				contentType: file.type,
			};
			const res = await postCourseVideo(videoInfo);
			console.log(res);
			setVideoUuid(res.data.uuid);
			try {
				const response = await putCourseVideoUpload(res.data.uploadUrl, file);
				console.log(response, "비디오 업로드요청 성공");
			} catch (error) {
				console.log(error);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleRemoveVideoFile = () => {
		Swal.fire({
			title: "업로드한 영상을 삭제하시겠어요?",
			text: "재업로드시, 영상 분석이 다시 진행됩니다.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
		}).then((result) => {
			if (result.isConfirmed) {
				setVideoFile(null);
				setVideoUuid("");
				if (videoInputRef.current) {
					videoInputRef.current.value = "";
				}
			}
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!videoFile) {
			Swal.fire({
				title: "비디오를 업로드 해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				return;
			});
		} else if (transcriptionProgress !== 100) {
			Swal.fire({
				title: "아직 영상 분석이 완료되지 않았습니다.",
				text: "조금만 기다려주세요!",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				return;
			});
		} else if (
			title === "" ||
			description === "" ||
			installEnvChecklist.length === 0 ||
			keyPoints.length === 0
		) {
			Swal.fire({
				title: "모든 항목을 입력해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				return;
			});
		} else {
			const formData: UploadformData = {
				title,
				description,
				targetAudience,
				price,
				tags,
				keyPoints,
				isShow: true,
				installEnvChecklist,
				videoUuid: videoUuid,
				videoFile: videoFile,
				thumbnailFile: thumbnailFile ? thumbnailFile : null,
				practiceFiles: practiceFiles.length > 0 ? practiceFiles : [],
			};

			setData(formData);
			onSubmit(formData);
		}
	};

	const handleSuggestMetadata = async () => {
		if (!videoUuid) {
			Swal.fire({
				title: "먼저 비디오를 업로드 해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				return;
			});
		}
		try {
			const res = await postSuggestMetadata(videoUuid);
			if (res && res.data) {
				console.log(res);
				setTitle(res.data.title);
				setDescription(res.data.description);
				setTargetAudience(res.data.target);
				setTags(res.data.tags);
				if (res.data.core_contents) {
					setKeyPoints(res.data.core_contents);
				}
				if (res.data.installation_checklist) {
					const convertedChecklist = res.data.installation_checklist.map(
						(content: string) => ({
							content: content,
							isSupported: true,
						}),
					);
					setInstallEnvChecklist(convertedChecklist);
				}
			} else {
				Swal.fire({
					title: `${res.error.code}`,
					text: `${res.error.message}`,
					icon: "error",
				}).then(() => {
					return;
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex items-center justify-between">
				<div className="font-bold text-3xl mb-12">{subject}</div>
				<BaseButton
					title="AI로 초안 작성하기"
					alignIcon="left"
					icon={<BsStars />}
					fill={false}
					className="!px-4 !py-2 !rounded-lg !border-primary-green-600 !w-[210px] !disabled:cursor-not-allowed !disabled:bg-gray-scale-300"
					onClick={handleSuggestMetadata}
					disabled={
						transcriptionStatus !== "COMPLETED" ||
						videoFile === null ||
						videoUuid === ""
					}
				/>
			</div>
			{/* 전사 진행률 표시 */}
			{transcriptionStatus && videoUuid !== "" && (
				<div className="mb-6 text-sm bg-gray-50 p-4 rounded-xl border">
					<div className="mb-2">
						<strong>변환 상태:</strong> {transcriptionStatus}
					</div>
					<div className="mb-2">
						<strong>진행 단계:</strong> {transcriptionStep}
					</div>
					<div className="mb-1 flex justify-between">
						<strong>진행률:</strong>
						<span>{transcriptionProgress}%</span>
					</div>
					<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-green-500 transition-all duration-500"
							style={{ width: `${transcriptionProgress}%` }}
						/>
					</div>
				</div>
			)}
			<div className="flex w-full gap-9">
				<div className="flex flex-col w-3/5 max-w-[350px]">
					<label className="block text-2xl font-semibold mb-1">
						강의 썸네일
					</label>
					<div className="mb-2 w-full h-[20%] bg-gray-scale-100 rounded-2xl flex items-center justify-center relative">
						{thumbnailUrl ? (
							<Image
								src={thumbnailUrl}
								alt="썸네일"
								className="w-full h-full object-cover rounded-2xl"
								fill
							/>
						) : (
							<span className="text-gray-400">썸네일을 선택해주세요</span>
						)}
						{thumbnailUrl && (
							<button
								type="button"
								className="absolute top-1 right-2 text-secondary-red-300 z-20 cursor-pointer hover:text-2lg"
								onClick={handleRemoveThumbnail}
							>
								✕
							</button>
						)}
					</div>
					<div className="flex flex-col gap-3 mt-3 justify-center align-middle text-center">
						<input
							ref={fileInputRef}
							type="file"
							accept=".jpg,.jpeg,.png,.webp"
							className="hidden"
							onChange={handleUploadThumbnail}
						/>
						<BaseButton
							title="썸네일 선택"
							icon={<RiFolderUploadLine />}
							onClick={handleThumbnailClick}
							className="!rounded-lg !w-[75%] !mx-auto"
						/>
						<input
							ref={videoInputRef}
							type="file"
							accept={ALLOWED_FILE_TYPES.video.accept}
							className="hidden"
							onChange={handleVideoFileChange}
						/>
						<BaseButton
							title="영상 선택"
							icon={<RiFolderUploadLine />}
							onClick={handleUploadVideo}
							className="!rounded-lg !w-[75%] !mx-auto"
						/>
						{videoFile && (
							<div className="flex w-[75%] mx-auto justify-between text-md truncate items-center bg-gray-100 p-2 rounded">
								업로드한 영상 : {videoFile.name}
							</div>
						)}
						<div className="flex flex-col gap-2">
							<input
								ref={practiceFileInputRef}
								type="file"
								accept=".pdf,.hwp,.doc,.docx"
								multiple
								className="hidden"
								onChange={handleUploadPracticeFile}
							/>
							<BaseButton
								title="실습 자료 파일 선택"
								fill={false}
								onClick={handlePracticeFileClick}
								className="!rounded-lg !w-[75%] !mx-auto"
							/>
							{practiceFiles.length > 0 && (
								<div className="flex flex-col gap-2 mt-2">
									{practiceFiles.map((file, index) => (
										<div
											key={index}
											className="flex w-[75%] mx-auto items-center justify-between bg-gray-100 p-2 rounded truncate"
										>
											<div className="text-md truncate flex items-center">
												<FaRegFile className="mr-2" />
												{file.name.length >= 15
													? `${file.name.slice(0, 15)}...`
													: file.name}
											</div>
											<button
												type="button"
												onClick={() => handleRemovePracticeFile(index)}
												className="text-secondary-red-300"
											>
												✕
											</button>
										</div>
									))}
								</div>
							)}
						</div>
						<button
							type="button"
							className="w-[75%] mx-auto mt-2 text-2lg py-3 text-secondary-red-300 flex justify-center items-center cursor-pointer hover:border-secondary-red-300 hover:bg-secondary-red-300 hover:rounded-lg hover:text-white transition-all duration-300"
							onClick={handleRemoveVideoFile}
						>
							<span className="mr-2">업로드 강의 삭제</span>
							<RiDeleteBinFill />
						</button>
					</div>
				</div>

				<div className="flex-1 flex flex-col gap-4">
					<div>
						<label className="block text-2xl font-semibold mb-1">제목</label>
						<div className="flex">
							<input
								className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
								placeholder="설치 가이드 주제 입력"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex gap-4 mt-4">
						<div className="flex-1">
							<label className="block text-2xl font-semibold mb-1">
								대상자
							</label>
							<input
								className="w-full bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
								placeholder="예: 파이썬 개발 환경 설치가 처음인 초보자"
								value={targetAudience}
								onChange={(e) => setTargetAudience(e.target.value)}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-2xl font-semibold mb-1">설명</label>
						<div className="flex">
							<textarea
								className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg resize-none"
								rows={6}
								placeholder="설명 내용 입력"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-2xl font-semibold mb-1">
							설치 환경 체크리스트
						</label>
						<div className="flex flex-col gap-2">
							{installEnvChecklist.map((env, idx) => (
								<div key={idx} className="flex gap-2 items-center">
									<input
										className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
										value={env.content}
										onChange={(e) =>
											handleEnvChange(idx, "content", e.target.value)
										}
										placeholder="환경 입력"
									/>
									<select
										className="border border-gray-scale-300 rounded-3xl px-4 py-4 text-black-100 text-2lg"
										value={env.isSupported ? "지원" : "미지원"}
										onChange={(e) =>
											handleEnvChange(idx, "support", e.target.value)
										}
									>
										<option>지원</option>
										<option>미지원</option>
									</select>
									<button
										type="button"
										className="text-gray-400 ml-2"
										onClick={() => handleRemoveEnv(idx)}
									>
										✕
									</button>
								</div>
							))}
							<button
								type="button"
								className="self-center px-5 py-2 border border-gray-scale-300 rounded text-lg mt-1 hover:bg-gray-scale-300"
								onClick={handleAddEnv}
							>
								더 입력하기 +
							</button>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-2xl font-semibold mb-1">
							해당 영상이 다루는 핵심 내용
						</label>
						<div className="flex flex-col gap-2">
							{keyPoints.map((content, idx) => (
								<div key={idx} className="flex gap-2 items-center">
									<input
										className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
										value={content}
										onChange={(e) => handleCoreChange(idx, e.target.value)}
										placeholder="핵심 내용 입력"
									/>
									<button
										type="button"
										className="text-gray-400 ml-2"
										onClick={() => handleRemoveCore(idx)}
									>
										✕
									</button>
								</div>
							))}
							<button
								type="button"
								className="self-center px-5 py-2 border border-gray-scale-300 rounded text-lg mt-1 hover:bg-gray-scale-300"
								onClick={handleAddCore}
							>
								더 입력하기 +
							</button>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-2xl font-semibold mb-1">태그</label>
						<div className="flex gap-2">
							<input
								className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && (e.preventDefault(), handleAddTag())
								}
								placeholder="태그 입력 후 Enter"
							/>
							<button
								type="button"
								className="px-3 py-1 border border-gray-scale-300 rounded-3xl text-lg cursor-pointer"
								onClick={handleAddTag}
							>
								추가
							</button>
						</div>
						<div className="flex flex-wrap gap-2 mt-2">
							{tags.map((tag, idx) => (
								<span
									key={tag}
									className="px-4 py-2 rounded-full flex items-center text-lg border !border-primary-green-600"
								>
									{tag}
									<button
										className="flex items-center cursor-pointer"
										onClick={() => handleRemoveTag(idx)}
									>
										<TiDelete className="size-6" />
									</button>
								</span>
							))}
						</div>
					</div>

					<div className="w-[20%] flex items-end ml-auto">
						<BaseButton
							title={
								subject === "업로드 전 강의 수정" ? "수정 완료" : "미리 보기"
							}
							buttonType="submit"
						/>
					</div>
				</div>
			</div>
		</form>
	);
};

export default CourseUploadForm;
