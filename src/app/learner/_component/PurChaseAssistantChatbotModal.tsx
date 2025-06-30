import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import Swal from "sweetalert2";

import { postPurchaseAssistantChatbot } from "@/app/api/ai";

interface PurchaseAssistantChatbotModalProps {
	open: boolean;
	messages: { type: string; text: string }[];
	setMessages: React.Dispatch<
		React.SetStateAction<{ type: string; text: string }[]>
	>;
	usageCount: number;
	courseId: number;
}

function PurchaseAssistantChatbotModal({
	open,
	messages,
	setMessages,
	usageCount,
	courseId,
}: PurchaseAssistantChatbotModalProps) {
	const [input, setInput] = useState("");
	const chatEndRef = useRef<HTMLDivElement>(null);
	const [chatbotUsageCount, setChatbotUsageCount] = useState(2 - usageCount);

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
			if (chatbotUsageCount === 0) {
				Swal.fire({
					title: "구매 결정 도움 횟수를 초과했습니다. (최대 2회)",
					icon: "error",
					confirmButtonText: "확인",
				});
				return;
			}
			if (!input.trim()) return;
			setMessages((prev) => [...prev, { type: "user", text: input }]);
			setInput("");

			try {
				const res = await postPurchaseAssistantChatbot(courseId, input);

				if (res && res.data) {
					console.log(res.data);
					const { recommendation, judgment, reasons } = res.data;
					const assistantMessage = [
						`추천: ${recommendation}`,
						`판단: ${judgment}`,
						`이유:`,
						...reasons.map(
							(reason: string, idx: number) => `${idx + 1}. ${reason}`,
						),
					].join("\n");

					setMessages((prev) => [
						...prev,
						{ type: "assistant", text: assistantMessage },
					]);

					setChatbotUsageCount(chatbotUsageCount - 1);
				}
			} catch (error) {
				console.error(error);
			}
		},
		[input, setMessages, courseId, chatbotUsageCount],
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
							className={`whitespace-pre-line px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
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
			</div>

			<form
				className="flex items-center gap-2 px-4 py-3 border-t border-gray-scale-100 bg-white rounded-b-2xl"
				onSubmit={handleSubmit}
			>
				<input
					className="flex-1 px-3 py-2 rounded-full border border-gray-scale-200 focus:outline-none focus:ring-2 focus:ring-primary-green-400 text-sm"
					placeholder={
						chatbotUsageCount !== 0
							? `입력해주세요... (남은 횟수: ${chatbotUsageCount})`
							: "이용 가능 횟수를 모두 사용하였습니다."
					}
					value={input}
					onChange={handleInputChange}
					disabled={chatbotUsageCount === 0}
				/>
				<button
					type="submit"
					className="text-primary-green-600 hover:text-primary-green-800"
					disabled={chatbotUsageCount === 0}
				>
					<IoSend size={22} className="text-primary-green-600" />
				</button>
			</form>
		</div>
	);
}

export default PurchaseAssistantChatbotModal;
