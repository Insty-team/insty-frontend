import React from "react";
import { UploadformData } from "@/app/types";
import Image from "next/image";
import { BaseButton } from "@/app/_components/common";

interface PreviewInfomationProps {
	data: UploadformData;
	onEdit: () => void;
}

function PreviewInfomation({ data, onEdit }: PreviewInfomationProps) {
	if (!data) return <div>데이터가 없습니다.</div>;

	return (
		<div className="flex flex-col gap-8 items-stretch">
			<div className="font-bold text-2xl mb-2">{data.title}</div>

			<div className="flex gap-8">
				<div className="w-[830px] h-[468px] bg-gray-200 rounded-2xl flex items-center justify-center">
					<span className="text-gray-400">영상 미리보기</span>
				</div>

				<div className="flex flex-col gap-2 flex-1 justify-between h-[468px]">
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
					<div className="flex flex-col gap-9 mt-6">
						<div className="flex gap-2 items-center">
							<Image src="/profile.svg" alt="user" width={48} height={48} />
							<span className="text-black-100 text-2xl">크리에이터 이름</span>
						</div>
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
					<div className="flex gap-4 mt-auto pt-8">
						<BaseButton title="수정하기" fill={false} onClick={onEdit}/>
						<BaseButton title="업로드 진행하기" onClick={() => {}}/>
					</div>
				</div>
			</div>

			<div className="flex gap-8 mt-8">
				<div className="flex-1">
					<div className="font-semibold text-3xl">
						이 영상이 다루는 핵심 내용
					</div>
					<ul className="list-disc pl-5 space-y-1 mt-8 text-2xl">
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
