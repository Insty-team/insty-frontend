"use client";

import "./globals.css";

import Providers from "./Providers";

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className="font-sans flex-1">
				<main>
					<Providers>{children}</Providers>
				</main>
			</body>
		</html>
	);
}

export default RootLayout;
