"use client";

import "./globals.css";

import * as Amplitude from "@amplitude/analytics-browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { PUBLIC_PAGE_PATH } from "./constants";
import Providers from "./Providers";
import { useAuthStore } from "./stores";

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();
	const pathname = usePathname();
	const router = useRouter();
	const [checked, setChecked] = useState(false);
	const { validateTokens } = useAuthStore();

	useEffect(() => {
		Amplitude.init("96956b141cb227bb60c1538af1da14f0", {
			autocapture: true,
			trackingOptions: {
				language: true,
				platform: true,
			},
		});
	}, []);

	//토큰 검증
	useEffect(() => {
		const isValidToken = validateTokens();

		const isPublicPage = PUBLIC_PAGE_PATH.includes(pathname);
		if (!isValidToken && !isPublicPage) {
			Swal.fire({
				title: "로그인이 필요한 페이지입니다.",
				icon: "error",
				confirmButtonText: "확인",
			}).then(() => {
				router.push("/login");
			});
		} else {
			setChecked(true);
		}
	}, [pathname, router, validateTokens]);

	return (
		<html lang="ko">
			<head>
				<title>Insty</title>
				<meta
					name="title"
					content="AI가 도와주는 프로그래밍 설치/설정 온라인 강의 플랫폼"
				/>
				<meta
					name="description"
					content="Insty는 설치와 세팅이 막막한 모든 사람을 위한 영상 플랫폼입니다. 누구나 크리에이터가 되어 도구 설치 방법을 공유하고, 러너로서 따라하며 배울 수 있어요."
				/>
				<meta
					name="keywords"
					content="크리에이터, 러너, 설치 방법, 사용법, 환경 구축, 사용법 강의, 프로그램 설치, 설정 가이드, 셋업 가이드, 튜토리얼, 매뉴얼, 초기 세팅, 설치 오류 해결, 설치 도우미, AI 설치 도우미, AI 설치 가이드"
				/>
				<meta name="author" content="Insty" />
				<meta name="robots" content="index, nofollow" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://insty.ai.kr" />
				<meta
					property="og:title"
					content="Insty - AI가 도와주는 프로그래밍 설치/설정 온라인 강의 플랫폼"
				/>
				<meta
					property="og:description"
					content="Insty는 설치와 세팅이 막막한 모든 사람을 위한 영상 플랫폼입니다. 누구나 크리에이터가 되어 도구 설치 방법을 공유하고, 러너로서 따라하며 배울 수 있어요."
				/>
				<meta property="og:image" content="/insty.png" />
				<meta property="og:site_name" content="Insty" />
				<meta property="og:locale" content="ko_KR" />

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://insty.ai.kr" />
				<meta
					property="twitter:title"
					content="Insty - AI가 도와주는 프로그래밍 설치/설정 온라인 강의 플랫폼"
				/>
				<meta
					property="twitter:description"
					content="Insty는 설치와 세팅이 막막한 모든 사람을 위한 영상 플랫폼입니다. 누구나 크리에이터가 되어 도구 설치 방법을 공유하고, 러너로서 따라하며 배울 수 있어요."
				/>
				<meta property="twitter:image" content="/insty.png" />

				{/* 추가 SEO */}
				<meta name="theme-color" content="#6ead79" />
				<link rel="canonical" href="https://insty.ai.kr" />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body className="font-sans flex-1">
				<main>
					<QueryClientProvider client={queryClient}>
						<Providers>{checked ? children : null}</Providers>
					</QueryClientProvider>
				</main>
			</body>
		</html>
	);
}

export default RootLayout;
