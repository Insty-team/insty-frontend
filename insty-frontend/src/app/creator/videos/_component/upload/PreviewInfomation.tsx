"use client";

import Image from "next/image";
import { useState } from "react";
import { IoIosCheckbox, IoIosCheckboxOutline } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { BaseButton } from "@/app/_components/common";
import Modal from "@/app/_components/common/Modal";
import { REFUND_POLICY } from "@/app/constants";
import ChatbotModal from "@/app/learner/_component/ChatbotModal";
import CommunitySidebar from "@/app/learner/_component/CommunitySidebar";
import { UploadformData } from "@/app/types";

interface PreviewInfomationProps {
	data: UploadformData;
	onEdit: () => void;
	mode: "creator" | "learner";
}

function PreviewInfomation({ data, onEdit, mode }: PreviewInfomationProps) {
	const [open, setOpen] = useState(false);
	const [openChatbot, setOpenChatbot] = useState(false);
	const [checked, setChecked] = useState(false);

	if (!data) return <div>데이터가 없습니다.</div>;
	return (
		<div className="flex flex-col gap-8 items-stretch relative">
			<div className="font-bold text-2xl mt-10">{data.title}</div>
			<CommunitySidebar />
			<button
				className="fixed bottom-8 right-8 z-50 flex items-center bg-primary-green-400 hover:bg-primary-green-500 text-white font-semibold px-6 py-2 rounded-full shadow-none"
				onClick={() => setOpenChatbot(!openChatbot)}
			>
				<span className="text-base">AI 챗봇에게 질문하기</span>
				<IoChatbubbleEllipses className="w-7 h-7 ml-2" />
			</button>

			{openChatbot && <ChatbotModal open={openChatbot} />}

			<div className="flex gap-4 w-full">
				<div className="w-[730px] h-[468px] bg-gray-200 rounded-2xl flex items-center justify-center">
					<span className="text-gray-400">영상 미리보기</span>
				</div>

				<div className="flex flex-col gap-2 flex-1 justify-between ml-2">
					<div className="flex gap-2 flex-wrap">
						{data.tags.map((tag) => (
							<span
								key={tag}
								className="px-3 py-1 bg-gray-scale-200 rounded-full text-2lg text-black-100"
							>
								{tag}
							</span>
						))}
					</div>
					<div className="flex flex-col gap-4">
						<div className="flex gap-2 items-center">
							<Image src="/profile.svg" alt="user" width={48} height={48} />
							<span className="text-black-100 text-2xl">크리에이터 이름</span>
						</div>
						{mode === "learner" && (
							<div className="flex flex-col gap-2">
								<span className="text-black-300 text-2xl font-medium">
									가격
								</span>
								<span className="text-3xl text-primary-blue-600 font-semibold">
									₩ {data.price.toLocaleString()}원
								</span>
								<p className="text-secondary-red-300 text-2lg">
									*해당 영상은 미리보기 버전입니다.
								</p>
							</div>
						)}
						<div className="flex gap-2 items-center">
							<Image src="/user.svg" alt="user" width={36} height={36} />
							<span className="text-black-300 text-2xl">{data.recipient}</span>
						</div>

						<div className="flex gap-2 items-center">
							<Image src="/file.svg" alt="file" width={36} height={36} />
							<span className="text-black-300 text-2xl">실습 자료 포함</span>
						</div>

						<div className="flex gap-2 items-center">
							<Image src="/time.svg" alt="clock" width={36} height={36} />
							<span className="text-black-300 text-2xl">1시간 7분 32초</span>
						</div>
					</div>
					{mode === "creator" && (
						<div className="flex gap-4 mt-auto pt-8">
							<BaseButton title="수정하기" fill={false} onClick={onEdit} />
							<BaseButton title="업로드 진행하기" onClick={() => {}} />
						</div>
					)}
				</div>
			</div>

			{mode === "learner" && (
				<div className="flex justify-between gap-8">
					<div className="w-1/2 flex flex-col text-secondary-red-300 text-lg leading-relaxed">
						<div>환불 규정 안내</div>
						<ul className="list-disc pl-5 ml-4 mt-2">
							{REFUND_POLICY.map((text) => (
								<li key={text.line}>{text.text}</li>
							))}
						</ul>
					</div>
					<div className="w-[30%] flex items-center mr-auto">
						<BaseButton title="구매하기" onClick={() => setOpen(true)} />
					</div>
				</div>
			)}

			{open && (
				<Modal
					open={open}
					title="구매하기"
					onClose={() => setOpen(false)}
					onCloseTitle="취소하기"
					actionsTitle="구매하기"
					actions={() => {}}
				>
					<div className="mb-4">
						<div className="text-xl text-secondary-red-300 font-semibold mb-2">
							환불 규정 안내
						</div>
						<ul className="list-disc pl-5 text-secondary-red-300 text-2lg ml-2">
							{REFUND_POLICY.map((text) => (
								<li key={text.line}>{text.text}</li>
							))}
						</ul>
					</div>
					<label className="flex items-center gap-2 mt-16 text-2xl">
						<span className="inline-flex items-center justify-center cursor-pointer">
							{checked ? (
								<IoIosCheckbox
									className="text-primary-green-600 w-9 h-9"
									onClick={() => setChecked(!checked)}
								/>
							) : (
								<IoIosCheckboxOutline
									className="text-gray-scale-400 w-9 h-9"
									onClick={() => setChecked(!checked)}
								/>
							)}
						</span>
						<span>환불 규정을 확인했습니다.</span>
					</label>
				</Modal>
			)}

			<div className="flex gap-8 mt-8">
				<div className="flex-1">
					<div className="font-semibold text-3xl">
						이 영상이 다루는 핵심 내용
					</div>
					<ul className="list-disc pl-5 space-y-4 mt-8 text-2xl">
						{data.coreContents.map((content, idx) => (
							<li key={idx}>{content}</li>
						))}
					</ul>
				</div>
				<div className="flex-1">
					<div className="font-semibold text-3xl">설치 환경 체크리스트</div>
					<ul className="space-y-1 mt-8 text-2xl">
						{data.environments.map((env, idx) => (
							<li key={idx} className="flex items-center gap-2">
								{env.support === "지원" ? (
									<Image
										src="/ableEnvironment.svg"
										alt="ableEnvironment"
										width={48}
										height={48}
									/>
								) : (
									<Image
										src="/disableEnvironment.svg"
										alt="disableEnvironment"
										width={48}
										height={48}
									/>
								)}
								<span className="ml-4">{env.value}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default PreviewInfomation;
