"use client";

import { useEffect, useState } from "react";

import { BaseButton, IconButton } from "@/app/_components/common";
import { VideoFormProps } from "@/app/types";

interface Environment {
	value: string;
	support: string;
}

const VideoForm: React.FC<VideoFormProps> = ({
	subject,
	initialData,
	onSubmit,
}) => {
	const [link, setLink] = useState(initialData?.link || "");
	const [title, setTitle] = useState(initialData?.title || "");
	const [recipient, setRecipient] = useState(initialData?.recipient || "");
	const [price, setPrice] = useState(initialData?.price || 0);
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [tags, setTags] = useState<string[]>(initialData?.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [environments, setEnvironments] = useState<Environment[]>(
		initialData?.environments || [
			{ value: "Windows 10 / 11 환경", support: "지원" },
		],
	);
	const [coreContents, setCoreContents] = useState<string[]>(
		initialData?.coreContents || ["파이썬 개발 환경 설치 (Windows 기준)"],
	);

	useEffect(() => {
		if (initialData) {
			setLink(initialData.link || "");
			setDescription(initialData.description || "");
			setTags(initialData.tags || []);
			setEnvironments(
				initialData.environments || [
					{ value: "Windows 10 / 11 환경", support: "지원" },
				],
			);
			setCoreContents(
				initialData.coreContents || ["파이썬 개발 환경 설치 (Windows 기준)"],
			);
		}
	}, [initialData]);

	const handleAddTag = () => {
		const val = tagInput.trim();
		if (val && !tags.includes(val)) {
			setTags([...tags, val]);
			setTagInput("");
		}
	};
	const handleRemoveTag = (idx: number) => {
		setTags(tags.filter((_, i) => i !== idx));
	};

	const handleEnvChange = (
		idx: number,
		key: "value" | "support",
		value: string,
	) => {
		const arr = [...environments];
		arr[idx][key] = value;
		setEnvironments(arr);
	};
	const handleAddEnv = () => {
		setEnvironments([...environments, { value: "", support: "지원" }]);
	};

	const handleRemoveEnv = (idx: number) => {
		setEnvironments(environments.filter((_, i) => i !== idx));
	};

	const handleCoreChange = (idx: number, value: string) => {
		const arr = [...coreContents];
		arr[idx] = value;
		setCoreContents(arr);
	};

	const handleAddCore = () => {
		setCoreContents([...coreContents, ""]);
	};

	const handleRemoveCore = (idx: number) => {
		setCoreContents(coreContents.filter((_, i) => i !== idx));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = {
			link,
			title,
			recipient,
			description,
			price,
			tags,
			environments,
			coreContents,
		};
		console.log("폼 데이터:", formData);
		if (
			link === "" ||
			title === "" ||
			recipient === "" ||
			price === 0 ||
			description === "" ||
			environments.length === 0 ||
			coreContents.length === 0 ||
			tags.length === 0
		) {
			alert("모든 항목을 입력해주세요.");
			return;
		} else {
			onSubmit(formData);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex items-center justify-between">
				<div className="font-bold text-3xl mb-12">{subject}</div>
				{subject === "영상 업로드" ? (
					<IconButton
						icon="/airecommend.svg"
						title="AI로 초안 작성하기"
						className="flex items-center px-4 py-2 rounded-lg border !border-primary-green-600 text-primary-green-600 hover:bg-primary-green-500 hover:text-white active:bg-primary-green-600 active:text-white"
						textSize="text-xl"
					/>
				) : (
					""
				)}
			</div>
			<div className="flex w-full gap-9">
				<div className="flex flex-col w-2/5 min-w-[220px] max-w-[350px]">
					<label className="block text-xl font-semibold mb-1">영상 링크</label>
					<div className="mb-4">
						<textarea
							className="w-full h-36 bg-gray-scale-100 rounded-2xl p-2 text-lg resize-none flex flex-shrink-0"
							placeholder="업로드 하실 영상의 링크를 붙여넣기 해주세요."
							rows={3}
							value={link}
							onChange={(e) => setLink(e.target.value)}
						/>
					</div>
					<div className="mb-2 w-full h-36 bg-gray-scale-100 rounded-2xl flex items-center justify-center relative">
						<button
							type="button"
							className="absolute top-1 right-2 text-black-500"
						>
							✕
						</button>
					</div>
					<div className="flex flex-col gap-3 mb-2 justify-center align-middle text-center">
						<BaseButton title="썸네일 선택" />
						<BaseButton title="실습 자료 파일 선택" fill={false} />
						<button
							type="button"
							className="text-secondary-red-300 text-lg cursor-pointer"
						>
							<span>업로드 영상 삭제</span>
							<span className="text-lg">🗑️</span>
						</button>
					</div>
				</div>

				<div className="flex-1 flex flex-col gap-4">
					<div>
						<label className="block text-xl font-semibold mb-1">제목</label>
						<div className="flex gap-2">
							<input
								className="flex-1 bg-gray-scale-100 rounded-2xl p-2 text-black-100"
								placeholder="설치 가이드 주제 입력"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex gap-4 mt-4">
						<div className="flex-1">
							<label className="block text-xl font-semibold mb-1">대상자</label>
							<input
								className="w-full bg-gray-scale-100 rounded-2xl p-2 text-black-100"
								placeholder="예: 파이썬 개발 환경 설치가 처음인 초보자"
								value={recipient}
								onChange={(e) => setRecipient(e.target.value)}
							/>
						</div>
						<div className="flex-1">
							<label className="block text-xl font-semibold mb-1">가격</label>
							<input
								className="w-full bg-gray-scale-100 rounded-2xl p-2 text-black-100"
								placeholder="예: 199,990"
								value={price}
								onChange={(e) => setPrice(Number(e.target.value))}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-xl font-semibold mb-1">설명</label>
						<div className="flex gap-2">
							<textarea
								className="flex-1 bg-gray-scale-100 rounded-2xl p-2 text-black-100 resize-none"
								rows={6}
								placeholder="설명 내용 입력"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-xl font-semibold mb-1">
							설치 환경 체크리스트
						</label>
						<div className="flex flex-col gap-2">
							{environments.map((env, idx) => (
								<div key={idx} className="flex gap-2 items-center">
									<input
										className="flex-1 bg-gray-scale-100 rounded-2xl p-2 text-black-100"
										value={env.value}
										onChange={(e) =>
											handleEnvChange(idx, "value", e.target.value)
										}
										placeholder="환경 입력"
									/>
									<select
										className="border border-gray-scale-300 rounded p-2 text-lg"
										value={env.support}
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
						<label className="block text-xl font-semibold mb-1">
							핵심 전달이 되는 핵심 내용
						</label>
						<div className="flex flex-col gap-2">
							{coreContents.map((content, idx) => (
								<div key={idx} className="flex gap-2 items-center">
									<input
										className="flex-1 bg-gray-scale-100 rounded-2xl p-2 text-black-100"
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
						<label className="block text-xl font-semibold mb-1">태그</label>
						<div className="flex gap-2">
							<input
								className="flex-1 bg-gray-scale-100 rounded-2xl p-2 text-black-100"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && (e.preventDefault(), handleAddTag())
								}
								placeholder="태그 입력 후 Enter"
							/>
							<button
								type="button"
								className="px-3 py-1 border border-gray-scale-300 rounded text-lg cursor-pointer"
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
									<IconButton
										align="right"
										icon="/cancel.svg"
										title={tag}
										textSize="text-xl"
										className="flex items-center ml-2 cursor-pointer"
										onClick={() => handleRemoveTag(idx)}
									/>
								</span>
							))}
						</div>
					</div>

					<div className="w-[30%] flex items-end ml-auto mt-4">
						<BaseButton
							title="업로드"
							buttonType="submit"
							onClick={() => handleSubmit}
						/>
					</div>
				</div>
			</div>
		</form>
	);
};

export default VideoForm;
