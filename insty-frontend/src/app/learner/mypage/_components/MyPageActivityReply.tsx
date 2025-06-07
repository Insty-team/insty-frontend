"use client";

import { ChangeEvent, useState } from "react";

import { BaseSearchBar } from "@/app/_components/common";

import ActivityReplyItem from "./ActivityReplyItem";

const mockData = [
	{
		title: "프론트엔드 성능 최적화",
		content: "웹사이트의 로딩 속도를 개선한 경험을 공유합니다.",
		createdAt: "2025-06-01T12:00:00Z",
		replyContent:
			"정리 너무 잘 해주셨네요! 이미지 최적화 관련해서도 더 알고 싶어요.",
	},
	{
		title: "React 상태관리 도구 비교",
		content: "Redux, Recoil, Zustand 각각의 장단점을 정리했습니다.",
		createdAt: "2025-05-29T09:30:00Z",
		replyContent:
			"Zustand는 처음 들어봤는데 흥미롭네요. 자세한 설명 감사합니다!",
	},
	{
		title: "웹 접근성 개선 사례",
		content: "실제 프로젝트에서 시맨틱 태그와 ARIA를 적용했던 경험입니다.",
		createdAt: "2025-05-27T15:45:00Z",
		replyContent: "접근성은 항상 어려운데 참고가 많이 됐어요. 감사해요!",
	},
	{
		title: "Tailwind CSS 그리드 레이아웃 팁",
		content: "반응형 레이아웃에서 자주 쓰는 Tailwind 클래스 모음입니다.",
		createdAt: "2025-05-25T08:10:00Z",
		replyContent: "덕분에 빠르게 그리드 구성할 수 있었어요!",
	},
	{
		title: "Next.js App Router 마이그레이션기",
		content: "Pages Router에서 App Router로 이전한 기록입니다.",
		createdAt: "2025-05-20T20:00:00Z",
		replyContent: "저도 최근에 마이그레이션했는데 공감되는 부분이 많네요.",
	},
];

function MyPageActivityReply() {
	const [value, setValue] = useState("");
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	return (
		<div className="flex flex-col w-full gap-10">
			<div className="flex justify-between items-start">
				<h3 className="text-2xl">내가 댓글을 작성한 게시글</h3>
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
					<ActivityReplyItem key={item.title} item={item} />
				))}
			</div>
		</div>
	);
}

export default MyPageActivityReply;
