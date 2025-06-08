"use client";

import PreviewInfomation from "@/app/creator/videos/_component/upload/PreviewInfomation";

function CourseDetail() {
	//더미데이터...
	const dummyVideoData = {
		link: "https://example.com/video/1",
		title: "설치 가이드 주제 설치 가이드",
		recipient: "초보자",
		description:
			"파이썬 개발 환경과 RTX 3060 드라이버 설치를 다루는 영상입니다.",
		price: 199990,
		tags: [
			"열글자열글자열글자1",
			"열글자열글자열글자2",
			"열글자열글자열글자3",
			"열글자열글자열글자4",
			"열글자열글자열글자5",
			"열글자열글자열글자6",
		],
		environments: [
			{ value: "Windows 10 / 11 환경", support: "지원" },
			{ value: "RTX 3060 이상 GPU", support: "지원" },
			{ value: "Visual Studio Code 설치 필요", support: "지원" },
			{ value: "conda / pip 가상 환경 설정", support: "지원" },
			{ value: "Mac 환경", support: "미지원" },
		],
		coreContents: [
			"파이썬 개발 환경 설치 (Windows 기준)",
			"RTX 3060 사용자 드라이버 / 호환 설정",
			"파이썬 및 텐서플로 프로젝트 설정",
			"실습 및 베스트 프랙티스 소개",
		],
	};

	return (
		<PreviewInfomation data={dummyVideoData} onEdit={() => {}} mode="learner" />
	);
}

export default CourseDetail;
