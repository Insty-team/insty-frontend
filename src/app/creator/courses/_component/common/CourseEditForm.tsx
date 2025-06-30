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
import { postSuggestDescription, postSuggestTitle } from "@/app/api/ai/video";
import { putCourse } from "@/app/api/backend";
import { ALLOWED_FILE_TYPES } from "@/app/types/allowedFileTypes";
import { CourseFormProps } from "@/app/types/course";

import { useCourseForm } from "../../../../hooks/useCourseForm";

const CourseEditForm: React.FC<CourseFormProps> = ({
	subject,
	initialData,
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

	const [thumbnailUrl, setThumbnailUrl] = useState(
		initialData?.thumbnailUrl || "",
	);
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

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setTargetAudience(initialData.targetAudience);
			setPrice(initialData.price);
			setDescription(initialData.description);
			setTags(initialData.tags);
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
		}
	}, []);

	const handleUploadThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
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

		if (validFiles.length !== files.length) {
			alert(
				"PDF, HWP, DOC, DOCX, ZIP, JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.",
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
	};

	const handleSuggestTitle = async () => {
		try {
			if (initialData?.videoInfo.videoUuid) {
				console.log(initialData?.videoInfo.videoUuid, title);
				const res = await postSuggestTitle(
					initialData?.videoInfo.videoUuid,
					title,
				);
				console.log(res);
				setTitle(res.data.title);
			} else {
				alert("비디오 정보가 존재하지 않습니다. 다시 확인해주세요.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSuggestDescription = async () => {
		try {
			if (initialData?.videoInfo.videoUuid) {
				console.log(initialData?.videoInfo.videoUuid, description);
				const res = await postSuggestDescription(
					initialData?.videoInfo.videoUuid,
					description,
				);
				console.log(res);
				setDescription(res.data.description);
			} else {
				alert("비디오 정보가 존재하지 않습니다. 다시 확인해주세요.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			title === "" ||
			price === 0 ||
			description === "" ||
			installEnvChecklist.length === 0 ||
			keyPoints.length === 0
		) {
			alert("모든 항목을 입력해주세요.");
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
			updateVideoUuid: null,
		};
		const thumbnailData = thumbnailFile;
		const practiceFileData = practiceFiles;
		console.log("폼 데이터:", formData);
		console.log("썸네일 데이터:", thumbnailData);
		console.log("실습 파일 데이터:", practiceFileData);

		try {
			if (typeof initialData?.courseId !== "number") {
				alert("코스 아이디가 존재하지 않습니다. 다시 확인해주세요.");
				router.push("/creator/courses");
				return;
			}
			await putCourse(
				initialData?.courseId,
				formData,
				thumbnailData,
				practiceFileData,
			);
			Swal.fire({
				title: "강의가 수정 되었습니다.",
				icon: "success",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			}).then(async () => {
				await queryClient.invalidateQueries({
					queryKey: ["courseDetail", initialData?.courseId],
				});
				router.push("/creator/courses");
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex items-center justify-between">
				<div className="font-bold text-3xl mb-12">{subject}</div>
			</div>
			<div className="flex w-full gap-9">
				<div className="flex flex-col w-3/5 max-w-[350px]">
					<label className="block text-2xl font-semibold mb-1">
						강의 썸네일
					</label>
					<div className="mb-2 w-full h-[20%] bg-gray-scale-100 rounded-2xl flex items-center justify-center relative">
						{initialData?.thumbnailUrl ? (
							<Image
								src={initialData?.thumbnailUrl}
								alt="썸네일"
								className="w-full h-full object-contain rounded-2xl"
								fill
							/>
						) : (
							<span className="text-gray-400">썸네일을 선택해주세요</span>
						)}
						{thumbnailUrl && (
							<button
								type="button"
								className="absolute top-1 right-2 text-black-500"
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
						/>
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
							/>
							{(practiceFiles.length > 0 ||
								existingPracticeFiles.length > 0) && (
								<div className="flex flex-col gap-2 mt-2">
									{existingPracticeFiles.map((file, index) => (
										<div
											key={`existing-${index}`}
											className="flex items-center justify-between bg-gray-100 p-2 rounded"
										>
											<div className="text-md truncate flex items-center">
												<FaRegFile className="mr-2" />
												{file.name}
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
							className="mt-4 text-2lg text-secondary-red-300 flex justify-center items-center cursor-pointer"
						>
							<span className="mr-2">업로드 강의 삭제</span>
							<RiDeleteBinFill />
						</button>
					</div>
				</div>

				<div className="flex-1 flex flex-col gap-4">
					<div>
						<label className="block text-2xl font-semibold mb-1">제목</label>
						<div className="flex gap-2 relative">
							<input
								className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
								placeholder="설치 가이드 주제 입력"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<button
								type="button"
								className="absolute top-2 right-2 text-black-300 bg-white border border-gray-scale-300 rounded-2xl px-4 py-2 text-md cursor-pointer"
								onClick={handleSuggestTitle}
							>
								AI에게 추천받기
							</button>
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
						<div className="flex-1">
							<label className="block text-2xl font-semibold mb-1">가격</label>
							<input
								className="w-full bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg"
								placeholder="예: 199,990"
								value={price}
								onChange={(e) => setPrice(Number(e.target.value))}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-2xl font-semibold mb-1">설명</label>
						<div className="flex flex-col gap-2">
							<textarea
								className="flex-1 bg-gray-scale-100 rounded-3xl px-4 py-4 text-black-100 text-2lg resize-none"
								rows={6}
								placeholder="설명 내용 입력"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<button
								type="button"
								className="flex-none top-1 right-4 text-black-300 bg-white border border-gray-scale-300 rounded-2xl px-4 py-2 text-md"
								onClick={handleSuggestDescription}
							>
								AI에게 추천받기
							</button>
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
							핵심 전달이 되는 핵심 내용
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
