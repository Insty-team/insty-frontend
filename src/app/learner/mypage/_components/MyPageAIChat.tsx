"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

import {
	BaseButton,
	BaseSearchBar,
	BaseSelect,
} from "@/app/_components/common";
import { useGetAIChatHistoryQuery } from "@/app/queries";

function MyPageAIChat() {
	const DATE_OPTIONS = [
		"모든 날짜",
		"지난 1일",
		"지난 1주",
		"지난 1개월",
		"지난 1년",
	];

	// 히스토리 검색/필터 영역 관련
	const [searchText, setSearchText] = useState("");
	const [applySearchQuery, setApplySearchQuery] = useState("");

	const [selectedDateOption, setSelectedDateOption] = useState(DATE_OPTIONS[0]);
	const [applyDateOption, setApplyDateOption] = useState("");

	// 히스토리 검색 결과 영역 관련
	const [isPanelClosed, setIsPanelClosed] = useState(false);

	// 히스토리 데이터 조회	쿼리
	const { data: history } = useGetAIChatHistoryQuery({
		date: applyDateOption,
		keyword: applySearchQuery,
	});

	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const onClickApplyButton = () => {
		setApplySearchQuery(searchText);
		setApplyDateOption(
			selectedDateOption === "모든 날짜" ? "" : selectedDateOption,
		);
	};

	const onClickResetButton = () => {
		setApplySearchQuery("");
	};

	useEffect(() => {
		setSelectedDateOption(selectedDateOption);
	}, [selectedDateOption]);

	return (
		<div className="w-full flex flex-col gap-10">
			<div className="flex flex-col gap-6">
				<h3 className="text-2xl">AI 챗봇 질문 내역</h3>
				<div className="flex gap-10">
					<div className="min-w-[120px] h-full">
						<BaseSelect
							options={DATE_OPTIONS}
							value={selectedDateOption}
							onChange={setSelectedDateOption}
						/>
					</div>
					<BaseSearchBar
						value={searchText}
						onChange={(e) => onChangeSearch(e)}
						placeholder="설치 환경(OS), 소프트웨어 이름을 입력해보세요!"
					/>
				</div>
			</div>
			{/* {(selectedAIOption !== AI_OPTIONS[0] ||
				selectedDateOption !== DATE_OPTIONS[0]) && (
				<div className="border border-[#479B5D] py-[17px] px-[30px] rounded-lg flex gap-2 flex-wrap">
					{selectedAIOption !== AI_OPTIONS[0] && (
						<BaseTag
							title={selectedAIOption}
							onClick={() => setSelectedAIOption(AI_OPTIONS[0])}
						/>
					)}
					{selectedDateOption !== DATE_OPTIONS[0] && (
						<BaseTag
							title={selectedDateOption}
							onClick={() => setSelectedDateOption(DATE_OPTIONS[0])}
						/>
					)}
				</div>
			)} */}
			<div className="w-full flex justify-center items-center gap-2">
				<div className="w-[142px]">
					<BaseButton
						title="초기화"
						fill={false}
						userType="LEARNER"
						className="bg-[#DEDEDE] !hover:bg-gray-300 !active:bg-gray-400 border-none text-[#6B6B6B]"
						onClick={() => onClickResetButton()}
					/>
				</div>
				<div className="w-[142px]">
					<BaseButton
						title="적용"
						userType="LEARNER"
						onClick={() => onClickApplyButton()}
					/>
				</div>
			</div>

			{/* 히스토리 검색 결과 */}
			{history?.question_history_by_date && (
				<div className="w-full flex flex-col">
					{/* 헤더 */}
					<div className="w-full border-b px-6 py-4 flex justify-between bg-gradient-to-r from-[#72C380] to-[#479B5D] rounded-t-lg">
						<div className="flex flex-col items-start gap-2">
							<h2 className="text-xl font-semibold text-[#F9F9F9]">
								Windows 11에서 파이썬 설치해서 간단한 데이터 분석을 하고 싶어요.
							</h2>
							<div className="text-sm text-[#F9F9F9]">📅 2025년 6월 14일</div>
						</div>
						<div className="w-[200px]">
							<BaseSearchBar
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								placeholder="검색어를 입력해 주세요!"
							/>
						</div>
					</div>
					{/* 세션 목록 + 대화 내용 */}
					<div className="flex border border-[#E6E6E6] rounded-b-lg overflow-hidden">
						<div
							className={`flex flex-col flex-none bg-[#ffffff] transition-all duration-300 ease-in-out h-[800px] ${
								isPanelClosed ? "w-[80px]" : "w-[324px]"
							}`}
						>
							<div className="px-[30px] py-[20px] border-b border-[#E6E6E6] flex justify-between items-center">
								{!isPanelClosed && (
									<span className="text-xl font-bold text-[#1F1F1F]">
										📝 질문 이력 {15}건
									</span>
								)}
								<button
									className="cursor-pointer"
									onClick={() => setIsPanelClosed(!isPanelClosed)}
								>
									{isPanelClosed ? (
										<LuPanelLeftOpen size={24} color="#6EAD79" />
									) : (
										<LuPanelLeftClose size={24} color="#6EAD79" />
									)}
								</button>
							</div>
							{!isPanelClosed && (
								<div className="flex flex-col">
									<span className="text-xl font-bold text-[#6B6B6B] px-[30px] py-2.5">
										오늘 (6월 14일)
									</span>
									<div className="min-h-[800px] max-h-[800px] scroll-auto"></div>
								</div>
							)}
						</div>
						<div className="bg-[#EFEFEF] w-full h-full px-14 py-10"></div>
					</div>
				</div>
			)}
		</div>
	);
}

export default MyPageAIChat;
