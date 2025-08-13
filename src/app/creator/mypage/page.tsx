"use client";

import { useState } from "react";

import { MypageProfile } from "@/app/_components/mypage";
import MyPageAccount from "@/app/creator/mypage/_components/MyPageAccount";
import MyPageCreatorSide from "@/app/creator/mypage/_components/MyPageCreatorSide";
import MyPageSetting from "@/app/creator/mypage/_components/MyPageSetting";

function CreatorMyPage() {
	const [activeMenu, setActiveMenu] = useState("나의 정보 관리");
	return (
		<div className="flex w-full mt-16">
			<aside className="w-1/4">
				<MyPageCreatorSide
					activeMenu={activeMenu}
					setActiveMenu={setActiveMenu}
				/>
			</aside>
			<section className="flex justify-center w-3/4">
				{activeMenu === "나의 정보 관리" && <MypageProfile mode="CREATOR" />}
				{activeMenu === "내 계좌 정보" && <MyPageAccount />}
				{activeMenu === "이메일 수신 여부" && <MyPageSetting />}
			</section>
		</div>
	);
}

export default CreatorMyPage;
