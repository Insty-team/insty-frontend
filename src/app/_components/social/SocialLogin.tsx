"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

import { getSocialAuthCode } from "@/app/api/backend";
import { SocialLogin as SocialLoginType } from "@/app/types";

function SocialLogin() {
	const params = useParams();
	const currentPath =
		typeof window !== "undefined" ? window.location.pathname : "";

	const isSignupPage = currentPath.includes("/signup");

	const userType = params.userType as string;

	const handleSocialLogin = async (socialName: SocialLoginType) => {
		try {
			if (isSignupPage) {
				await Swal.fire({
					title: "가입 유형을 선택해주세요",
					html: `
						<div style="display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">
							<button id="creator-btn" style="
								padding: 12px 24px;
								background-color: #6ead79;
								color: white;
								border: none;
								border-radius: 8px;
								font-size: 16px;
								cursor: pointer;
								transition: background-color 0.2s;
							">🎨 크리에이터로 가입</button>
							<button id="learner-btn" style="
								padding: 12px 24px;
								background-color: #4f9cf9;
								color: white;
								border: none;
								border-radius: 8px;
								font-size: 16px;
								cursor: pointer;
								transition: background-color 0.2s;
							">📚 러너로 가입</button>
						</div>
					`,
					showConfirmButton: false,
					showCancelButton: true,
					cancelButtonText: "취소",
					allowOutsideClick: false,
					didOpen: () => {
						const creatorBtn = document.getElementById("creator-btn");
						const learnerBtn = document.getElementById("learner-btn");

						if (creatorBtn) {
							creatorBtn.onclick = async () => {
								Swal.close();
								const res = await getSocialAuthCode(socialName, "CREATOR");
								window.location.href = res;
							};
						}

						if (learnerBtn) {
							learnerBtn.onclick = async () => {
								Swal.close();
								const res = await getSocialAuthCode(socialName, "LEARNER");
								window.location.href = res;
							};
						}
					},
				});
			} else {
				const state = userType === "creator" ? "CREATOR" : "LEARNER";
				const res = await getSocialAuthCode(socialName, state);
				window.location.href = res;
			}
		} catch (error) {
			console.error("소셜 로그인 오류:", error);
			Swal.fire({
				icon: "error",
				title: "오류",
				text: "소셜 로그인 중 오류가 발생했습니다.",
			});
		}
	};

	return (
		<>
			<div className="text-lg text-black-100 font-semibold">
				소셜 로그인으로 간편하게 시작하기
			</div>
			<div className="flex space-x-4 mb-4">
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSocialLogin("KAKAO");
					}}
				>
					<Image
						src="/kakao.svg"
						alt="kakao"
						className="rounded-2xl cursor-pointer"
						width={36}
						height={36}
					/>
				</button>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSocialLogin("GOOGLE");
					}}
				>
					<Image
						src="/google.svg"
						alt="google"
						className="rounded-2xl cursor-pointer"
						width={36}
						height={36}
					/>
				</button>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleSocialLogin("NAVER");
					}}
				>
					<Image
						src="/naver.svg"
						alt="naver"
						className="rounded-2xl cursor-pointer"
						width={36}
						height={36}
					/>
				</button>
			</div>
		</>
	);
}

export default SocialLogin;
