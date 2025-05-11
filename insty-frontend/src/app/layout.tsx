"use client";

import "./globals.css";
import { RunnerHeader } from "./_components";
import { usePathname } from "next/navigation";

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";

	return (
		<html lang="en">
			<body className="font-sans flex-1">
				{!isLoginPage && (
					<header className="flex justify-center shadow-line-100">
						<RunnerHeader />
					</header>
				)}
				<main>{children}</main>
			</body>
		</html>
	);
}

export default RootLayout;
