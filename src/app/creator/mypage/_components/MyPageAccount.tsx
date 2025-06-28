"use client";

import { FaTrash } from "react-icons/fa";
import { HiPencil } from "react-icons/hi2";

import { BaseButton } from "@/app/_components/common";

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
					<BaseButton
						title="수정"
						userType="CREATOR"
						icon={<HiPencil />}
						className="!w-[168px] !rounded-lg"
					/>
					<BaseButton
						title="삭제"
						userType="CREATOR"
						icon={<FaTrash />}
						className="!bg-gray-100 !w-[168px] !rounded-lg !text-secondary-red-200"
					/>
				</div>
			</div>
		</div>
	);
}

export default MyPageAccount;
