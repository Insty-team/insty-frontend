"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { GoBellFill } from "react-icons/go";

import { CREATOR_MENU_LIST } from "@/app/constants";
import { postLogout } from "@/app/api/backend/auth";
import { useUserStore } from "@/app/stores/user";
import Swal from "sweetalert2";
import { useGetUserProfileInfoQuery } from "@/app/queries";
import BaseDropdown from "./BaseDropdown";

function CreatorHeader() {
	const pathname = usePathname();

	const dashboard = CREATOR_MENU_LIST[0];
	const mypage = CREATOR_MENU_LIST[2];
	const router = useRouter();
	const { resetUser } = useUserStore();

	const handleLogout = async () => {
		Swal.fire({
			title: "로그아웃 하시겠어요?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "로그아웃",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await postLogout();
					resetUser();
					localStorage.removeItem("accessToken");
					router.push("/login");
				} catch (error) {
					console.error("Logout error:", error);
				}
			}
		});
	};

	const { data: userInfo } = useGetUserProfileInfoQuery();

	return (
		<div className="flex justify-between items-center">
			<div className="w-[1400px] h-[88px] flex justify-between">
				<div className="flex gap-20">
					<Link
						href={dashboard.path}
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
						{CREATOR_MENU_LIST.map((menu) => (
							<Link
								href={`${menu.path}`}
								key={menu.id}
								className="cursor-pointer hover:text-primary-green-500"
							>
								<span
									className={
										pathname.includes(menu.path) ? "text-primary-green-600" : ""
									}
								>
									{menu.title}
								</span>
							</Link>
						))}
					</div>
				</div>
				<div className="flex gap-8 justify-center items-center">
					<GoBellFill className="cursor-pointer size-8 text-gray-300" />
					<Link href={mypage.path} key={mypage.id}>
						<FaCircleUser className="cursor-pointer size-7.5 text-gray-300" />
					</Link>
					<BaseDropdown
						trigger={
							<button className="--text-2lg font-medium cursor-pointer">
								{userInfo?.nickname}
							</button>
						}
						items={[
							{ label: "사용자 타입 변경", onClick: () => console.log("마이페이지") },
							{ label: "로그아웃", onClick: () => handleLogout(), danger: true },
						]}
					/>
				</div>
			</div>
		</div>
	);
}

export default CreatorHeader;
