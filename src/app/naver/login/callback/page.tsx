"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import Loading from "@/app/_components/common/Loading";
import { postSocialLogin } from "@/app/api/backend";
import { useAuthStore, useUserStore } from "@/app/stores";
import { UserType } from "@/app/types";

function NaverCallbackClient() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const code = searchParams.get("code");
	const state = searchParams.get("state");

	const { setAccessToken, setRefreshToken } = useAuthStore();
	const { setUser, setUserType } = useUserStore();

	useEffect(() => {
		if (!code || !state) {
			return;
		}

		const sendCodeToBackend = async () => {
			try {
				const res = await postSocialLogin("NAVER", {
					code: code,
					userType: state as UserType,
				});
				setAccessToken(res.token.accessToken);
				setRefreshToken(res.token.refreshToken);

				setUser({
					nickname: res.nickname,
					userType: res.userType,
				});

				if (res.userType === "CREATOR") {
					setUserType("CREATOR");
					router.push("/creator/dashboard");
				} else {
					setUserType("LEARNER");
					router.push("/learner/recommend");
				}
			} catch (err) {
				console.error("로그인 실패:", err);
				router.replace("/login");
			}
		};

		sendCodeToBackend();
	}, [code, router]);

	return (
		<div className="flex flex-row justify-center items-center h-screen">
			<p className="mr-2">네이버 로그인 중...</p>
			<Loading />
		</div>
	);
}

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-row justify-center items-center h-screen">
					<p className="mr-2">네이버 로그인 중...</p>
					<Loading />
				</div>
			}
		>
			<NaverCallbackClient />
		</Suspense>
	);
}
