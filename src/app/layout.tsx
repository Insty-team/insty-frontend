"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

import Providers from "./Providers";

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();
	return (
		<html lang="ko">
			<body className="font-sans flex-1">
				<main>
					<QueryClientProvider client={queryClient}>
						<Providers>{children}</Providers>
					</QueryClientProvider>
				</main>
			</body>
		</html>
	);
}

export default RootLayout;
