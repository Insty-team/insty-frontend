"use client";
import { BaseSearchBar } from "@/app/_components/common";
import { ChangeEvent, useState } from "react";
import ActivityWritingBookmarkItem from "./ActivityWritingBookmarkItem";

const mockData = [
	{
		title: "Vue와 React 비교 분석",
		content:
			"두 프레임워크의 성능, 커뮤니티, 확장성 측면에서의 차이를 정리했습니다.",
		createdAt: "2025-06-01T10:30:00Z",
		replies: 3,
		isNew: true,
	},
	{
		title: "Next.js로 블로그 만들기",
		content: "정적 사이트 생성을 중심으로 블로그 구축 과정을 공유합니다.",
		createdAt: "2025-05-28T09:00:00Z",
		replies: 7,
		isNew: false,
	},
	{
		title: "TailwindCSS 팁 모음",
		content: "자주 사용하는 유틸리티 클래스와 레이아웃 패턴을 정리했습니다.",
		createdAt: "2025-05-25T14:15:00Z",
		replies: 1,
		isNew: true,
	},
	{
		title: "Firebase 인증 연동기",
		content: "소셜 로그인 및 이메일 인증 과정을 다루고 있습니다.",
		createdAt: "2025-05-20T08:20:00Z",
		replies: 5,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loading",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
];

function MyPageActivityWriting() {
	const [value, setValue] = useState("");
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	return (
		<div className="flex flex-col w-full gap-10">
			<div className="flex justify-between items-start">
				<h3 className="text-2xl">내가 쓴 글</h3>
				<div className="w-[600px]">
					<BaseSearchBar
						value={value}
						onChange={(e) => onChange(e)}
						placeholder="게시글의 제목을 입력해 보세요!"
						className="w-[600px]"
					/>
				</div>
			</div>
			<div className="flex flex-wrap gap-10 w-full">
				{mockData.map((item) => (
					<ActivityWritingBookmarkItem key={item.title} item={item} />
				))}
			</div>
		</div>
	);
}

export default MyPageActivityWriting;
