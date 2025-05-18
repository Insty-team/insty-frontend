"use client";
import { getLabels } from "@/app/utils/date";
import Image from "next/image";
import { useState } from "react";
import dayjs from "dayjs";
import CommonLineChart from "../_component/CommonLineChart";

function CreatorDashboard() {
	const [period, setPeriod] = useState("1개월");
	const labels = getLabels(period as "1개월" | "6개월" | "1년");

	const revenueData = labels.map((label, idx) => ({
		name: label,
		fullLabel:
			period === "1년"
				? dayjs()
						.subtract(11 - idx, "month")
						.format("YY년 M월")
				: label,
		value: Math.floor(Math.random() * 100000),
	}));

	const viewData = labels.map((label, idx) => ({
		name: label,
		fullLabel:
			period === "1년"
				? dayjs()
						.subtract(11 - idx, "month")
						.format("YY년 M월")
				: label,
		value: Math.floor(Math.random() * 100000),
	}));

	return (
		<div className="flex w-full max-w-[1400px] mx-auto mt-16 gap-8">
			<aside className="flex-[4] min-w-0 flex flex-col gap-8">
				<div>
					<h2 className="text-3xl font-bold mb-12">대시보드</h2>
					<div className="text-black-300 text-2xl font-semibold mb-2">필터</div>
					<select
						className="w-[60%] border border-gray-scale-400 rounded px-2 py-2 mb-6"
						onChange={(e) => setPeriod(e.target.value)}
						value={period}
					>
						<option>1개월</option>
						<option>6개월</option>
						<option>1년</option>
					</select>
					<div className="mt-6">
						<div className="text-black-400 text-2xl font-semibold mb-2">
							크리에이터님의 인기 콘텐츠 TOP 3
						</div>
						<ol className="list-decimal list-inside text-2xl text-black-300">
							<li>주제 1 주제 1 주제 1</li>
							<li>주제 2 주제 2 주제 2</li>
							<li>주제 3 주제 3 주제 3</li>
						</ol>
					</div>
					<div className="mt-6">
						<div className="text-black-400 text-2xl font-semibold mb-2">
							이런 주제는 어떠신가요?
						</div>
						<ol className="list-decimal list-inside text-2xl text-black-300">
							<li>주제 1 주제 1 주제 1</li>
							<li>주제 2 주제 2 주제 2</li>
							<li>주제 3 주제 3 주제 3</li>
						</ol>
					</div>
					<div className="mt-6">
						<button className="w-[60%] bg-primary-blue-600 text-white hover:bg-primary-blue-700 py-2 rounded mb-2 cursor-pointer font-semibold flex items-center justify-center gap-2">
							영상 업로드 하러 가기{" "}
							<Image
								src="/fileUpload.svg"
								alt="파일 업로드"
								width={20}
								height={20}
							/>
						</button>
						<button className="w-[60%] border border-primary-blue-600 text-primary-blue-600 hover:bg-primary-blue-600 hover:text-white py-2 rounded cursor-pointer font-semibold">
							커뮤니티 바로 가기
						</button>
					</div>
				</div>
			</aside>

			<section className="flex-[8] min-w-0 flex flex-col gap-8">
				<div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
					<div className="flex-1">
						<div className="text-2xl font-bold mb-2">수익</div>
						<div className="flex w-full gap-8 items-start">
							<div className="flex-1 min-w-0">
								<CommonLineChart
									data={revenueData}
									yAxisLabel=""
									tooltipLabel="수익"
									tooltipUnit="원"
								/>
							</div>
						</div>
					</div>
					<div className="w-48 flex-shrink-0 flex flex-col gap-2 justify-center">
						<div className="text-lg text-black-400">총 수익</div>
						<div className="font-bold text-primary-blue-600 text-lg">
							₩ 999,999
						</div>
						<div className="text-lg text-black-400">이번 달 수익</div>
						<div className="font-bold text-primary-blue-600 text-lg">
							₩ 999,999
						</div>
						<div className="text-lg text-black-400">이번 주 수익</div>
						<div className="font-bold text-primary-blue-600 text-lg">
							₩ 999,999
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
					<div className="flex-1">
						<div className="text-2xl font-bold mb-2">조회수</div>
						<div className="flex w-full gap-8 items-start">
							<div className="flex-1 min-w-0">
								<CommonLineChart
									data={viewData}
									yAxisLabel=""
									tooltipLabel="총 조회수"
									tooltipUnit="회"
								/>
							</div>
						</div>
					</div>
					<div className="w-48 flex-shrink-0 flex flex-col gap-2 justify-center">
						<div className="text-lg text-black-400">총 조회수</div>
						<div className="font-bold text-primary-blue-600 text-lg flex items-center gap-2">
							<Image
								src="/userGraph.svg"
								alt="사용자 그래프"
								width={20}
								height={20}
							/>{" "}
							999,999
						</div>
						<div className="text-lg text-black-400">이번 달 조회수</div>
						<div className="font-bold text-primary-blue-600 text-lg flex items-center gap-2">
							<Image
								src="/userGraph.svg"
								alt="사용자 그래프"
								width={20}
								height={20}
							/>{" "}
							999,999
						</div>
						<div className="text-lg text-black-400">이번 주 조회수</div>
						<div className="font-bold text-primary-blue-600 text-lg flex items-center gap-2">
							<Image
								src="/userGraph.svg"
								alt="사용자 그래프"
								width={20}
								height={20}
							/>{" "}
							999,999
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default CreatorDashboard;
