"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import VideoPlayer from "@/app/_components/common/VideoPlayer";
import { postCourse } from "@/app/api/backend";
import { useVideoUploadStore } from "@/app/stores";
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
	const { reset } = useVideoUploadStore();

	const router = useRouter();

	const handleSubmitCourseForm = async () => {
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

			Swal.fire({
				title: "강의 업로드 완료",
				icon: "success",
				text: "강의 업로드가 완료되었습니다.",
				confirmButtonText: "확인",
				confirmButtonColor: "#6ead79",
			}).then(() => {
				reset();
				router.push("/creator/courses");
			});
		} catch (error) {
			console.log(error);
		}
	};

	if (!data) return <div>데이터가 없습니다.</div>;

	return (
		<div className="flex flex-col gap-8 items-stretch relative">
			<div className="font-bold text-2xl mt-10">{data.title}</div>

			<div className="flex gap-4 w-full">
				{data.videoFile ? (
					<VideoPlayer
						url={URL.createObjectURL(data.videoFile)}
						width="w-[800px]"
						onDurationChange={setVideoDuration}
					/>
				) : (
					<div className="w-[800px] h-auto bg-gray-200 rounded-2xl flex items-center justify-center">
						<span className="text-gray-400">영상 미리보기</span>
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
							<span className="text-black-100 text-2xl">크리에이터 이름</span>
						</div>
						<div className="flex gap-2 items-center">
							<Image src="/user.svg" alt="user" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{data.targetAudience}
							</span>
						</div>

						<div className="flex gap-2 items-center">
							<Image src="/file.svg" alt="file" width={36} height={36} />
							<span className="text-black-300 text-2xl">실습 자료 포함</span>
						</div>

						<div className="flex gap-2 items-center">
							<Image src="/time.svg" alt="clock" width={36} height={36} />
							<span className="text-black-300 text-2xl">
								{videoDuration > 0 ? formatTime(videoDuration) : ""}
							</span>
						</div>
					</div>
					<div className="flex gap-4 mt-auto pt-8">
						<BaseButton title="수정하기" fill={false} onClick={onEdit} />
						<BaseButton
							title="업로드 진행하기"
							onClick={handleSubmitCourseForm}
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
	);
}

export default PreviewUploadInfomation;
