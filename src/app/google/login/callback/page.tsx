"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import Loading from "@/app/_components/common/Loading";
import { postSocialLogin } from "@/app/api/backend";
import { useAuthStore, useUserStore } from "@/app/stores";
import { UserType } from "@/app/types";

function GoogleCallbackClient() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const code = searchParams.get("code");
	const state = searchParams.get("state");

	const { setAccessToken, setRefreshToken } = useAuthStore();
	const { setUser, setUserType } = useUserStore();

	useEffect(() => {
		if (!code || !state) {
			console.log("구글 콜백: code 또는 state가 없음", { code, state });
			return;
		}

		console.log("구글 콜백 시작:", {
			code: `${code?.substring(0, 20)}...`, // 보안상 일부만 표시
			state,
			fullUrl: window.location.href,
		});

		const sendCodeToBackend = async () => {
			try {
				console.log("백엔드 API 호출 전 - Google");

				const requestData = {
					code: code,
					userType: state as UserType,
				};
				console.log("전송할 데이터:", requestData);

				const res = await postSocialLogin("GOOGLE", requestData);

				console.log("구글 백엔드 API 응답 성공:", res);

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
			} catch (err: unknown) {
				console.error("구글 로그인 실패 상세:", err);
				console.error("오류 타입:", typeof err);
				if (err instanceof Error) {
					console.error("오류 메시지:", err.message);
				}
				if (err && typeof err === "object" && "response" in err) {
					const axiosError = err as {
						response: { data: unknown; status: number; statusText: string };
					};
					console.error("HTTP 상태:", axiosError.response.status);
					console.error("상태 텍스트:", axiosError.response.statusText);
					console.error("응답 데이터:", axiosError.response.data);
				}
				if (err && typeof err === "object" && "config" in err) {
					const axiosError = err as {
						config: { url: string; method: string; data: unknown };
					};
					console.error("요청 URL:", axiosError.config.url);
					console.error("요청 메소드:", axiosError.config.method);
					console.error("요청 데이터:", axiosError.config.data);
				}
				router.replace("/login");
			}
		};

		sendCodeToBackend();
	}, [code, router]);

	return (
		<div className="flex flex-row justify-center items-center h-screen">
			<p className="mr-2">구글 로그인 중...</p>
			<Loading />
		</div>
	);
}

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-row justify-center items-center h-screen">
					<p className="mr-2">구글 로그인 중...</p>
					<Loading />
				</div>
			}
		>
			<GoogleCallbackClient />
		</Suspense>
	);
}
