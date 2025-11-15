"use client";

import { useState } from "react";

import { CommunityMain } from "@/app/_components/community";
import { useGetCourseProgressQuery } from "@/app/queries";

function Community() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const {
		data: courseItems,
		isLoading,
		error,
	} = useGetCourseProgressQuery(currentPage, pageSize);

	console.log(courseItems);

	if (isLoading) return <p>강의 로딩 중...</p>;
	if (error) return <p>강의 불러오기 실패</p>;

	return (
		<div className="flex flex-col mt-16">
			<CommunityMain
				mode="LEARNER"
				courses={courseItems?.items || []}
				coursePagination={courseItems?.pagination}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}

export default Community;
