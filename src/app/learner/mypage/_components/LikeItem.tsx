"use client";

import { GoHeart, GoHeartFill } from "react-icons/go";

import { BaseButton } from "@/app/_components/common";

export type LikeItemProps = {
	title: string;
	price: number;
	duration: string;
	category: string;
	name: string;
	thumbnail: string;
	thumbnailWidth: number;
	thumbnailHeight: number;
	isLike: boolean;
};

function LikeItem({ item }: { item: LikeItemProps }) {
	return (
		<div className="flex flex-col w-[314px] mb-10">
			<div className="relative w-full h-[177px]">
				{/* 서버에서 데이터 받아온 이후 Image로 사용해야 함 */}
				<img
					src={item.thumbnail}
					alt={item.title}
					width={item.thumbnailWidth}
					height={item.thumbnailHeight}
					className="w-full h-full rounded-2xl bg-gray-300 object-cover"
				/>
				<span className="absolute bottom-3 right-3 text-white text-sm px-2 py-0.5">
					{item.duration}
				</span>
				<button className="absolute top-3 right-4 text-xl cursor-pointer">
					{item.isLike ? (
						<GoHeartFill className="text-primary-green-500" />
					) : (
						<GoHeart />
					)}
				</button>
			</div>
			<div className="text-xl font-medium max-h-[64px] mt-2.5 truncate">
				{item.title}
			</div>
			<span className="text-21g mt-2 text-primary-blue-600">₩{item.price}</span>
			<span className="text-21g text-gray-500">
				{`${item.category}•${item.name}`}
			</span>
			<div className="mt-4">
				<BaseButton title="구매하기" />
			</div>
		</div>
	);
}

export default LikeItem;
