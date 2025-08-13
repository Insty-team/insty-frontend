"use client";

import { useState } from "react";

import { MypageProfile } from "@/app/_components/mypage";

import MyPageActivityBookmark from "./_components/MyPageActivityBookmark";
import MyPageActivityReply from "./_components/MyPageActivityReply";
import MyPageActivityWriting from "./_components/MyPageActivityWriting";
import MyPageAIChat from "./_components/MyPageAIChat";
import MyPageBuy from "./_components/MyPageBuy";
import MyPageLearnerSide from "./_components/MyPageLearnerSide";
import MyPageLike from "./_components/MyPageLike";
import MyPageSetting from "./_components/MyPageSetting";

function LearnerMyPage() {
	const [activeMenu, setActiveMenu] = useState("나의 정보 관리");
	const [activeSubMenu, setActiveSubMenu] = useState("내가 쓴 글");
	return (
		<div className="flex w-full mt-16">
			<aside className="w-1/4">
				<MyPageLearnerSide
					activeMenu={activeMenu}
					setActiveMenu={setActiveMenu}
					activeSubMenu={activeSubMenu}
					setActiveSubMenu={setActiveSubMenu}
				/>
			</aside>
			<section className="flex justify-center w-3/4">
				{activeMenu === "나의 정보 관리" && <MypageProfile mode="LEARNER" />}
				{activeMenu === "내 활동" && activeSubMenu === "내가 쓴 글" && (
					<MyPageActivityWriting />
				)}
				{activeMenu === "내 활동" &&
					activeSubMenu === "내가 댓글을 작성한 게시글" && (
						<MyPageActivityReply />
					)}
				{activeMenu === "내 활동" &&
					activeSubMenu === "내가 북마크한 게시글" && (
						<MyPageActivityBookmark />
					)}
				{activeMenu === "강의중 AI 챗봇 질문 이력" && <MyPageAIChat />}
				{activeMenu === "구매 내역" && <MyPageBuy />}
				{activeMenu === "찜한 영상" && <MyPageLike />}
				{activeMenu === "설정" && <MyPageSetting />}
			</section>
		</div>
	);
}

export default LearnerMyPage;
