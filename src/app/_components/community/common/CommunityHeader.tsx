"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { COMMUNITY_MENU_LIST } from "@/app/constants";

function CommunityHeader() {
	const pathname = usePathname();
	console.log(pathname);
	return (
		<>
			<header className="flex flex-row items-center gap-6 mt-2 py-4 px-2 text-black-300 font-semibold">
				{COMMUNITY_MENU_LIST.map((menu) => {
					return (
						<Link
							href={menu.path}
							key={menu.id}
							className={`p-2 ${pathname === menu.path ? "text-primary-green-500 border-b-2 !border-primary-green-500" : "text-black-300 border-b-2 !border-transparent"} hover:text-primary-green-500`}
						>
							{menu.title}
						</Link>
					);
				})}
			</header>
		</>
	);
}

export default CommunityHeader;
