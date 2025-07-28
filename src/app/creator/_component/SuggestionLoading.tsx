import React from "react";

import Loading from "@/app/_components/common/Loading";

function SuggestionLoading() {
	return (
		<div className="w-[30%] flex flex-row justify-center items-center gap-4 bg-white p-6 rounded-xl">
			<p className="text-2xl font-semibold text-primary-green-500">
				추천 내용을 생성 중 입니다...
			</p>
			<Loading width={30} height={30} />
		</div>
	);
}

export default SuggestionLoading;
