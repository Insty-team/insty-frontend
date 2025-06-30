import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { LuFileUp } from "react-icons/lu";

import { postMessageStream } from "@/app/api/ai";
import { useFormatAssistantText } from "@/app/hooks";
import { CourserChatbotMessage } from "@/app/types/course";
interface CourseQuestionChatBotModalProps {
	open: boolean;
	messages: CourserChatbotMessage[];
	setMessages: React.Dispatch<React.SetStateAction<CourserChatbotMessage[]>>;
	sessionId: number | null;
	courseId: number;
}

function CourseQuestionChatBotModal({
	open,
	messages,
	setMessages,
	sessionId,
	courseId,
}: CourseQuestionChatBotModalProps) {
	const [input, setInput] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [filePreview, setFilePreview] = useState<string | null>(null);
	const chatEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const formatAssistantText = useFormatAssistantText();

	const scrollToBottom = useCallback(() => {
		if (open && chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [open]);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// 파일 미리보기 생성
	useEffect(() => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setFilePreview(e.target?.result as string);
			reader.readAsDataURL(file);
		} else {
			setFilePreview(null);
		}
	}, [file]);

	const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0] || null;
		setFile(selected);
	}, []);

	const handleRemoveFile = useCallback(() => {
		setFile(null);
		setFilePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!sessionId) {
				console.error("sessionId가 없습니다!");
				return;
			}
			if (!input.trim() && !file) return;

			setMessages((prev) => [
				...prev,
				{
					sender: "user",
					content: input,
					attachments: file
						? [
								{
									name: file.name,
									type: file.type,
									preview: filePreview,
								},
							]
						: undefined,
				},
			]);

			try {
				const formData = new FormData();
				formData.append("course_id", String(courseId));
				formData.append("message_text", input);
				if (file) {
					formData.append("file", file);
				}

				console.log(formData.get("course_id"));
				console.log(formData.get("message_text"));
				console.log(formData.get("file"));

				const postmessageResponse = await postMessageStream(
					sessionId,
					formData,
				);

				console.log(postmessageResponse);

				setMessages((prev) => [
					...prev,
					{
						sender: "assistant",
						content: postmessageResponse,
					},
				]);

				setInput("");
				setFile(null);
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			} catch (error) {
				console.error(error);
			}
		},
		[input, file, filePreview, sessionId, courseId, setMessages],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setInput(e.target.value);
		},
		[],
	);

	if (!open) return null;

	return (
		<div className="fixed bottom-24 right-8 z-[2600] w-[60%] h-[80%] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-scale-100">
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
						className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`whitespace-pre-line px-4 py-2 rounded-2xl max-w-[80%] text-md ${
								msg.sender === "user"
									? "bg-primary-green-200 text-black-300"
									: "bg-white border border-gray-scale-200 text-black-300"
							}`}
						>
							{msg.sender === "assistant" ? (
								<span
									dangerouslySetInnerHTML={{
										__html: formatAssistantText(msg.content),
									}}
								/>
							) : (
								<>
									{msg.attachments &&
										msg.attachments.map((file, i) =>
											file.preview ? (
												<Image
													key={i}
													src={file.preview}
													alt={file.name}
													className="w-32 h-32 object-cover rounded mb-4"
													width={64}
													height={64}
												/>
											) : null,
										)}
									{msg.content}
								</>
							)}
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
					type="file"
					accept="image/*"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleFileChange}
				/>
				<button
					type="button"
					className="px-2 py-1 text-lg"
					onClick={() => fileInputRef.current?.click()}
				>
					<LuFileUp
						size={24}
						className="hover:text-primary-green-600 cursor-pointer"
					/>
				</button>
				{filePreview && (
					<div className="flex items-center gap-2">
						<Image
							src={filePreview}
							alt="미리보기"
							className="w-12 h-12 object-cover rounded"
							width={48}
							height={48}
						/>
						<button
							type="button"
							className="text-secondary-red-300 text-xs cursor-pointer"
							onClick={handleRemoveFile}
						>
							삭제
						</button>
					</div>
				)}
				<input
					className="flex-1 px-3 py-2 rounded-full border border-gray-scale-200 focus:outline-none focus:ring-2 focus:ring-primary-green-400 text-sm"
					placeholder="입력해주세요 ..."
					value={input}
					onChange={handleInputChange}
				/>
				<button
					type="submit"
					className="text-primary-green-600 hover:text-primary-green-800"
				>
					<IoSend size={22} className="text-primary-green-600" />
				</button>
			</form>
		</div>
	);
}

export default CourseQuestionChatBotModal;
