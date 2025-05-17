"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CREATOR_MENU_LIST } from "@/app/constants/constants";

function CreatorHeader() {
	const pathname = usePathname();

	return (
		<div className="flex justify-between items-center">
			<div className="w-[1400px] h-[88px] flex justify-between">
				<div className="flex gap-20">
					<Image
						className="object-contain"
						src="/insty.png"
						alt="logo"
						width={72}
						height={63}
					/>
					<div className="flex justify-center items-center gap-24 cursor-pointer --text-2lg font-bold">
						{CREATOR_MENU_LIST.map((menu) => (
							<Link href={`${menu.path}`} key={menu.id}>
								<span
									className={
										pathname === menu.path ? "text-primary-blue-600" : ""
									}
								>
									{menu.title}
								</span>
							</Link>
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
					<Link
						href={`${CREATOR_MENU_LIST[2].path}`}
						key={CREATOR_MENU_LIST[2].id}
					>
						<Image
							className="cursor-pointer"
							src="/profile.svg"
							alt="profile"
							width={36}
							height={36}
						/>
					</Link>

					<span className="--text-2lg font-medium">김가나</span>
				</div>
			</div>
		</div>
	);
}

export default CreatorHeader;
