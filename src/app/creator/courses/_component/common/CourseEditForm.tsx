"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import { RiDeleteBinFill, RiFolderUploadLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { postSuggestDescription, postSuggestTitle } from "@/app/api/ai/video";
import {
	postCourseVideo,
	putCourse,
	putCourseVideoUpload,
} from "@/app/api/backend";
import SuggestionLoading from "@/app/creator/_component/SuggestionLoading";
import { useThumbnailUpload } from "@/app/hooks/useThumbnailUpload";
import { ALLOWED_FILE_TYPES } from "@/app/types/allowedFileTypes";
import { CourseFormProps } from "@/app/types/course";

import { useCourseForm } from "../../../../hooks/useCourseForm";
import { useTranscriptionProgress } from "./TranscriptionProgress";

const CourseEditForm: React.FC<CourseFormProps> = ({
	subject,
	initialData,
	courseId,
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();

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
	} = useCourseForm(initialData);

	// 썸네일 업로드 커스텀 훅 사용
	const {
		thumbnailUrl,
		setThumbnailUrl,
		isThumbnailLoading,
		startThumbnailRequest,
		stopThumbnailRequest,
	} = useThumbnailUpload();

	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [practiceFiles, setPracticeFiles] = useState<File[]>([]);
	const [deletePracticeFiles, setDeletePracticeFiles] = useState<number[]>([]);
	const [existingPracticeFiles, setExistingPracticeFiles] = useState<
		{
			id: number;
			name: string;
			contentType: string;
			size: number;
			url: string;
		}[]
	>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const practiceFileInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoFileName, setVideoFileName] = useState<string | null>(null);
	const [videoUuid, setVideoUuid] = useState<string | null>(null);
	const [isNewVideo, setIsNewVideo] = useState<boolean>(false);
	const [isTitleSuggesting, setIsTitleSuggesting] = useState<boolean>(false);
	const [isDescriptionSuggesting, setIsDescriptionSuggesting] =
		useState<boolean>(false);

	const { transcriptionStatus, transcriptionProgress, transcriptionStep } =
		useTranscriptionProgress(isNewVideo ? videoUuid : null);

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setTargetAudience(initialData.targetAudience);
			setPrice(initialData.price);
			setDescription(initialData.description);
			setTags(initialData.tags);
			setThumbnailUrl(initialData.thumbnailUrl || "");
			setInstallEnvChecklist(
				initialData.installEnvChecklist?.length
					? initialData.installEnvChecklist
					: [{ content: "", isSupported: true }],
			);
			setKeyPoints(
				initialData.keyPoints?.length ? initialData.keyPoints : [""],
			);
			if (initialData.practiceFile && initialData.practiceFile.length > 0) {
				setExistingPracticeFiles(initialData.practiceFile);
			}
			if (initialData.videoInfo && initialData.videoInfo.originFileName) {
				setVideoFileName(initialData.videoInfo.originFileName);
			}
			if (initialData.videoInfo && initialData.videoInfo.videoUuid) {
				setVideoUuid(initialData.videoInfo.videoUuid);
				setIsNewVideo(false); // 기존 비디오는 새 비디오가 아님
			}
		}
	}, [initialData]);

	// videoUuid가 변경될 때 썸네일 요청 시작 (기존 썸네일이 없을 때만)
	useEffect(() => {
		if (videoUuid && !thumbnailUrl) {
			startThumbnailRequest(videoUuid);
		}
	}, [videoUuid, thumbnailUrl, startThumbnailRequest]);

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

		//디버깅용 코드
		//console.log("파일 형식 비교(설정한 확장자)", validFiles);
		//console.log("파일 형식 비교(내가 올린 파일)", files);

		if (validFiles.length !== files.length) {
			alert(
				`PDF, HWP, DOC, DOCX, ZIP, JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.`,
			);
			return;
		}

		if (
			existingPracticeFiles.length + practiceFiles.length + validFiles.length >
			2
		) {
			alert("최대 2개의 파일만 업로드 가능합니다.");
			return;
		}

		setPracticeFiles((prev) => [...prev, ...validFiles]);
	};

	const handleRemovePracticeFile = (index: number, isExisting: boolean) => {
		if (isExisting) {
			const file = existingPracticeFiles[index];
			setDeletePracticeFiles((prev) => [...prev, file.id]);
			setExistingPracticeFiles((prev) => prev.filter((_, i) => i !== index));
		} else {
			setPracticeFiles((prev) => prev.filter((_, i) => i !== index));
		}
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
		if (file.name.length > 150) {
			Swal.fire({
				title: "파일 이름이 너무 길어요.",
				text: "150자 이하의 이름으로 업로드 해주세요.",
				icon: "error",
				confirmButtonText: "확인",
			});
			return;
		}

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

		setVideoFileName(null);
		handleRemoveThumbnail();
		setVideoFile(file);
		setVideoFileName(file.name);
		setIsNewVideo(true);
		//console.log("선택된 비디오:", file);

		try {
			const videoInfo = {
				fileName: file.name,
				contentType: file.type,
			};
			const res = await postCourseVideo(videoInfo);
			//console.log(res);
			setVideoUuid(res.data.uuid);
			try {
				await putCourseVideoUpload(res.data.uploadUrl, file);
				//console.log(response, "비디오 업로드요청 성공");
			} catch (error) {
				console.error(error);
			}
		} catch (error) {
			console.error(error);
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
				setVideoFileName(null);
				setVideoUuid("");
				setThumbnailUrl("");
				setIsNewVideo(false);
				stopThumbnailRequest();
				if (videoInputRef.current) {
					videoInputRef.current.value = "";
				}
			}
		});
	};

	const handleSuggestTitle = async () => {
		setIsTitleSuggesting(true);
		//console.log(videoUuid, title);
		try {
			if (videoUuid) {
				//console.log(videoUuid, title);
				const res = await postSuggestTitle(videoUuid, title);
				if (res && res.data) {
					//console.log(res);
					setTitle(res.data.title);
				} else {
					Swal.fire({
						title: `${res.error.code}`,
						text: `${res.error.message}`,
						icon: "error",
					});
				}
			} else {
				alert("비디오 정보가 존재하지 않습니다. 다시 확인해주세요.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsTitleSuggesting(false);
		}
	};

	const handleSuggestDescription = async () => {
		setIsDescriptionSuggesting(true);
		try {
			if (videoUuid) {
				//console.log(videoUuid, description);
				const res = await postSuggestDescription(videoUuid, description);
				if (res && res.data) {
					//console.log(res);
					setDescription(res.data.description);
				} else {
					Swal.fire({
						title: `${res.error.code}`,
						text: `${res.error.message}`,
						icon: "error",
					}).then(() => {
						return;
					});
				}
			} else {
				alert("비디오 정보가 존재하지 않습니다. 다시 확인해주세요.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsDescriptionSuggesting(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!videoFileName) {
			Swal.fire({
				title: "강의 비디오를 업로드해주세요.",
				icon: "error",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			});
			return;
		}
		if (title === "") {
			Swal.fire({
				title: "제목을 입력해주세요.",
				icon: "error",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			});
			return;
		}
		if (targetAudience === "") {
			Swal.fire({
				title: "강의 대상을 입력해주세요.",
				icon: "error",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			});
			return;
		}
		if (description === "") {
			Swal.fire({
				title: "설명을 입력해주세요.",
				icon: "error",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			});
			return;
		}
		if (installEnvChecklist.length === 0) {
			Swal.fire({
				title: "설치 환경 체크리스트를 입력해주세요.",
				icon: "error",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			});
			return;
		}
		if (keyPoints.length === 0) {
			Swal.fire({
				title: "핵심 내용을 입력해주세요.",
				icon: "error",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			});
			return;
		}

		const formData = {
			title,
			description,
			targetAudience,
			price,
			tags,
			keyPoints,
			installEnvChecklist,
			deletePracticeField: deletePracticeFiles,
			// 새 비디오를 업로드했을 때만 videoUuid 전송, 그렇지 않으면 null
			updateVideoUuid: isNewVideo ? videoUuid : null,
		};
		const thumbnailData = thumbnailFile;
		const practiceFileData = practiceFiles;
		//console.log("폼 데이터:", formData);
		//console.log("썸네일 데이터:", thumbnailData);
		//console.log("실습 파일 데이터:", practiceFileData);
		//console.log("비디오 업로드 요청 데이터:", isNewVideo ? videoUuid : null);

		try {
			if (!courseId) {
				Swal.fire({
					title: "코스 아이디가 존재하지 않습니다.",
					icon: "error",
				}).then(() => {
					router.push("/creator/courses");
				});
				return;
			}
			const res = await putCourse(
				courseId,
				formData,
				thumbnailData,
				practiceFileData,
			);
			//console.log(res);

			if (res && !res.error) {
				Swal.fire({
					title: "강의가 수정 되었습니다.",
					icon: "success",
					confirmButtonText: "확인",
					confirmButtonColor: "#6ead79",
					timer: 30000,
					timerProgressBar: true,
				}).then(async () => {
					// 먼저 페이지 이동
					router.push("/creator/courses");

					// 페이지 이동 후 쿼리 무효화 (백그라운드에서 실행)
					setTimeout(() => {
						queryClient.invalidateQueries({
							queryKey: ["myCourses"],
						});
						// 현재 강의 상세 쿼리 캐시 제거
						queryClient.removeQueries({
							queryKey: ["courseDetail"],
						});
					}, 100);
				});
			} else {
				Swal.fire({
					title: "강의 수정 실패",
					text: res?.error?.message || "알 수 없는 오류가 발생했습니다.",
					icon: "error",
					confirmButtonText: "확인",
					confirmButtonColor: "#6ead79",
				});
			}
		} catch (error) {
			console.error("강의 수정 중 오류 발생:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex items-center justify-between">
				<div className="font-bold text-3xl mb-12">{subject}</div>
			</div>
			{/* 전사 진행률 표시 */}
			{isNewVideo && transcriptionStatus && videoUuid !== "" && (
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
				<div className="flex flex-col w-[350px]">
					<label className="block text-2xl font-semibold mb-1">
						강의 썸네일
					</label>
					<div className="mb-2 w-full h-[250px] bg-gray-scale-100 rounded-2xl flex items-center justify-center relative">
						{thumbnailUrl ? (
							<Image
								src={thumbnailUrl}
								alt="썸네일"
								className="w-full h-full object-cover rounded-2xl z-10"
								width={400}
								height={400}
							/>
						) : isThumbnailLoading ? (
							<div className="text-black-300 flex flex-col items-center justify-center">
								썸네일 생성 중... <Loading width={30} height={30} />
							</div>
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
							accept="image/*"
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
						{videoFileName && (
							<div className="flex w-[75%] mx-auto justify-between text-md truncate items-center bg-gray-100 p-2 rounded">
								<div className="text-md truncate flex items-center">
									{videoFile ? "" : "기존 영상 : "}
									{videoFileName}
								</div>
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
							{(practiceFiles.length > 0 ||
								existingPracticeFiles.length > 0) && (
								<div className="flex w-[75%] mx-auto flex-col gap-2 mt-2">
									{existingPracticeFiles.map((file, index) => (
										<div
											key={`existing-${index}`}
											className="flex items-center justify-between bg-gray-100 p-2 rounded truncate"
										>
											<div className="text-md truncate flex items-center">
												<FaRegFile className="mr-2" />
												{file.name.length >= 15
													? `${file.name.slice(0, 15)}...`
													: file.name}
											</div>
											<button
												type="button"
												onClick={() => handleRemovePracticeFile(index, true)}
												className="text-secondary-red-300"
											>
												✕
											</button>
										</div>
									))}
									{practiceFiles.map((file, index) => (
										<div
											key={`new-${index}`}
											className="flex items-center justify-between bg-gray-100 p-2 rounded"
										>
											<div className="text-md truncate flex items-center">
												<FaRegFile className="mr-2" />
												{file.name}
											</div>
											<button
												type="button"
												onClick={() => handleRemovePracticeFile(index, false)}
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
				{(isTitleSuggesting || isDescriptionSuggesting) && (
					<div className="fixed inset-0 w-full h-full bg-black-100/50 z-[1000] flex justify-center items-center cursor-wait">
						<SuggestionLoading />
					</div>
				)}

				<div className="flex-1 flex flex-col gap-4">
					<div>
						<div className="flex justify-between mb-1">
							<label className="block text-2xl font-semibold">제목</label>
							<button
								type="button"
								className="text-black-300 bg-white border border-gray-scale-300 rounded-2xl px-4 py-1 text-md cursor-pointer hover:bg-gray-scale-300 hover:text-black-100 transition-all duration-300"
								onClick={handleSuggestTitle}
							>
								AI에게 추천받기
							</button>
						</div>
						<div className="flex gap-2 relative">
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
						<div className="flex justify-between mb-1">
							<label className="block text-2xl font-semibold">설명</label>
							<button
								type="button"
								className="flex-none top-1 right-4 text-black-300 bg-white border border-gray-scale-300 rounded-2xl px-4 py-1 text-md cursor-pointer hover:bg-gray-scale-300 hover:text-black-100 transition-all duration-300"
								onClick={handleSuggestDescription}
							>
								AI에게 추천받기
							</button>
						</div>
						<div className="flex flex-col gap-2">
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
									e.key === "Enter" &&
									!e.nativeEvent.isComposing &&
									(e.preventDefault(), handleAddTag())
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
							{tags?.map((tag, idx) => (
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

					<div className="w-[20%] flex items-end ml-auto mt-4">
						<BaseButton title="수정" buttonType="submit" />
					</div>
				</div>
			</div>
		</form>
	);
};

export default CourseEditForm;
