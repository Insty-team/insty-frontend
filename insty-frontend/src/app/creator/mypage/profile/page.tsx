"use client";
import Image from "next/image";
import { BaseButton } from "@/app/_components/common";

function Profile() {
	const mockUserInfo = {
		id: "test",
		name: "김가나",
		email: "kim-gana@example.com",
		description: "안녕하세요. 김가나 입니다.",
	};

	return (
		<div className="flex flex-col gap-12 justify-center items-center">
			<Image src="/profile.svg" width={128} height={128} alt="프로필 사진" />
			<div className="flex flex-col gap-10">
				{[
					{ label: "닉네임", value: mockUserInfo.name },
					{ label: "이메일", value: mockUserInfo.email },
					{ label: "소개글", value: mockUserInfo.description },
				].map((item) => (
					<div key={item.label} className="flex flex-col">
						<span className="text-xl font-semibold">{item.label}</span>
						<span className="text-2xl">{item.value}</span>
					</div>
				))}
			</div>
			<div className="w-90">
				<BaseButton title="프로필 수정하기" />
			</div>
		</div>
	);
}

export default Profile;
