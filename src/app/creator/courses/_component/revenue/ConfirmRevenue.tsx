"use client";
import dayjs from "dayjs";
import { LiaWonSignSolid } from "react-icons/lia";

import { BaseButton } from "@/app/_components/common";
import CommonLineChart from "@/app/creator/_component/CommonLineChart";

function ConfirmRevenue() {
	const months = Array.from({ length: 6 }, (_, i) =>
		dayjs()
			.subtract(5 - i, "month")
			.format("YYYY.MM"),
	);
	const chartData = months.map((month) => ({
		name: month,
		value: Math.floor(50000 + Math.random() * 100000),
	}));

	const totalRevenue = 1234567;
	const withdrawable = 1234567;

	const history = Array.from({ length: 10 }).map(() => ({
		title: "영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목",
		info: `10개 판매 / 10,000원`,
	}));

	return (
		<div className="w-full">
			<h1 className="font-bold text-3xl mb-8">정산 / 수익</h1>

			<div className="flex gap-12">
				<div className="flex-1">
					<div className="mb-8">
						<div className="flex items-center gap-2 mb-2">
							<LiaWonSignSolid className="size-9" />
							<span className="text-black-400 text-2xl">누적 수익</span>
						</div>
						<div className="text-4xl font-bold text-primary-green-600 mb-2">
							{totalRevenue.toLocaleString()} 원
						</div>
					</div>

					<div className="mb-8">
						<div className="font-semibold text-2xl mt-16 mb-6">
							월 수익 그래프
						</div>
						<div className="bg-white rounded-xl border border-gray-100 p-2 flex items-center">
							<CommonLineChart
								data={chartData}
								height={280}
								yAxisLabel=""
								tooltipLabel="수익"
								tooltipUnit="원"
							/>
						</div>
					</div>

					<div className="flex items-center gap-4 mt-10">
						<div>
							<div className="text-black-400 text-2xl mb-10">
								출금 가능 금액
							</div>
							<div className="flex items-center gap-4">
								<div className="text-2xl font-bold text-primary-green-600">
									{withdrawable.toLocaleString()} 원
								</div>
								<div>
									<BaseButton
										title="출금 신청"
										onClick={() => {}}
										textSize="text-xl"
										className="px-8 py-2"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="flex-1">
					<div className="font-bold text-3xl mb-4">거래 내역</div>
					<div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
						{history.map((item, idx) => (
							<div
								key={idx}
								className="border border-gray-100 rounded-lg px-4 py-2 flex flex-col text-xl"
							>
								<span className="truncate mb-1">{item.title}</span>
								<span className="text-primary-green-600 font-semibold text-xl">
									{item.info}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConfirmRevenue;
