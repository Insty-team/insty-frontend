"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

import {
	BaseButton,
	BaseSearchBar,
	BaseSelect,
} from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { useFormatAssistantText } from "@/app/hooks";
import {
	useGetAIChatHistoryQuery,
	useGetAIMessageListQuery,
} from "@/app/queries";
import { AIHistoryByDate, AIHistoryItem, AIMessage } from "@/app/types/ai";
import { getFormattedDate } from "@/app/utils";

function MyPageAIChat() {
	const DATE_OPTIONS = [
		{ value: "all", label: "모든 날짜" },
		{ value: "1d", label: "지난 1일" },
		{ value: "1w", label: "지난 1주" },
		{ value: "1m", label: "지난 1개월" },
		{ value: "1y", label: "지난 1년" },
	];

	// 히스토리 검색/필터 영역 관련
	const [searchText, setSearchText] = useState("");
	const [applySearchQuery, setApplySearchQuery] = useState("");

	const [selectedDateOption, setSelectedDateOption] = useState(DATE_OPTIONS[0]);
	const [applyDateOption, setApplyDateOption] = useState("");

	// 히스토리 검색 결과 영역 관련
	const [isHistoryVisible, setIsHistoryVisible] = useState(false);
	const [isPanelClosed, setIsPanelClosed] = useState(false);

	// 화면에 보여지는 데이터
	const [history, setHistory] = useState<AIHistoryByDate[]>([]);

	// 유저가 현재 선택한 세션
	type SelectedHistory = AIHistoryItem & {
		date: string;
	};
	const [selectedHistoryItem, setSelectedHistoryItem] =
		useState<SelectedHistory | null>(null);

	// 히스토리 데이터 조회	쿼리
	const { data: originHistory, isLoading } = useGetAIChatHistoryQuery({
		relativeDate: applyDateOption,
		keyword: applySearchQuery,
		enabled: isHistoryVisible,
	});

	useEffect(() => {
		if (!originHistory) return;

		console.log("API 응답 받음:", {
			검색어: applySearchQuery,
			날짜옵션: applyDateOption,
			응답데이터: originHistory,
		});

		setHistory(originHistory);
	}, [originHistory, applySearchQuery, applyDateOption]);

	// 하나의 세션에 대한 메세지 조회 쿼리
	const { data: originMessages } = useGetAIMessageListQuery(
		selectedHistoryItem?.session_id,
	);

	// 같은 sessionId끼리 묶어서 하나의 세션으로 보여주기 위한 로직
	const uniqueSessionList = useMemo(() => {
		return Array.from(
			new Map(
				history
					.flatMap(({ date, questions }) =>
						questions.map((q) => ({ ...q, date })),
					)
					.sort(
						(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
					)
					.map((q) => [q.session_id, q]),
			).values(),
		);
	}, [history]);

	useEffect(() => {
		if (!isHistoryVisible || uniqueSessionList.length === 0) {
			return;
		}
		setSelectedHistoryItem(uniqueSessionList[0]);
	}, [uniqueSessionList, isHistoryVisible]);

	// 검색 키워드 핸들러
	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	// 엔터 키 핸들러
	const onKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onClickApplyButton();
		}
	};

	// 적용 버튼 클릭 핸들러
	const onClickApplyButton = () => {
		const trimmedSearchText = searchText.trim();
		const dateOption =
			selectedDateOption.value === "all" ? "" : selectedDateOption.value;

		// 검색어와 날짜 옵션이 둘 다 없으면 검색하지 않음
		if (!trimmedSearchText && dateOption === "") {
			console.log("검색 조건이 없어서 검색하지 않음");
			return;
		}

		setApplySearchQuery(trimmedSearchText);
		setApplyDateOption(dateOption);
		setIsHistoryVisible(true);
	};

	// 초기화 버튼 클릭 핸들러
	const onClickResetButton = () => {
		setSearchText("");
		setApplySearchQuery("");
		setSelectedDateOption(DATE_OPTIONS[0]);
		setApplyDateOption("");
	};

	const formatAssistantText = useFormatAssistantText();

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [originMessages]);

	return (
		<div className="w-full flex flex-col gap-10">
			<div className="flex flex-col gap-6">
				<h3 className="text-2xl">AI 챗봇 질문 내역</h3>
				<div className="flex gap-10">
					<div className="min-w-[120px] h-full">
						<BaseSelect
							options={DATE_OPTIONS}
							value={selectedDateOption.value}
							onChange={(value) => {
								const found = DATE_OPTIONS.find(
									(option) => option.value === value,
								);
								if (found) setSelectedDateOption(found);
							}}
						/>
					</div>
					<BaseSearchBar
						value={searchText}
						onChange={(e) => onChangeSearch(e)}
						onKeyDown={onKeyDownSearch}
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
						title={isLoading ? "검색 중..." : "적용"}
						userType="LEARNER"
						onClick={() => onClickApplyButton()}
						disabled={isLoading}
					/>
				</div>
			</div>

			{/* 히스토리 검색 결과 */}
			{isHistoryVisible && (
				<div className="w-full flex flex-col mb-10">
					{/* 헤더 */}
					<div className="w-full border-b px-6 py-4 flex justify-between bg-gradient-to-r from-[#72C380] to-[#479B5D] rounded-t-lg">
						<div className="flex flex-col items-start gap-2">
							<h2 className="text-xl font-semibold text-[#F9F9F9]">
								{isLoading
									? "검색 중..."
									: uniqueSessionList.length > 0
										? selectedHistoryItem?.course_title ||
											"선택된 세션이 없습니다."
										: "검색 결과가 없습니다."}
							</h2>
							{!isLoading &&
								uniqueSessionList.length > 0 &&
								selectedHistoryItem && (
									<div className="text-sm text-[#F9F9F9]">
										{`📅 ${getFormattedDate(
											selectedHistoryItem?.date || new Date().toDateString(),
											"YYYY년 MM월 DD일",
										)}`}
									</div>
								)}
						</div>
					</div>
					{/* 세션 목록 + 대화 내용 */}
					{isLoading ? (
						<div className="border border-[#E6E6E6] rounded-b-lg p-20 text-center">
							<div className="flex flex-col items-center gap-4">
								<Loading width={48} height={48} />
								<p className="text-gray-600">검색 중입니다...</p>
							</div>
						</div>
					) : uniqueSessionList.length > 0 ? (
						<div className="flex border border-[#E6E6E6] rounded-b-lg overflow-hidden">
							<div
								className={`flex flex-col flex-none bg-[#ffffff] transition-all duration-300 ease-in-out h-[800px] ${
									isPanelClosed ? "w-[80px]" : "w-[324px]"
								}`}
							>
								<div className="px-[30px] py-[20px] border-b border-[#E6E6E6] flex justify-between items-center">
									{!isPanelClosed && (
										<span className="text-xl font-bold text-[#1F1F1F]">
											📝 질문 이력 {uniqueSessionList.length}건
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
									<div className="flex flex-col overflow-y-auto max-h-[800px]">
										{uniqueSessionList.map((q) => (
											<li
												key={q.session_id}
												className={`list-none cursor-pointer px-[30px] py-2 mx-3 my-2 text-sm text-black hover:bg-gray-100 rounded-xl transition duration-200 ${
													selectedHistoryItem?.session_id === q.session_id &&
													selectedHistoryItem?.date === q.date
														? "bg-[#E5F9E0] text-[#479B5D]"
														: "text-black"
												}`}
												onClick={() => setSelectedHistoryItem(q)}
											>
												<div className="font-semibold">{q.course_title}</div>
												<div className="text-xs text-gray-400">
													{getFormattedDate(q.date, "YYYY년 MM월 DD일")}
												</div>
											</li>
										))}
									</div>
								)}
							</div>
							<div className="bg-[#EFEFEF] w-full overflow-y-auto max-h-[800px] px-14 py-10">
								{originMessages?.messages ? (
									<div className="flex flex-col gap-4">
										{[...originMessages?.messages]
											.sort(
												(a, b) =>
													new Date(a.created_at).getTime() -
													new Date(b.created_at).getTime(),
											)
											.map((msg: AIMessage) => (
												<div
													key={msg.message_id}
													className={`flex w-full ${msg.sender === "assistant" ? "justify-start" : "justify-end"}`}
												>
													<div
														className={`mb-3 min-w-auto max-w-[60%] ${msg.sender === "assistant" ? "mr-auto" : "ml-auto"}`}
													>
														<div
															className={`px-4 py-2 rounded-2xl text-lg ${
																msg.sender === "assistant"
																	? "bg-white border border-gray-scale-200 text-black rounded-tr-2xl rounded-tl-md rounded-br-2xl"
																	: "bg-primary-green-400 text-white rounded-tl-2xl rounded-tr-md rounded-bl-2xl"
															}`}
														>
															{msg.sender === "assistant" ? (
																<span
																	dangerouslySetInnerHTML={{
																		__html: formatAssistantText(msg.content),
																	}}
																/>
															) : (
																<span>{msg.content}</span>
															)}
														</div>
														<div
															className={`text-xs text-gray-400 mt-1 ${msg.sender === "assistant" ? "ml-2 text-left" : "mr-2 text-right"}`}
														>
															{getFormattedDate(
																msg.created_at,
																"YYYY/MM/DD HH:mm",
															)}
														</div>
													</div>
												</div>
											))}
										<div ref={bottomRef} />
									</div>
								) : (
									<p className="text-gray-400">
										해당 세션의 대화 내역이 없습니다.
									</p>
								)}
							</div>
						</div>
					) : (
						<div className="border border-[#E6E6E6] rounded-b-lg p-20 text-center">
							<div className="flex flex-col items-center gap-4">
								<div className="text-6xl">🔍</div>
								<h3 className="text-xl font-semibold text-gray-600">
									검색 결과가 없습니다
								</h3>
								<p className="text-gray-400">
									다른 검색어를 입력하거나 날짜 범위를 변경해보세요.
								</p>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default MyPageAIChat;
