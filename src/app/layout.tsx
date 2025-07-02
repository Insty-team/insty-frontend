"use client";

import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { PUBLIC_PAGE_PATH } from "./constants";
import Providers from "./Providers";

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();
	const pathname = usePathname();
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("@insty-app.accessToken");
		const isPublicPage = PUBLIC_PAGE_PATH.includes(pathname);
		if (!token && !isPublicPage) {
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
	}, [pathname, router]);

	return (
		<html lang="ko">
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
