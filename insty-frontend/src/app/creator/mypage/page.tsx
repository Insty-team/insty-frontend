"use client";
import MyPageCreatorSide from "./_components/MyPageCreatorSide";
import MyPageAccount from "./_components/MyPageAccount";
import MyPageProfile from "./_components/MyPageProfile";
import MyPageSetting from "./_components/MyPageSetting";
import { useState } from "react";

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
				{activeMenu === "나의 정보 관리" && <MyPageProfile />}
				{activeMenu === "내 계좌 정보" && <MyPageAccount />}
				{activeMenu === "설정" && <MyPageSetting />}
			</section>
		</div>
	);
}

export default CreatorMyPage;
