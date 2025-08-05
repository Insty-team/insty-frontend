import * as Amplitude from "@amplitude/analytics-browser";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import Swal from "sweetalert2";

import Loading from "@/app/_components/common/Loading";
import { postPurchaseAssistantChatbot } from "@/app/api/ai";
import { trackEvent } from "@/app/utils";

interface PurchaseAssistantChatbotModalProps {
	open: boolean;
	messages: { type: string; text: string }[];
	setMessages: React.Dispatch<
		React.SetStateAction<{ type: string; text: string }[]>
	>;
	courseId: number;
	remainCount: number;
	onUsageCountUpdate: (newCount: number) => void;
}

function PurchaseAssistantChatbotModal({
	open,
	messages,
	setMessages,
	remainCount,
	courseId,
	onUsageCountUpdate,
}: PurchaseAssistantChatbotModalProps) {
	const [input, setInput] = useState("");
	const chatEndRef = useRef<HTMLDivElement>(null);
	const [currentRemainCount, setCurrentRemainCount] = useState(remainCount);
	const [isResponseLoading, setIsResponseLoading] = useState(false);

	// remainCount가 변경될 때만 currentRemainCount 업데이트 (초기 로드 시에만)
	useEffect(() => {
		if (remainCount > 0 && currentRemainCount === 0) {
			setCurrentRemainCount(remainCount);
		}
	}, [remainCount, currentRemainCount]);

	// 스크롤 함수를 useCallback으로 메모이제이션
	const scrollToBottom = useCallback(() => {
		if (open && chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [open]);

	// 메시지가 변경될 때만 스크롤
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// 폼 제출 핸들러를 useCallback으로 메모이제이션
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (currentRemainCount === 0) {
				Swal.fire({
					title: "구매 결정 도움 횟수를 초과했습니다. (최대 2회)",
					icon: "error",
					confirmButtonText: "확인",
				});
				return;
			}

			// Amplitude 추적
			Amplitude.track("Purchase Assistant Chatbot Used");
			// Mixpanel 추적
			trackEvent("구매_도우미_챗봇_사용");

			if (!input.trim()) return;
			setIsResponseLoading(true);
			setMessages((prev) => [...prev, { type: "user", text: input }]);
			setInput("");

			try {
				const res = await postPurchaseAssistantChatbot(courseId, input);

				if (res && res.data) {
					//console.log(res.data);
					const { recommendation, judgment, reasons } = res.data;
					let assistantMessage = "";

					if (judgment === "판단 불가") {
						assistantMessage = [
							`${reasons.map((reason: string) => `${reason}`).join("\n")}`,
						].join("\n");
					} else {
						assistantMessage = [
							`추천: ${recommendation}`,
							`판단: ${judgment}`,
							`이유:`,
							`${reasons
								.map((reason: string, idx: number) => `${idx + 1}. ${reason}`)
								.join("\n")}`,
						].join("\n");
					}

					setMessages((prev) => [
						...prev,
						{ type: "assistant", text: assistantMessage },
					]);

					const newCount = currentRemainCount - 1;
					setCurrentRemainCount(newCount);

					// useEffect로 부모 상태 업데이트를 지연시킴
					setTimeout(() => {
						onUsageCountUpdate(newCount);
					}, 0);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsResponseLoading(false);
			}
		},
		[input, setMessages, courseId, currentRemainCount, onUsageCountUpdate],
	);

	// 입력 변경 핸들러를 useCallback으로 메모이제이션
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setInput(e.target.value);
		},
		[],
	);

	if (!open) return null;

	return (
		<div className="fixed bottom-24 right-8 z-[2600] w-[40%] h-[80%] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-scale-100">
			<div className="flex items-center justify-between px-4 py-3 border-b border-gray-scale-100 rounded-t-2xl bg-gray-scale-50">
				<div className="flex items-center gap-2">
					<Image src="/insty.png" alt="logo" width={48} height={48} />
					<div className="ml-2">
						<div className="font-bold text-2xl text-primary-green-700">
							INSTY
						</div>
						<div className="text-2lg text-black-300">
							어떤 도움이 필요하세요?
						</div>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`mb-3 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`whitespace-pre-line px-4 py-2 rounded-2xl max-w-[80%] text-md ${
								msg.type === "user"
									? "bg-primary-green-200 text-black-300"
									: "bg-white border border-gray-scale-200 text-black-300"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
				<div ref={chatEndRef} />
				{isResponseLoading && (
					<div className="flex items-end justify-start flex-row">
						<div className="flex flex-row justify-between items-center text-black-300 rounded-2xl px-4 py-3 text-md shadow-sm border border-gray-scale-200 bg-white rounded-tr-2xl rounded-tl-md">
							<p>답변을 생성 중입니다...</p>
							<Loading width={30} height={30} className="ml-2" />
						</div>
					</div>
				)}
			</div>

			<form
				className="flex items-center gap-2 px-4 py-3 border-t border-gray-scale-100 bg-white rounded-b-2xl"
				onSubmit={handleSubmit}
			>
				<input
					className="flex-1 px-3 py-2 rounded-full border border-gray-scale-200 focus:outline-none focus:ring-2 focus:ring-primary-green-400 text-sm"
					placeholder={
						currentRemainCount === 0
							? "이용 가능 횟수를 모두 사용하였습니다."
							: isResponseLoading
								? "답변을 기다리고 있습니다... "
								: `입력해주세요... (남은 횟수: ${currentRemainCount})`
					}
					value={input}
					onChange={handleInputChange}
					disabled={currentRemainCount === 0 || isResponseLoading}
				/>
				<button
					type="submit"
					className="text-primary-green-600 hover:text-primary-green-800"
					disabled={currentRemainCount === 0 || isResponseLoading}
				>
					<IoSend size={22} className="text-primary-green-600" />
				</button>
			</form>
		</div>
	);
}

export default PurchaseAssistantChatbotModal;
