"use client";
import { useState } from "react";
import MyPageLearnerSide from "./_components/MyPageLearnerSide";
import MyPageAIChat from "./_components/MyPageAIChat";
import MyPageActivity from "./_components/MyPageActivity";
import MyPageBuy from "./_components/MyPageBuy";
import MyPageSetting from "./_components/MyPageSetting";
import MyPageLike from "./_components/MyPageLike";
import MyPageProfile from "./_components/MyPageProfile";

function LearnerMyPage() {
	const [activeMenu, setActiveMenu] = useState("나의 정보 관리");
	return (
		<div className="flex w-full mt-16">
			<aside className="w-1/4">
				<MyPageLearnerSide
					activeMenu={activeMenu}
					setActiveMenu={setActiveMenu}
				/>
			</aside>
			<section className="flex justify-center w-3/4">
				{activeMenu === "나의 정보 관리" && <MyPageProfile />}
				{activeMenu === "내 활동" && <MyPageActivity />}
				{activeMenu === "AI 챗봇 질문 이력" && <MyPageAIChat />}
				{activeMenu === "구매 내역" && <MyPageBuy />}
				{activeMenu === "찜한 영상" && <MyPageLike />}
				{activeMenu === "설정" && <MyPageSetting />}
			</section>
		</div>
	);
}

export default LearnerMyPage;
