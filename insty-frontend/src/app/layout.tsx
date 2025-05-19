"use client";

import Providers from "./Providers";
import "./globals.css";

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
