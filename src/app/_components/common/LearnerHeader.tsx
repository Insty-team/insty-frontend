"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { GoBellFill, GoChevronDown, GoChevronUp } from "react-icons/go";
import Swal from "sweetalert2";

import { postLogout, postReissueToken } from "@/app/api/backend";
import { LEARNER_MENU_LIST } from "@/app/constants";
import {
	useGetUserProfileInfoQuery,
	usePatchUserTypeMutation,
} from "@/app/queries";
import { queryClient } from "@/app/queries/queryClient";
import { useAuthStore, useUserStore } from "@/app/stores";
import { getRefreshToken, setAccessToken, setRefreshToken } from "@/app/utils";

import BaseDropdown from "./BaseDropdown";

function LearnerHeader() {
	const pathname = usePathname();
	const router = useRouter();

	// 드롭다운 메뉴 핸들링
	const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

	const { user, setUserType, resetUser } = useUserStore();
	const { resetAllTokens } = useAuthStore();

	const { data: userInfo } = useGetUserProfileInfoQuery();
	const { mutate: patchUserType } = usePatchUserTypeMutation();

	const recommend = LEARNER_MENU_LIST[0];
	const mypage = LEARNER_MENU_LIST[1];

	const changeUserType = () => {
		Swal.fire({
			title: "전환 하시겠어요?",
			text: "전환 후 현재 페이지는 보이지 않습니다.",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "전환하기",
			cancelButtonText: "취소",
			confirmButtonColor: "#6ead79",
			cancelButtonColor: "#ff4f64",
		}).then((result) => {
			if (result.isConfirmed) {
				const typeToChange =
					user.userType === "LEARNER" ? "CREATOR" : "LEARNER";
				patchUserType(typeToChange, {
					onSuccess: async (res) => {
						setUserType(res.userType);

						// 모든 쿼리 무효화하여 새로운 권한으로 재조회
						await queryClient.invalidateQueries();

						// ACCESS TOKEN 재발급 - 새로운 권한 정보 반영
						try {
							const refreshToken = getRefreshToken();
							if (!refreshToken) {
								Swal.fire({
									title: "토큰이 만료되었습니다.",
									text: "다시 로그인해주세요.",
									icon: "warning",
								}).then(() => {
									resetUser();
									resetAllTokens();
									router.replace("/login");
								});
								return;
							}
							const tokenRes = await postReissueToken(refreshToken);
							setAccessToken(tokenRes.token.accessToken);
							setRefreshToken(tokenRes.token.refreshToken);
							//console.log("토큰 재발급 완료:", tokenRes.token.accessToken);
						} catch (tokenError) {
							console.error("토큰 재발급 실패:", tokenError);
							Swal.fire({
								title: "권한 업데이트 필요",
								text: "새로운 권한 적용을 위해 다시 로그인해주세요.",
								icon: "info",
							}).then(() => {
								resetUser();
								resetAllTokens();
								router.replace("/login");
							});
							return;
						}

						// 사용자 정보 재조회
						await queryClient.refetchQueries({ queryKey: ["userProfile"] });

						// 약간의 딜레이 후 페이지 이동
						setTimeout(() => {
							if (res.userType === "LEARNER") {
								router.replace("/learner/recommend");
							} else {
								//나중 개발 시 바꿔야할 루트
								router.replace("/creator/courses");
							}
						}, 300);
					},
					onError: (error) => {
						console.error("사용자 타입 변경 실패:", error);
						Swal.fire({
							title: "전환 실패",
							text: "사용자 타입 전환에 실패했습니다. 다시 시도해주세요.",
							icon: "error",
						});
					},
				});
			}
		});
	};

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
					//로그아웃시 액세스 및 리프레시 관련 모두 초기화시켜야 나중에 소셜로그인할 때 문제 없는 듯?
					resetUser();
					resetAllTokens();
					router.push("/login");
				} catch (error) {
					console.error("Logout error:", error);
				}
			}
		});
	};

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
								} hover:text-primary-green-500`}

								// className={`${
								// 	pathname.includes(menu.path)
								// 		? "text-primary-green-600"
								// 		: "text-black-400"
								// } ${menu.title === "커뮤니티" ? "cursor-not-allowed text-gray-300" : "hover:text-primary-green-500"}`}
								// onClick={(e) => {
								// 	if (menu.title === "커뮤니티") {
								// 		e.preventDefault();
								// 	}
								// }}
							>
								{menu.title}
							</Link>
						))}
					</div>
				</div>
				<div className="flex gap-8 justify-center items-center">
					<GoBellFill className="cursor-not-allowed size-8 text-gray-300" />
					<Link href={mypage.path} key={mypage.id} className="aspect-square">
						{userInfo?.thumbnailUrl ? (
							<Image
								src={userInfo?.thumbnailUrl}
								alt="profile"
								width={30}
								height={30}
								className="rounded-full object-cover"
								style={{ width: "30px", height: "30px" }}
								priority
							/>
						) : (
							<FaCircleUser className="cursor-pointer size-7.5 text-gray-300" />
						)}
					</Link>
					<BaseDropdown
						isOpen={isDropdownMenuOpen}
						setIsOpen={setIsDropdownMenuOpen}
						trigger={
							<button className="--text-2lg font-medium cursor-pointer">
								<div className="flex gap-2 items-center justify-center">
									<span>{userInfo?.nickname}</span>
									{isDropdownMenuOpen ? (
										<GoChevronUp size={20} />
									) : (
										<GoChevronDown size={20} />
									)}
								</div>
							</button>
						}
						items={[
							{
								label: "🔄 크리에이터로 전환",
								onClick: () => changeUserType(),
							},
							{
								label: "🚪 로그아웃",
								onClick: () => handleLogout(),
								danger: true,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}

export default LearnerHeader;
