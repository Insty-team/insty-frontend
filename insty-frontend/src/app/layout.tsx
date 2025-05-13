"use client";

import "./globals.css";

function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="font-sans flex-1">
				<main>{children}</main>
			</body>
		</html>
	);
}

export default RootLayout;
