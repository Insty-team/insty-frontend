"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { GoBellFill } from "react-icons/go";

import { LEARNER_MENU_LIST } from "@/app/constants";

function LearnerHeader() {
	const pathname = usePathname();
	const recommend = LEARNER_MENU_LIST[0];

	return (
		<div className="flex justify-between items-center w-full px-4">
			<div className="w-full max-w-[1400px] h-[88px] flex justify-between mx-auto">
				<div className="flex gap-20">
					<Link
						href={recommend.path}
						className="flex justify-center items-center"
					>
						<Image
							className="object-contain"
							src="/insty.png"
							alt="logo"
							width={72}
							height={63}
						/>
					</Link>
					<div className="flex justify-center items-center gap-24 cursor-pointer --text-2lg font-bold">
						{LEARNER_MENU_LIST.map((menu) => (
							<Link
								key={menu.id}
								href={menu.path}
								className={`${
									pathname.includes(menu.path)
										? "text-primary-green-600"
										: "text-black-400"
								}`}
							>
								{menu.title}
							</Link>
						))}
					</div>
				</div>
				<div className="flex gap-8 justify-center items-center">
					<GoBellFill className="cursor-pointer size-8 text-gray-300" />
					<FaCircleUser className="cursor-pointer size-7.5 text-gray-300" />
					<span className="--text-2lg font-medium">김가나</span>
				</div>
			</div>
		</div>
	);
}

export default LearnerHeader;
