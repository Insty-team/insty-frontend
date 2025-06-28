"use client";

import { ChangeEvent, useState } from "react";

import {
	BaseButton,
	BaseSearchBar,
	CommunityVideo,
} from "@/app/_components/common";
import CommunityQuestion from "@/app/_components/common/CommunityQuestion";

function CommunityTab() {
	const [value, setValue] = useState("");
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<h3 className="text-2xl font-semibold">커뮤니티</h3>
				<div className="w-[260px]">
					<BaseButton title="질문 남기기" textSize="text-2lg" />
				</div>
			</div>
			<BaseSearchBar
				value={value}
				placeholder="원하는 질문이나 키워드를 입력하세요!"
				onChange={onChange}
			/>
			{/* 내가 구매한 영상 + 질문/답변 */}
			<div className="flex gap-10 mt-10">
				<div className="flex flex-col gap-4">
					<span className="text-xl font-bold">내가 구매한 영상</span>
					{[
						{
							title: "제목",
							content: "내용",
							isSelected: true,
						},
						{
							title: "제목",
							content: "내용",
							isSelected: false,
						},
					].map((item) => (
						<CommunityVideo
							key={item.title}
							title={item.title}
							content={item.content}
							isSelected={item.isSelected}
						/>
					))}
				</div>
				<div className="flex flex-col gap-10">
					{[1, 2, 3].map((item) => (
						<CommunityQuestion key={item} />
					))}
				</div>
			</div>
		</div>
	);
}

export default CommunityTab;
