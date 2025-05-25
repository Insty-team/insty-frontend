"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LEARNER_MENU_LIST } from "@/app/constants/constants";

function LearnerHeader() {
	const pathname = usePathname();

	return (
		<div className="flex justify-between items-center w-full px-4">
			<div className="w-full max-w-[1400px] h-[88px] flex justify-between mx-auto">
				<div className="flex gap-20">
					<Image
						className="object-contain"
						src="/insty.png"
						alt="logo"
						width={72}
						height={63}
					/>
					<div className="flex justify-center items-center gap-24 cursor-pointer --text-2lg font-bold">
						{LEARNER_MENU_LIST.map((menu) => (
							<span key={menu.id} className={`${pathname === menu.path ? "text-primary-green-600" : "text-black-400"}`}>{menu.title}</span>
						))}
					</div>
				</div>
				<div className="flex gap-8 justify-center items-center">
					<Image
						className="cursor-pointer"
						src="/alram.svg"
						alt="alram"
						width={36}
						height={36}
					/>
					<Image
						className="cursor-pointer"
						src="/profile.svg"
						alt="profile"
						width={36}
						height={36}
					/>
					<span className="--text-2lg font-medium">김가나</span>
				</div>
			</div>
		</div>
	);
}

export default LearnerHeader;
