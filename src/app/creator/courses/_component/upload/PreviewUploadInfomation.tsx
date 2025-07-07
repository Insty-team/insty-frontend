"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiFile } from "react-icons/fi";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import VideoPlayer from "@/app/_components/common/VideoPlayer";
import { postVectorStatus } from "@/app/api/ai/video";
import { postCourse } from "@/app/api/backend";
import { useUserStore, useVideoUploadStore } from "@/app/stores";
import { UploadformData } from "@/app/types/course";
import { formatTime } from "@/app/utils/date";

interface PreviewUploadInfomationProps {
	data: UploadformData;
	onEdit: () => void;
}

function PreviewUploadInfomation({
	data,
	onEdit,
}: PreviewUploadInfomationProps) {
	const [videoDuration, setVideoDuration] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const { reset } = useVideoUploadStore();
	const { user: userData } = useUserStore();

	const router = useRouter();

	const handleSubmitCourseForm = async () => {
		setIsUploading(true);
		try {
			const { thumbnailFile, practiceFiles, ...rest } = data;
			const formData = new FormData();

			if (thumbnailFile) {
				formData.append("thumbnail", thumbnailFile);
			}

			if (practiceFiles) {
				practiceFiles.forEach((file) => {
					formData.append("practiceFile", file);
				});
			}

			const courseData = { ...rest };
			delete courseData.videoFile;
			formData.append("courseData", JSON.stringify(courseData));

			console.log("썸네일 파일:", thumbnailFile);
			console.log("실습 파일들:", practiceFiles);
			console.log("나머지 데이터:", courseData);

			await postCourse(
				courseData,
				thumbnailFile ?? null,
				practiceFiles ?? null,
			);

			try {
				if (courseData.videoUuid) {
					const res = await postVectorStatus(courseData.videoUuid);
					if (res && res.data) {
						Swal.fire({
							title: "강의 업로드 완료",
							icon: "success",
							text: "강의 업로드가 완료되었습니다.",
							confirmButtonText: "확인",
							confirmButtonColor: "#6ead79",
							timer: 30000,
							timerProgressBar: true,
						}).then(() => {
							reset();
							router.push("/creator/courses");
						});
					}
				}
			} catch (error) {
				console.log(error);
				Swal.fire({
					title: "서버 내부 오류가 발생했습니다.",
					icon: "error",
					text: "업로드를 다시 시도해주세요.",
					confirmButtonText: "확인",
					confirmButtonColor: "#ff4f64",
				}).then(() => {
					reset();
					router.push("/creator/courses");
				});
			}
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "업로드 실패",
				icon: "error",
				text: "강의 업로드에 실패했습니다. 다시 시도해주세요.",
				confirmButtonText: "확인",
				confirmButtonColor: "#ff4f64",
			});
		} finally {
			setIsUploading(false);
		}
	};

	if (!data) return <div>데이터가 없습니다.</div>;

	return (
		<>
			{isUploading && (
				<div className="fixed inset-0 bg-gray-scale-300 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white w-[500px] h-auto rounded-2xl p-8 flex flex-col items-center gap-4">
						<Loading width={60} height={60} />
						<p className="text-2xl font-semibold text-black-300">
							강의 업로드 중...
						</p>
						<p className="text-lg text-black-300">잠시만 기다려주세요</p>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-8 items-stretch relative">
				<div className="font-bold text-2xl mt-10">{data.title}</div>

				<div className="flex gap-4 w-full">
					{data.videoFile ? (
						<VideoPlayer
							url={URL.createObjectURL(data.videoFile)}
							width="w-[600px]"
							onDurationChange={setVideoDuration}
						/>
					) : (
						<div className="w-[600px] h-auto bg-gray-200 rounded-2xl flex items-center justify-center">
							<span className="text-gray-400">영상을 재생할 수 없습니다.</span>
						</div>
					)}

					<div className="flex flex-col gap-2 flex-1 justify-between ml-2">
						<div className="flex gap-2 flex-wrap">
							{data.tags.map((tag) => (
								<span
									key={tag}
									className="px-3 py-1 bg-gray-scale-200 rounded-full text-2lg text-black-100"
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex flex-col gap-4">
							<div className="flex gap-2 items-center aspect-auto">
								<Image src="/profile.svg" alt="user" width={48} height={48} />
								<span className="text-black-100 text-2xl">
									{userData?.nickname}
								</span>
							</div>
							<div className="flex gap-2 items-center">
								<Image src="/user.svg" alt="user" width={36} height={36} />
								<span className="text-black-300 text-2xl">
									{data.targetAudience}
								</span>
							</div>

							<div className="flex gap-2 items-center">
								<Image src="/file.svg" alt="file" width={36} height={36} />
								<span className="text-black-300 text-2xl">
									{data.practiceFiles ? "실습 자료 포함" : "실습 자료 미포함"}
								</span>
							</div>
							{data.practiceFiles && (
								<div className="flex flex-col ml-6 text-2lg">
									{data.practiceFiles.map((file) => {
										const url = URL.createObjectURL(file);
										return (
											<a
												key={file.name}
												href={url}
												download={file.name}
												className="flex items-center gap-2 hover:underline cursor-pointer"
												onClick={() => {
													setTimeout(() => URL.revokeObjectURL(url), 1000);
												}}
											>
												<FiFile />
												{file.name}
											</a>
										);
									})}
								</div>
							)}
							<div className="flex gap-2 items-center">
								<Image src="/time.svg" alt="clock" width={36} height={36} />
								<span className="text-black-300 text-2xl">
									{videoDuration > 0 ? formatTime(videoDuration) : ""}
								</span>
							</div>
						</div>
						<div className="flex gap-4 pt-8">
							<BaseButton
								title="수정하기"
								fill={false}
								onClick={onEdit}
								disabled={isUploading}
							/>
							<BaseButton
								title="업로드 진행하기"
								onClick={handleSubmitCourseForm}
								disabled={isUploading}
							/>
						</div>
					</div>
				</div>

				<div className="flex gap-8 mt-8">
					<div className="flex-1">
						<div className="font-semibold text-3xl">
							이 영상이 다루는 핵심 내용
						</div>
						<ul className="list-disc pl-5 space-y-4 mt-8 text-2xl">
							{data.keyPoints.map((content, idx) => (
								<li key={idx}>{content}</li>
							))}
						</ul>
					</div>
					<div className="flex-1">
						<div className="font-semibold text-3xl">설치 환경 체크리스트</div>
						<ul className="space-y-1 mt-8 text-2xl">
							{data.installEnvChecklist.map((env, idx) => (
								<li key={idx} className="flex items-center gap-2">
									{env.isSupported ? (
										<Image
											src="/ableEnvironment.svg"
											alt="ableEnvironment"
											width={48}
											height={48}
										/>
									) : (
										<Image
											src="/disableEnvironment.svg"
											alt="disableEnvironment"
											width={48}
											height={48}
										/>
									)}
									<span className="ml-4">{env.content}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default PreviewUploadInfomation;
