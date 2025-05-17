"use client";
import { ReactNode } from "react";
import MyPageCreatorSide from "./_components/MyPageCreatorSide";

type MyPageLayoutProps = {
	children: ReactNode;
};

function MyPageLayout({ children }: MyPageLayoutProps) {
	return (
		<>
			<div className="flex gap-40">
				<aside>
					<MyPageCreatorSide />
				</aside>
				<main>{children}</main>
			</div>
		</>
	);
}

export default MyPageLayout;
