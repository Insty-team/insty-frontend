"use client";

import {
	LEARNER_MYPAGE_ACTIVITY_SUB_MENU,
	LEARNER_MYPAGE_MENU_LIST,
} from "@/app/constants";

type MyPageLearnerSideProps = {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
	activeSubMenu: string;
	setActiveSubMenu: (subMenu: string) => void;
};

function MyPageLearnerSide({
	activeMenu,
	setActiveMenu,
	activeSubMenu,
	setActiveSubMenu,
}: MyPageLearnerSideProps) {
	return (
		<>
			<div className="flex flex-col gap-10">
				<span className="text-3xl font-bold">마이페이지</span>
				<div className="flex flex-col gap-10">
					{LEARNER_MYPAGE_MENU_LIST.map((menu) => (
						<div key={menu.id}>
							<button
								onClick={() => setActiveMenu(menu.title)}
								className="flex justify-start cursor-pointer"
							>
								<span
									className={activeMenu === menu.title ? "font-semibold" : ""}
								>
									{menu.title}
								</span>
							</button>
							{menu.title === "내 활동" && activeMenu === "내 활동" && (
								<div className="ml-4 mt-2 flex flex-col gap-2 justify-start items-start">
									{LEARNER_MYPAGE_ACTIVITY_SUB_MENU.map((subMenu) => (
										<button
											key={subMenu.id}
											className={`text-sm cursor-pointer ${
												activeSubMenu === subMenu.title ? "font-semibold" : ""
											}`}
											onClick={() => setActiveSubMenu(subMenu.title)}
										>
											{subMenu.title}
										</button>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default MyPageLearnerSide;
