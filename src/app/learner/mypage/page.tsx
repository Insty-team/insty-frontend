"use client";

import { useState } from "react";

import { MypageProfile } from "@/app/_components/mypage";

import MyPageActivityWriting from "./_components/MyPageActivityWriting";
import MyPageAIChat from "./_components/MyPageAIChat";
import MyPageBuy from "./_components/MyPageBuy";
import MyPageCourseRequest from "./_components/MyPageCourseRequest";
import MyPageLearnerSide from "./_components/MyPageLearnerSide";
import MyPageLike from "./_components/MyPageLike";
import MyPageSetting from "./_components/MyPageSetting";

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
				{activeMenu === "나의 정보 관리" && <MypageProfile mode="LEARNER" />}
				{activeMenu === "내 활동" && <MyPageActivityWriting />}
				{activeMenu === "강의중 AI 챗봇 질문 이력" && <MyPageAIChat />}
				{activeMenu === "구매 내역" && <MyPageBuy />}
				{activeMenu === "찜한 영상" && <MyPageLike />}
				{activeMenu === "설정" && <MyPageSetting />}
				{activeMenu === "강의 요청" && <MyPageCourseRequest />}
			</section>
		</div>
	);
}

export default LearnerMyPage;
