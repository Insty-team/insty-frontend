"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import Swal from "sweetalert2";

import { AttachmentFileModal } from "@/app/_components/community/common";
import { postDraftQuestion } from "@/app/api/ai/community";
import { useGetCourseProgressQuery } from "@/app/queries";
import { useQuestionDraftStore } from "@/app/stores";

interface QuestionDraftProps {
	from: "SIDE_BAR" | "COMMUNITY";
	onNext?: () => void;
}

interface CourseProgressItem {
	courseId: number;
	title: string;
	commentCount: number;
	thumbnailUrl: string;
	createdAt: string;
}

const QuestionDraftForm = ({ from, onNext }: QuestionDraftProps) => {
	const setDraft = useQuestionDraftStore((state) => state.setDraft);
	const router = useRouter();
	const params = useParams();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;
	const {
		data: courseItems,
		isLoading,
		error,
	} = useGetCourseProgressQuery(currentPage, pageSize);

	const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
	const [selectedCourseTitle, setSelectedCourseTitle] =
		useState("수강할 강의를 선택하세요");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [draftCreated, setDraftCreated] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	if (isLoading) return <div>loading...</div>;
	if (error) return <div>데이터를 불러오는데 실패했습니다.</div>;

	const handleSubmit = async () => {
		let courseIdToUse = selectedCourseId;

		if (from === "SIDE_BAR" && params.id) {
			const courseIdFromParam = Number(params.id);
			courseIdToUse = courseIdFromParam;
			setSelectedCourseId(courseIdFromParam);

			const matchedCourse = courseItems?.items?.find(
				(c: CourseProgressItem) => c.courseId === courseIdFromParam,
			);
			if (matchedCourse) {
				setSelectedCourseTitle(matchedCourse.title);
			}
		}

		if (from === "COMMUNITY" && !courseIdToUse) {
			Swal.fire({
				icon: "warning",
				title: "강의를 선택해주세요!",
				text: "질문을 작성하기 전에 수강 중인 강의를 선택해야 합니다.",
				confirmButtonColor: "#22c55e",
			});
			return;
		}

		if (!content.trim()) {
			Swal.fire({
				icon: "warning",
				title: "내용을 입력해주세요!",
				confirmButtonColor: "#22c55e",
			});
			return;
		}

		try {
			setLoading(true);
			const res = await postDraftQuestion({
				courseId: courseIdToUse,
				query: content,
				hasAttachment: selectedImages.length > 0,
				files: selectedImages,
			});

			if (res?.data) {
				setTitle(res.data.question_title || "");
				setContent(res.data.question_content || "");
				setDraftCreated(true);

				Swal.fire({
					icon: "success",
					title: "질문 초안이 생성되었습니다!",
					confirmButtonColor: "#22c55e",
				});
			} else {
				throw new Error("응답 데이터가 비어 있습니다.");
			}
		} catch (error) {
			console.error("API 요청 실패:", error);
			Swal.fire({
				icon: "error",
				title: "실패",
				text: "질문 초안 생성 중 오류가 발생했습니다.",
				confirmButtonColor: "#ef4444",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = () => {
		if (!draftCreated) {
			Swal.fire({
				icon: "info",
				title: "먼저 AI 초안을 생성해주세요!",
				confirmButtonColor: "#22c55e",
			});
			return;
		}

		setDraft({
			courseId: selectedCourseId,
			title,
			content,
			images: selectedImages,
		});

		if (from === "SIDE_BAR" && onNext) {
			onNext(); // 사이드바에서는 mode 전환
		} else {
			router.push("/learner/community/question/edit");
		}
	};

	const handleOpenImageModal = () => {
		if (selectedImages.length >= 2) {
			Swal.fire({
				icon: "info",
				title: "최대 2장까지 첨부할 수 있습니다.",
				confirmButtonColor: "#22c55e",
			});
			return;
		}
		setAttachmentModalOpen(true);
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = [...selectedImages];
		const updatedPreviews = [...imagePreviews];
		updatedImages.splice(index, 1);
		updatedPreviews.splice(index, 1);
		setSelectedImages(updatedImages);
		setImagePreviews(updatedPreviews);
	};

	return (
		<div className="flex flex-col gap-4 px-10 py-10">
			<h3 className="text-2xl font-semibold">AI로 질문 초안 작성하기</h3>

			{from === "COMMUNITY" && (
				<div className="relative w-full">
					<button
						type="button"
						onClick={() => setIsDropdownOpen((prev) => !prev)}
						className="flex justify-between items-center w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary-green-400"
					>
						<span>{selectedCourseTitle}</span>
						<MdArrowDropDown className="w-5 h-5" />
					</button>
					{isDropdownOpen && (
						<ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
							{courseItems.items.map((course: CourseProgressItem) => (
								<li
									key={course.courseId}
									onClick={() => {
										setSelectedCourseId(course.courseId);
										setSelectedCourseTitle(course.title);
										setIsDropdownOpen(false);
									}}
									className="px-4 py-2 cursor-pointer hover:bg-gray-100"
								>
									{course.title}
								</li>
							))}
						</ul>
					)}
				</div>
			)}

			<input
				type="text"
				placeholder="제목을 입력하세요"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green-400"
			/>

			<textarea
				placeholder="💡 에러 메시지나 스크린샷을 첨부해주시면 더 정확한 도움을 드릴 수 있어요!"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				className="w-full h-40 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green-400 resize-none"
			/>

			<div className="flex items-center gap-2 mt-2">
				{selectedImages.map((_, index) => (
					<div
						key={index}
						className="relative flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white overflow-hidden"
					>
						<Image
							src={imagePreviews[index]}
							alt={`첨부 이미지 ${index + 1}`}
							fill
							className="object-cover"
						/>
						<span
							onClick={() => handleRemoveImage(index)}
							className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
						>
							×
						</span>
					</div>
				))}

				{selectedImages.length < 2 && (
					<button
						onClick={handleOpenImageModal}
						className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
					>
						<IoImageOutline size={24} className="text-gray-600" />
						<span className="text-sm text-gray-500">
							({selectedImages.length}/2)
						</span>
					</button>
				)}
			</div>

			{attachmentModalOpen && (
				<AttachmentFileModal
					type="Image"
					onClose={() => setAttachmentModalOpen(false)}
					onFileSelect={(file: File) => {
						if (selectedImages.length < 2) {
							setSelectedImages([...selectedImages, file]);
							setImagePreviews([...imagePreviews, URL.createObjectURL(file)]);
						}
					}}
				/>
			)}

			<div className="flex justify-center gap-4 mt-4">
				<button
					onClick={handleSubmit}
					disabled={loading}
					className={`${
						loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
					} text-white font-semibold rounded-lg px-8 py-3 shadow-md transition`}
				>
					{loading ? "요청 중..." : "AI 초안 생성"}
				</button>

				<button
					onClick={handleEdit}
					disabled={!draftCreated}
					className={`${
						draftCreated
							? "bg-blue-500 hover:bg-blue-600"
							: "bg-blue-300 cursor-not-allowed"
					} text-white font-semibold rounded-lg px-8 py-3 shadow-md transition`}
				>
					다음
				</button>
			</div>
		</div>
	);
};

export default QuestionDraftForm;
