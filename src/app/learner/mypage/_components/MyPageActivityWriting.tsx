"use client";

import { ChangeEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { HiPencil } from "react-icons/hi2";
import Swal from "sweetalert2";

import { BaseSearchBar } from "@/app/_components/common";
import { BaseButton } from "@/app/_components/common";
import { getFormattedDate } from "@/app/utils";

function MyPageActivityWriting() {
	const [value, setValue] = useState("");
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const handleUpdateQuestion = () => {};

	const handleDeleteQuestion = () => {
		Swal.fire({
			title: "삭제하시겠습니까?",
			text: "삭제 후에는 되돌릴 수 없습니다.",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "삭제하기",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				// TODO: API 호출
				console.log("삭제 진행");
			}
		});
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
					/>
				</div>
			</div>

			<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full">
				{mockData.map((item) => (
					<div
						key={item.title}
						className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm cursor-pointer flex flex-col justify-between h-[300px] hover:shadow-md transition-shadow"
					>
						<div className="flex flex-col gap-2 overflow-hidden">
							<h4 className="text-xl font-semibold text-gray-900 line-clamp-1 leading-tight py-1">
								{item.title}
							</h4>
							<div className="text-lg line-clamp-2 text-gray-700">
								{item.content}
							</div>
							<div className="text-md text-gray-500">
								{getFormattedDate(item.createdAt)}
							</div>
							<div className="inline-flex items-center gap-2 bg-primary-green-200 rounded-full px-3 py-1 w-fit text-sm text-primary-green-600">
								<FaMessage />
								<span className="font-semibold">댓글 {item.replies}개</span>
							</div>
						</div>

						<div className="flex h-9 gap-4 mt-4">
							<BaseButton
								title="수정"
								icon={<HiPencil className="text-gray-50" />}
								className="!rounded-lg"
								alignIcon="left"
								onClick={() => handleUpdateQuestion()}
							/>
							<BaseButton
								title="삭제"
								icon={<FaTrash className="text-gray-400" />}
								className={"!bg-gray-100 !text-gray-400 !rounded-lg"}
								alignIcon="left"
								onClick={() => handleDeleteQuestion()}
							/>
						</div>
					</div>
				))}
			</div>
			{/* 페이지네이션 붙이기 */}
		</div>
	);
}

export default MyPageActivityWriting;

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
		content:
			"정적 사이트 생성을 중심으로 블로그 구축 과정을 공유합니다. 정적 사이트 생성을 중심으로 블로그 구축 과정을 공유합니다. 정적 사이트 생성을 중심으로 블로그 구축 과정을 공유합니다.",
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
		title: "웹 성능 개선을 위한 Lazy Loading3",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loading2",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loading1",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loadingdd",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loadingz",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loadingg",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
	{
		title: "웹 성능 개선을 위한 Lazy Loadingq",
		content: "이미지, 컴포넌트의 지연 로딩 적용 사례를 소개합니다.",
		createdAt: "2025-05-15T17:40:00Z",
		replies: 2,
		isNew: false,
	},
];
