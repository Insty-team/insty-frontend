"use client";
import { BaseButton } from "@/app/_components/common";
import Image from "next/image";

export type BuyItemProps = {
	title: string;
	price: number;
	duration: string;
	thumbnail: string;
	thumbnailWidth: number;
	thumbnailHeight: number;
};

function BuyItem({ item }: { item: BuyItemProps }) {
	return (
		<div className="flex flex-col w-[314px] mb-10">
			{/* 서버에서 데이터 가져오면 Next.js Image 변경 필요 */}
			<div className="relative w-full h-[177px]">
				<img
					src={item.thumbnail}
					alt={item.title}
					width={item.thumbnailWidth}
					height={item.thumbnailHeight}
					className="w-full h-full rounded-2xl bg-gray-300 object-cover"
				/>
				<span className="absolute bottom-2 right-2 text-white text-sm px-2 py-0.5">
					{item.duration}
				</span>
			</div>
			<div className="text-xl font-medium max-h-[64px] mt-2.5">
				{item.title}
			</div>
			<span className="text-21g mt-2">₩{item.price}</span>
			<div className="flex flex-col gap-2 mt-4">
				<BaseButton title="영상보기" />
				<BaseButton
					title="실습 자료 다운로드"
					fill
					className="!bg-gray-100 !text-gray-500"
				/>
				<button className="flex w-full justify-center">
					<Image src="/refund.svg" alt="refund" width={20} height={20} />
					<span className="text-black-100">환불 요청</span>
				</button>
			</div>
		</div>
	);
}

export default BuyItem;
