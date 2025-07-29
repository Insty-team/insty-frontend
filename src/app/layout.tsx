"use client";

import "./globals.css";

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
		// 토큰 유효성 검증
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
					content="복잡한 프로그래밍 설치와 환경 설정을 AI가 도와드립니다. 맞춤형 강의 추천과 실시간 AI 학습 도우미로 더 쉽게 배우세요."
				/>
				<meta
					name="keywords"
					content="프로그래밍, 설치, 설정, AI 학습, 온라인 강의, 개발자, 코딩, 환경설정, 인스티, 크리에이터, 러너"
				/>
				<meta name="author" content="Insty" />
				<meta name="robots" content="index, nofollow" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://insty.co.kr" />
				<meta
					property="og:title"
					content="Insty - AI가 도와주는 프로그래밍 설치/설정 온라인 강의 플랫폼"
				/>
				<meta
					property="og:description"
					content="복잡한 프로그래밍 설치와 환경 설정을 AI가 도와드립니다. 맞춤형 강의 추천과 실시간 AI 학습 도우미로 더 쉽게 배우세요."
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
					content="복잡한 프로그래밍 설치와 환경 설정을 AI가 도와드립니다. 맞춤형 강의 추천과 실시간 AI 학습 도우미로 더 쉽게 배우세요."
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
