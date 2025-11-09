"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { HiPencil } from "react-icons/hi2";
import Swal from "sweetalert2";

import { BaseButton, BaseSearchBar } from "@/app/_components/common";
import { deleteCommunityQuestion } from "@/app/api/backend";
import { ANSWER_STATUS_OPTIONS } from "@/app/constants";
import { useGetMyQuestion } from "@/app/queries";
import { MyQuestionItem } from "@/app/types/community";
import { getFormattedDate } from "@/app/utils";

function MyPageActivityWriting() {
	const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
	const [page, setPage] = useState(1);
	const pageSize = 9;
	const [statuses, setStatuses] = useState<string[]>([]); // 상태 필터
	const [items, setItems] = useState<MyQuestionItem[]>([]); // 누적된 질문 목록
	const [triggerSearch, setTriggerSearch] = useState(false);
	const router = useRouter();

	const params = {
		page,
		pageSize,
		keyword: searchKeyword || undefined,
		orderBy: "createdAt",
		order: "desc",
		statuses: statuses.length > 0 ? statuses : undefined,
	};

	const { data, isLoading, error, refetch } = useGetMyQuestion(
		params,
		!searchKeyword || triggerSearch,
	);

	const totalPages = data?.pagination?.totalPages ?? 0;

	useEffect(() => {
		if (data?.items) {
			if (page === 1) {
				setItems(data.items); // 새 검색/필터이면 덮어쓰기
			} else {
				setItems((prev) => [...prev, ...data.items]);
			}
		}
	}, [data?.items, page]);

	// 검색어 입력
	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchKeyword(e.target.value);
		setTriggerSearch(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			setPage(1);
			setTriggerSearch(true);
			refetch();
		}
	};

	// 상태 필터
	const handleStatusFilter = (status: string) => {
		const newStatuses = statuses.includes(status)
			? statuses.filter((s) => s !== status)
			: [...statuses, status];
		setStatuses(newStatuses);
		setPage(1);
		setTriggerSearch(true);
		refetch();
	};

	// 질문 수정
	const handleUpdateQuestion = (questionId: number) => {
		router.push(`/learner/community/question/update/${questionId}`);
	};

	// 질문 삭제
	const handleDeleteQuestion = (questionId: number) => {
		Swal.fire({
			title: "정말 삭제하시겠습니까?",
			text: "삭제 후에는 되돌릴 수 없습니다.",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "삭제하기",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await deleteCommunityQuestion(questionId);
					Swal.fire("삭제 완료", "질문이 삭제되었습니다.", "success");
					setPage(1);
					refetch();
				} catch (error) {
					Swal.fire("삭제 실패", "문제가 발생했습니다.", "error");
					console.error(error);
				}
			}
		});
	};

	// 더보기
	const handleLoadMore = () => {
		if (page < totalPages) {
			setPage((prev) => prev + 1);
			refetch();
		}
	};

	// 상세 이동
	const handleNavigateDetail = (questionId: number) => {
		router.push(`/learner/community/question/${questionId}`);
	};

	if (isLoading && page === 1) return <div>로딩중...</div>;
	if (error) return <div>에러 발생</div>;

	return (
		<div className="flex flex-col w-full gap-10">
			{/* 검색 */}
			<div className="flex justify-between items-start">
				<h3 className="text-2xl">내가 쓴 글</h3>
				<div className="w-[600px]">
					<BaseSearchBar
						value={searchKeyword}
						onChange={onChangeSearch}
						onKeyDown={handleKeyDown}
						placeholder="게시글의 제목을 입력해 보세요!"
					/>
				</div>
			</div>

			{/* 상태 필터 */}
			<div className="flex gap-3">
				{ANSWER_STATUS_OPTIONS.map((status) => (
					<button
						key={status.value}
						className={`px-4 py-2 rounded-lg border ${
							statuses.includes(status.value)
								? "bg-primary-green-200 text-primary-green-600 border-primary-green-300"
								: "bg-white text-gray-600 border-gray-300"
						}`}
						onClick={() => handleStatusFilter(status.value)}
					>
						{status.label}
					</button>
				))}
			</div>

			{/* 질문 목록 */}
			<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full">
				{items.length ? (
					items.map((item) => (
						<div
							key={item.questionId}
							className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm cursor-pointer flex flex-col justify-between h-[300px] hover:shadow-md transition-shadow"
							onClick={() => handleNavigateDetail(item.questionId)}
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
									<span className="font-semibold">
										댓글 {item.answerCount}개
									</span>
								</div>
							</div>

							<div
								className="flex h-9 gap-4 mt-4 z-10"
								onClick={(e) => e.stopPropagation()}
							>
								<BaseButton
									title="수정"
									icon={<HiPencil className="text-gray-50" />}
									className="!rounded-lg"
									alignIcon="left"
									onClick={() => handleUpdateQuestion(item.questionId)}
								/>
								<BaseButton
									title="삭제"
									icon={<FaTrash className="text-gray-400" />}
									className="!bg-gray-100 !text-gray-400 !rounded-lg"
									alignIcon="left"
									onClick={() => handleDeleteQuestion(item.questionId)}
								/>
							</div>
						</div>
					))
				) : (
					<div className="col-span-full text-center text-gray-500 py-20">
						아직 질문이 없습니다.
					</div>
				)}
			</div>

			{/* 더보기 버튼 */}
			{page < totalPages && (
				<div className="flex justify-center mt-8">
					<button
						className="flex items-center justify-center rounded-2xl border-2 py-4 px-6 cursor-pointer hover:bg-gray-50 transition-colors"
						onClick={handleLoadMore}
					>
						답변 더보기 ({page} / {totalPages})
					</button>
				</div>
			)}
		</div>
	);
}

export default MyPageActivityWriting;
