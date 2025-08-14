import { useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { TbUpload } from "react-icons/tb";

import { MAX_IMAGE_SIZE } from "@/app/constants";

interface AttachmentModalProps {
	onClose: () => void;
	type: "Image" | "Video";
	onFileSelect: (file: File) => void;
}

function AttachmentModal({
	onClose,
	type,
	onFileSelect,
}: AttachmentModalProps) {
	const [fileName, setFileName] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [error, setError] = useState<string>("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			setFileName("");
			setSelectedFile(null);
			setError("");

			return;
		}

		const file = e.target.files[0];
		const fileExt = file.name.split(".").pop()?.toLowerCase();

		if (type === "Image" && !["png", "jpg"].includes(fileExt || "")) {
			setError("이미지는 PNG 또는 JPG만 업로드 가능합니다.");
			e.target.value = "";
			setFileName("");
			setSelectedFile(null);
			return;
		}

		if (type === "Image" && file.size > MAX_IMAGE_SIZE) {
			setError("이미지는 5MB 이하만 업로드 가능합니다.");
			e.target.value = "";
			setFileName("");
			setSelectedFile(null);
			return;
		}

		if (type === "Video" && fileExt !== "mp4") {
			setError("영상은 MP4 파일만 업로드 가능합니다.");
			e.target.value = "";
			setFileName("");
			setSelectedFile(null);
			return;
		}

		// 2분 이상 영상 처리 로직 추가

		setError("");
		setFileName(file.name);
		setSelectedFile(file);
	};

	const handleAttach = () => {
		if (!selectedFile) return;
		onFileSelect(selectedFile);
		onClose();
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl p-10 w-[500px]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary-green-100 rounded-xl">
							{type === "Image" ? (
								<IoImageOutline className="w-5 h-5 text-primary-green-600" />
							) : (
								<HiOutlineVideoCamera className="w-5 h-5 text-primary-green-600" />
							)}
						</div>

						<h1 className="text-xl font-bold text-gray-900">
							{type === "Image" ? "이미지 첨부" : "영상 첨부"}
						</h1>
					</div>

					<div
						onClick={onClose}
						className="cursor-pointer hover:bg-gray-100 hover:rounded-xl p-2"
					>
						<IoClose size={24} className="text-gray-500" />
					</div>
				</div>

				<div className="flex flex-col border-2 border-dotted border-gray-300 rounded-lg p-6 text-center relative items-center">
					<div className="bg-gray-100 rounded-full p-4 mb-4">
						<TbUpload size={24} className="text-gray-400" />
					</div>
					<input
						type="file"
						accept={type === "Image" ? "image/png, image/jpg" : "video/mp4"}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						id={type === "Image" ? "image-upload" : "video-upload"}
						onChange={handleInputChange}
					/>
					<label
						htmlFor={type === "Image" ? "image-upload" : "video-upload"}
						className="cursor-pointer text-gray-600 block w-full truncate"
					>
						{fileName ||
							(type === "Image"
								? "이미지를 선택하거나 드래그하세요"
								: "영상을 선택하거나 드래그하세요")}
					</label>
				</div>
				{error && <p className="mt-2 text-sm text-red-500">{error}</p>}

				<div className="bg-gray-100 rounded-lg p-4 mt-4">
					{type === "Image" ? (
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<div className="bg-black rounded-full w-1 h-1"></div>
								<p>파일 형식: PNG/JPG</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-black rounded-full w-1 h-1"></div>
								<p>최대 크기: 5MB</p>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<div className="bg-black rounded-full w-1 h-1"></div>
								<p>파일 형식: MP4</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-black rounded-full w-1 h-1"></div>
								<p>최대 길이: 2분</p>
							</div>
						</div>
					)}
				</div>

				<div className="flex justify-center mt-4">
					<button
						className="bg-primary-green-200 hover:bg-primary-green-300 rounded-2xl py-3 w-full cursor-pointer"
						onClick={handleAttach}
						disabled={!selectedFile}
					>
						첨부하기
					</button>
				</div>
			</div>
		</div>
	);
}

export default AttachmentModal;
