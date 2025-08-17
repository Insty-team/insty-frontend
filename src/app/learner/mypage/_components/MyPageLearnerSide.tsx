"use client";

import { LEARNER_MYPAGE_MENU_LIST } from "@/app/constants";

type MyPageLearnerSideProps = {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
};

function MyPageLearnerSide({
	activeMenu,
	setActiveMenu,
}: MyPageLearnerSideProps) {
	const onMenubuttonClick = (menu: string) => {
		setActiveMenu(menu);
	};

	return (
		<>
			<div className="flex flex-col gap-10">
				<span className="text-3xl font-bold">마이페이지</span>
				<div className="flex flex-col gap-10">
					{LEARNER_MYPAGE_MENU_LIST.map((menu) => (
						<div key={menu.id}>
							<button
								onClick={() => onMenubuttonClick(menu.title)}
								className={`flex justify-start  disabled:text-gray-300 ${menu.title === "설정" || menu.title === "구매 내역" ? "cursor-not-allowed" : "cursor-pointer hover:font-semibold"}`}
								disabled={
									menu.title === "내 활동" ||
									menu.title === "설정" ||
									menu.title === "구매 내역"
								}
							>
								<span
									className={activeMenu === menu.title ? "font-semibold" : ""}
								>
									{menu.title}
								</span>
							</button>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default MyPageLearnerSide;
