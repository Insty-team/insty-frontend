"use client";

import { useState } from "react";

import { CommunityMain } from "@/app/_components/community/";
import { useGetMyCoursesQuery } from "@/app/queries";

function CreatorCommunity() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const {
		data: courseItems,
		isLoading,
		error,
	} = useGetMyCoursesQuery(currentPage, pageSize);

	if (isLoading) return <p>강의 로딩 중...</p>;
	if (error) return <p>강의 불러오기 실패</p>;

	return (
		<div className="flex flex-col mt-16">
			<CommunityMain
				mode="CREATOR"
				courses={courseItems?.items || []}
				coursePagination={courseItems?.pagination}
				currentPage={currentPage}
				onPageChange={setCurrentPage} // 페이지 변경 콜백
			/>
		</div>
	);
}

export default CreatorCommunity;
