"use client";
import { IconButton } from "@/app/_components/common";

function MyPageAccount() {
	return (
		<div className="w-full flex flex-col gap-10">
			<h3 className="text-2xl">내 계좌 관리</h3>
			<div className="flex gap-10 w-full justify-between items-center">
				<div className="flex flex-col gap-2 text-xl">
					<span className="font-semibold">은행명: 국민은행</span>
					<span>계좌번호: 110-123-456789</span>
				</div>
				<div className="flex gap-4 w-100 h-[54px]">
					<IconButton
						icon="/pencil.svg"
						align="right"
						title="수정"
						className="bg-primary-green-600 rounded-lg w-[168px] flex justify-center items-center gap-2 text-gray-scale-50 cursor-pointer"
					/>
					<IconButton
						icon="/basket.svg"
						align="right"
						title="삭제"
						className="bg-gray-100 rounded-lg w-[168px] flex justify-center items-center gap-2 text-secondary-red-200 cursor-pointer"
					/>
				</div>
			</div>
		</div>
	);
}

export default MyPageAccount;
