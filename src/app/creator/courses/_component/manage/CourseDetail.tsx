"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { GoCalendar, GoGraph, GoStopwatch } from "react-icons/go";
import { HiOutlinePercentBadge } from "react-icons/hi2";
import { LiaWonSignSolid } from "react-icons/lia";

import CommonLineChart from "@/app/creator/_component/CommonLineChart";

function CourseDetail({
	courseId,
	onBack,
}: {
	courseId: number;
	onBack: () => void;
}) {
	const totalSeconds = 13 * 60 + 24;
	const sectionCount = 6;
	const sectionLength = Math.floor(totalSeconds / sectionCount);

	const chartData = Array.from({ length: sectionCount }, (_, i) => {
		const start = i * sectionLength;
		const end =
			i === sectionCount - 1 ? totalSeconds : (i + 1) * sectionLength - 1;
		return {
			name: `${Math.floor(start / 60)}:${String(start % 60).padStart(
				2,
				"0",
			)}~${Math.floor(end / 60)}:${String(end % 60).padStart(2, "0")}`,
			value: Math.floor(Math.random() * 100),
		};
	});

	const dummyTags = ["RTX 3060", "무료", "추천", "리눅스"];
	const dummyPoints = ["썸네일", "설명란", "가격"];
	const [isExpanded, setIsExpanded] = useState(false);
	console.log(courseId);
	return (
		<div>
			<h2 className="font-bold text-3xl mb-4">콘텐츠 분석</h2>

			<div className="flex gap-8 mb-8">
				<div className="w-1/3 min-w-[220px] max-w-[350px]">
					<Image src="/dog.png" alt="dog" width={350} height={220} />
				</div>
				<div className="flex-1 flex flex-col justify-center">
					<div className="text-2xl font-bold mb-2 text-black-400">
						영상 제목 영상 제목 영상 제목 영상 제목 영상 제목
					</div>
					<div className="flex flex-wrap gap-1 mb-2">
						{dummyTags.map((tag) => (
							<span
								key={tag}
								className="bg-gray-scale-200 text-black-100 rounded-full px-4 py-1 text-2lg"
							>
								{tag}
							</span>
						))}
					</div>
					<div className="flex gap-4 text-gray-500 text-xl mb-2">
						<span className="flex items-center gap-2">
							<GoCalendar className="size-8" />
							업로드 날짜 업로드 날짜:{" "}
							<span className=" text-primary-blue-600">
								{dayjs().format("YYYY년 MM월 DD일")}
							</span>
						</span>
						<span className="flex items-center gap-2">
							<LiaWonSignSolid className="size-8" />
							가격: <span className=" text-primary-blue-600">199,999원</span>
						</span>
					</div>
					<div
						className={`text-black-400 text-2xl transition-all duration-300 ${
							isExpanded ? "" : "line-clamp-2"
						}`}
						style={{
							maxHeight: isExpanded ? "none" : "3.5em",
							overflow: "hidden",
						}}
					>
						영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상
						설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명
						영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상
						설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명
						영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상
						설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명 영상 설명
					</div>
					<button
						className="mt-2 text-primary-blue-600 text-lg text-end mr-6"
						onClick={() => setIsExpanded((prev) => !prev)}
					>
						{isExpanded ? "접기" : "더보기"}
					</button>
				</div>
			</div>

			<div className="flex gap-8">
				<div className="flex-[7] min-w-0">
					<div className="mb-8">
						<div className="font-bold mb-12 text-2xl">이탈 구간 시각화</div>
						<CommonLineChart
							data={chartData}
							tooltipLabel="이탈률"
							tooltipUnit="%"
							height={400}
						/>
					</div>

					<div className="mt-12">
						<div className="font-semibold mb-9 text-2xl">AI 분석 요약</div>
						<div className={`text-black-400 text-2xl`}>
							이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이
							영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상
							잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음
							이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이
							영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상
							잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음
							이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이
							영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상
							잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음
							이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이
							영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상
							잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음
							이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음 이
							영상 잘했음 이 영상 잘했음 이 영상 잘했음 이 영상 잘했음
						</div>
					</div>
				</div>

				<div className="flex-[3] min-w-[260px] max-w-[350px] flex flex-col gap-9">
					<div>
						<div className="font-bold mb-9 text-2xl">추천 개선 포인트</div>
						<div className="flex flex-col gap-6">
							{dummyPoints.map((point, idx) => (
								<div key={point} className="flex items-center gap-2">
									<div className="relative w-[80px] h-[65px] flex items-center justify-center">
										<Image
											src="/rank.svg"
											alt="랭킹"
											className="object-cover"
											fill
										/>
										<span className="absolute inset-0 flex items-center justify-center text-2xl text-black-400 -translate-y-[10%] -translate-x-[-3%]">
											{idx + 1}
										</span>
									</div>
									<span className="text-2xl text-black-400 -translate-y-[20%] ml-9">
										{point}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="mt-12">
						<div className="font-bold mb-9 text-2xl">핵심 지표</div>
						<div className="flex flex-col gap-3">
							<div className="flex flex-col justify-between items-center gap-2 p-3 border !border-primary-blue-600 rounded-lg w-[278px] h-[143px]">
								<div className="flex items-center gap-2">
									<GoGraph className="size-9" />
									<span className="text-2xl font-medium">조회수</span>
								</div>
								<span className="text-primary-blue-600 text-2xl font-semibold">
									999,999,999회
								</span>
							</div>
							<div className="flex flex-col justify-between items-center gap-2 p-3 border !border-primary-blue-600 rounded-lg w-[278px] h-[143px]">
								<div className="flex items-center gap-2">
									<HiOutlinePercentBadge className="size-9" />
									<span className="text-2xl font-medium">구매율</span>
								</div>
								<span className="text-primary-blue-600 text-2xl font-semibold">
									38%
								</span>
							</div>
							<div className="flex flex-col justify-between items-center gap-2 p-3 border !border-primary-blue-600 rounded-lg w-[278px] h-[143px]">
								<div className="flex items-center gap-2">
									<GoStopwatch className="size-9" />
									<span className="text-2xl font-medium">평균 시청 시간</span>
								</div>
								<span className="text-primary-blue-600 text-2xl font-semibold">
									38분
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8 flex justify-end">
				<button
					onClick={onBack}
					className="px-6 py-2 bg-primary-blue-600 text-white rounded"
				>
					뒤로가기
				</button>
			</div>
		</div>
	);
}

export default CourseDetail;
