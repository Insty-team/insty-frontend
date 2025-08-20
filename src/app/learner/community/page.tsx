import { CommunityMain } from "@/app/_components/community";

function Community() {
	const enrolledCourses = [
		{
			courseId: 1,
			title: "string",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["string"],
			thumbnailUrl: "/dog.png",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 2,
			title: "string",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["string"],
			thumbnailUrl: "/dog.png",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
	];

	// 특정 강좌에 대한 질문 리스트 응답 데이터
	const questions = [
		{
			user: {
				id: 123,
				nickname: "string",
				userType: "LEARNER",
			},
			courseId: 1,
			questionId: 1,
			title: "string",
			content: "string",
			isAnswered: "COMPLETE" as const,
			createdAt: "2025-08-05T07:50:19.007Z",
			updatedAt: "2025-08-05T07:50:19.007Z",
		},
		{
			user: {
				id: 123,
				nickname: "string",
				userType: "LEARNER",
			},
			courseId: 2,
			questionId: 2,
			title: "string",
			content: "string",
			isAnswered: "HAS_COMMENT" as const,
			createdAt: "2025-08-05T07:50:19.007Z",
			updatedAt: "2025-08-05T07:50:19.007Z",
		},
	];

	return (
		<div className="flex flex-col mt-16">
			<CommunityMain
				courses={enrolledCourses}
				questions={questions}
				mode="LEARNER"
			/>
		</div>
	);
}

export default Community;
