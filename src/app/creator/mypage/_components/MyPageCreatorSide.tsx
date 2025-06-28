"use client";

import { CREATOR_MYPAGE_MENU_LIST } from "@/app/constants";

type MyPageCreatorSideProps = {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
};

function MyPageCreatorSide({
	activeMenu,
	setActiveMenu,
}: MyPageCreatorSideProps) {
	return (
		<>
			<div className="flex flex-col gap-10">
				<span className="text-3xl font-bold">마이페이지</span>
				<div className="flex flex-col gap-10">
					{CREATOR_MYPAGE_MENU_LIST.map((menu) => (
						<button
							key={menu.id}
							onClick={() => setActiveMenu(menu.title)}
							className="flex justify-start cursor-pointer"
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

export default MyPageCreatorSide;
