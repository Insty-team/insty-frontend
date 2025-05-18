"use client";
import { ReactNode } from "react";
import MyPageCreatorSide from "./_components/MyPageCreatorSide";

type MyPageLayoutProps = {
	children: ReactNode;
};

function MyPageLayout({ children }: MyPageLayoutProps) {
	return (
		<>
			<div className="flex w-full mt-16">
				<aside className="w-1/4">
					<MyPageCreatorSide />
				</aside>
				<section className="flex justify-center w-3/4">{children}</section>
			</div>
		</>
	);
}

export default MyPageLayout;
