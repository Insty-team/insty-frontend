"use client";
import { LEARNER_MYPAGE_MENU_LIST } from "@/app/constants/constants";

type MyPageLearnerSideProps = {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
};

function MyPageLearnerSide({
	activeMenu,
	setActiveMenu,
}: MyPageLearnerSideProps) {
	return (
		<>
			<div className="flex flex-col gap-10">
				<span className="text-3xl font-bold">마이페이지</span>
				<div className="flex flex-col gap-10">
					{LEARNER_MYPAGE_MENU_LIST.map((menu) => (
						<button
							key={menu.id}
							onClick={() => setActiveMenu(menu.title)}
							className="flex justify-start"
						>
							<span
								className={activeMenu === menu.title ? "font-semibold" : ""}
							>
								{menu.title}
							</span>
						</button>
					))}
				</div>
			</div>
		</>
	);
}

export default MyPageLearnerSide;
