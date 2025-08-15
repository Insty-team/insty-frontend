import Image from "next/image";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Swal from "sweetalert2";

import { getFormattedDate } from "@/app/utils/";

interface AnswerCardProps {
	answer: Answer;
	questionStatus: string;
	userType: string;
	userNickname: string;
	questionUserNickname: string;
}

interface Answer {
	user: {
		id: number;
		nickname: string;
		userType: "LEARNER" | "CREATOR" | string;
		url: string;
	};
	content: string;
	attachments: Attachment[];
	videoInfo: VideoInfo;
	isAccepted: boolean;
	createdAt: string;
	updatedAt: string;
}

interface Attachment {
	id: number;
	name: string;
	contentType: string;
	size: number;
	url: string;
}

export interface VideoInfo {
	videoType: "COURSE" | "REVIEW" | string;
	videoUuid: string;
	originFileName: string;
}

export default function AnswerCard({
	answer,
	questionStatus,
	userType, // 현재 로그인 유저 타입
	userNickname, // 현재 로그인 유저 닉네임
	questionUserNickname, // 해당 질문글 작성자 닉네임
}: AnswerCardProps) {
	const [openDropdown, setOpenDropdown] = useState(false);

	const handleUpdateAnswer = () => {};

	const handleDeleteAnswer = () => {
		setOpenDropdown(false);
		Swal.fire({
			title: "삭제하시겠습니까?",
			text: "삭제한 내용은 복구할 수 없습니다.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				// TODO: 삭제 처리 api
				console.log("삭제");
			}
		});
	};

	const handleAcceptAnswer = () => {
		Swal.fire({
			title: "해당 댓글을 채택하시겠습니까?",
			text: "",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "채택하기",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				// TODO: 채택 처리 api
				console.log("채택");
			}
		});
	};

	return (
		<div
			className={`flex gap-4 py-5 transition-all duration-300 ${
				answer.isAccepted
					? "border-2 bg-gradient-to-r from-green-50/80 to-green-50/60 rounded-2xl px-6"
					: "border-b-2 border-gray-200 px-4"
			}`}
		>
			<div className="flex flex-col flex-1">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-2">
						<h1
							className={`text-xl font-semibold ${
								answer.isAccepted ? "text-green-800" : "text-gray-900"
							}`}
						>
							{answer.user.nickname}
						</h1>

						{questionUserNickname === answer.user.nickname &&
						answer.user.userType === userType ? (
							<span className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-full">
								작성자
							</span>
						) : answer.user.userType === "LEARNER" ? (
							<span className="px-2 py-1 text-sm bg-blue-100 text-primary-blue-400 rounded-full">
								러너
							</span>
						) : (
							<span className="px-2 py-1 text-sm bg-primary-green-100 text-primary-green-700 rounded-full">
								크리에이터
							</span>
						)}

						{questionStatus !== "ACCEPTED" &&
							userType === "LEARNER" &&
							userNickname === questionUserNickname &&
							answer.user.nickname !== questionUserNickname && (
								<button
									className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-full border border-amber-200 hover:bg-amber-200 transition-colors"
									onClick={() => handleAcceptAnswer()}
								>
									채택하기
								</button>
							)}

						{answer.isAccepted && (
							<span className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-full font-bold shadow-md">
								✨ 채택된 답변
							</span>
						)}
					</div>

					<div className="relative">
						<button onClick={() => setOpenDropdown((prev) => !prev)}>
							<BsThreeDots className="cursor-pointer size-5 text-gray-500" />
						</button>

						{openDropdown && (
							<div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
								{answer.user.userType === userType &&
								answer.user.nickname === userNickname ? (
									<ul className="py-1 text-sm text-gray-700">
										<li>
											<button
												className="block w-full px-4 py-2 text-left cursor-pointer"
												onClick={() => handleUpdateAnswer()}
											>
												수정
											</button>
										</li>
										<li>
											<button
												className="block w-full px-4 py-2 text-left cursor-pointer"
												onClick={() => handleDeleteAnswer()}
											>
												삭제
											</button>
										</li>
									</ul>
								) : (
									<ul className="py-1 text-sm text-gray-300">
										<li>
											<button
												className="block w-full px-4 py-2 cursor-not-allowed text-left"
												disabled
											>
												신고하기
											</button>
										</li>
									</ul>
								)}
							</div>
						)}
					</div>
				</div>

				<span className="text-gray-400 text-lg">
					{getFormattedDate(answer.createdAt)}
				</span>

				<div className="flex flex-col gap-12">
					<p className="text-xl mt-3 text-gray-900">{answer.content}</p>
					{answer.attachments?.length > 0 && (
						<Image
							src={answer.attachments[0].url}
							alt={answer.attachments[0].name}
							width={500}
							height={300}
							unoptimized
						/>
					)}
				</div>

				{/* TODO: 영상 */}

				{answer.isAccepted && (
					<div className="mt-4 p-3 bg-green-100/60 rounded-xl border">
						<div className="flex items-center gap-2 text-lg text-green-700">
							<span className="text-base">💚</span>
							<span className="font-medium">
								이 댓글이 질문자에게 가장 도움이 되었습니다.
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
