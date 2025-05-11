import LoginHeader from "./_components/LoginHeader";

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<LoginHeader />
			<main>{children}</main>
		</>
	);
}
