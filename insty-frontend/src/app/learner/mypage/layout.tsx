"use client";
import { ReactNode } from "react";
import MyPageLearnerSide from "./_components/MyPageLearnerSide";

type MyPageLayoutProps = {
	children: ReactNode;
};

function MyPageLayout({ children }: MyPageLayoutProps) {
	return (
		<>
			<div className="flex w-full mt-16">
				<aside className="w-1/4">
					<MyPageLearnerSide />
				</aside>
				<section className="flex justify-center w-3/4">{children}</section>
			</div>
		</>
	);
}

export default MyPageLayout;
