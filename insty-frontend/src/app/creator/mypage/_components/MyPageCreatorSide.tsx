"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CREATOR_MYPAGE_MENU_LIST } from "@/app/constants/constants";

function MyPageCreatorSide() {
	const pathname = usePathname();


	return (
		<>
			<div className="flex flex-col gap-10">
				<span className="text-3xl font-bold">마이페이지</span>
				<div className="flex flex-col gap-10">
					{CREATOR_MYPAGE_MENU_LIST.map((menu) => (
						<Link href={`${menu.path}`} key={menu.id}>
							<span className={pathname === menu.path ? "font-semibold" : ""}>
								{menu.title}
							</span>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}

export default MyPageCreatorSide;
