"use client";

import { ChangeEvent, useState } from "react";

import { BaseSearchBar } from "@/app/_components/common";

import BuyItem, { type BuyItemProps } from "./BuyItem";

function MyPageBuy() {
	const [value, setValue] = useState("");
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const MOCK_BUY_ITEMS: BuyItemProps[] = [
		{
			thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
			thumbnailWidth: 314,
			thumbnailHeight: 177,
			duration: "12분",
			title: "자기 전 10분 스트레칭",
			price: 0,
		},
		{
			thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
			thumbnailWidth: 314,
			thumbnailHeight: 177,
			duration: "45분",
			title: "초보자를 위한 명상 입문",
			price: 9900,
		},
		{
			thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
			thumbnailWidth: 314,
			thumbnailHeight: 177,
			duration: "30분",
			title: "마음챙김 워크샵",
			price: 5900,
		},
		{
			thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
			thumbnailWidth: 314,
			thumbnailHeight: 177,
			duration: "1시간 20분",
			title: "소셜불안 해소를 위한 심리 강의",
			price: 19900,
		},
		{
			thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
			thumbnailWidth: 314,
			thumbnailHeight: 177,
			duration: "25분",
			title: "생산성을 높이는 아침 루틴",
			price: 7900,
		},
	];

	return (
		<div className="flex flex-col w-full gap-10">
			<BaseSearchBar
				value={value}
				onChange={(e) => onChange(e)}
				placeholder="영상 제목 또는 크리에이터 이름을 입력할 수 있어요!"
			/>
			<h3 className="text-2xl">2025 / 04 / 06 에 구매한 영상</h3>
			<div className="flex gap-6 flex-wrap">
				{MOCK_BUY_ITEMS.map((item) => (
					<BuyItem key={item.title} item={item} />
				))}
			</div>
		</div>
	);
}

export default MyPageBuy;
