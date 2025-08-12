import { CommunityMain } from "@/app/_components/community/";

function CreatorCommunity() {
	const uploadCourses = [
		{
			courseId: 1,
			title:
				"M1 맥북에서 파이썬 설치하는 기가막힌 방법을 알아볼까요? 놀라지마세요.",
			price: 0,
			viewCount: 0,
			commentCount: 1000,
			tags: ["Python", "맥북", "설치"],
			thumbnailUrl: "/dog.png",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 2,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 3,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 4,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 5,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 6,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 7,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
		{
			courseId: 8,
			title: "Homebrew를 활용하여 맥북에서 Flutter 초기세팅하기",
			price: 0,
			viewCount: 0,
			commentCount: 0,
			tags: ["Flutter", "맥북", "초기세팅"],
			thumbnailUrl: "/cat.jpeg",
			isShow: true,
			createdAt: "2025-08-05T07:28:08.017Z",
		},
	];

	const myCourseQuestions = [
		{
			user: { id: 123, nickname: "닉네임", userType: "LEARNER" },
			courseId: 1,
			questionId: 1,
			title:
				"M1 맥북에서 Python 가상환경 만들 때 라이브러리 충돌 문제 어떻게 해결하나요?",
			content:
				"venv로 가상환경 만들었는데, 라이브러리 버전 충돌이 심해요. best practice가 뭘까요? conda랑 venv 중 뭐가 더 낫나요?",
			isAnswered: "COMPLETE" as const,
			createdAt: "2025-08-05T07:50:19.007Z",
			updatedAt: "2025-08-05T07:50:19.007Z",
		},
		{
			user: { id: 456, nickname: "닉네임", userType: "LEARNER" },
			courseId: 1,
			questionId: 2,
			title:
				"Homebrew 설치 후 'command not found' 에러가 계속 뜨는데, 혹시 경로 문제일까요?",
			content:
				"brew는 설치됐는데 터미널에서 brew 명령어가 안 먹어요. zsh 프로필에 경로 추가해야 하는데 어떻게 해야 할까요?",
			isAnswered: "NONE" as const,
			createdAt: "2025-08-05T07:55:10.007Z",
			updatedAt: "2025-08-05T07:55:10.007Z",
		},
		{
			user: { id: 789, nickname: "닉네임", userType: "LEARNER" },
			courseId: 1,
			questionId: 3,
			title:
				"Python 설치 시 Rosetta2 에뮬레이션을 써야 하나요? 아니면 네이티브 설치가 더 좋은가요?",
			content:
				"M1 맥북에 Python을 설치하는데 Rosetta2를 깔아서 x86 환경에서 쓰는 게 좋을지, 아니면 arm64 네이티브로 쓰는 게 성능상 더 좋을까요?",
			isAnswered: "NONE" as const,
			createdAt: "2025-08-05T08:10:00.007Z",
			updatedAt: "2025-08-05T08:10:00.007Z",
		},
		{
			user: { id: 234, nickname: "닉네임", userType: "LEARNER" },
			courseId: 1,
			questionId: 4,
			title:
				"파이썬 패키지 설치할 때 pip 대신 poetry를 써보려고 하는데, 어떤 장점이 있을까요?",
			content:
				"poetry를 처음 써보려 하는데 pip랑 어떤 차이가 있고, 실제 현업에서 잘 쓰이나요? 입문자가 배우기 괜찮을까요?",
			isAnswered: "NONE" as const,
			createdAt: "2025-08-05T08:20:00.007Z",
			updatedAt: "2025-08-05T08:20:00.007Z",
		},
		{
			user: { id: 456, nickname: "닉네임", userType: "LEARNER" },
			courseId: 1,
			questionId: 5,
			title:
				"Homebrew로 설치한 패키지가 업데이트가 안 돼요, 어떻게 해야 할까요?",
			content:
				"brew update, upgrade 다 해봤는데 특정 패키지가 버전이 안 올라가네요. 캐시 문제일까요? 강제로 업데이트 하는 방법이 있을까요?",
			isAnswered: "NONE" as const,
			createdAt: "2025-08-05T08:30:00.007Z",
			updatedAt: "2025-08-05T08:30:00.007Z",
		},
		{
			user: { id: 123, nickname: "닉네임", userType: "LEARNER" },
			courseId: 1,
			questionId: 6,
			title: "맥북에서 VSCode로 디버깅할 때 Python breakpoints가 안 작동해요",
			content:
				"디버그 설정은 했는데 breakpoint가 무시되고 지나갑니다. launch.json 설정 문제일까요? 해결 방법 알려주세요!",
			isAnswered: "HAS_COMMENT" as const,
			createdAt: "2025-08-05T08:40:00.007Z",
			updatedAt: "2025-08-05T08:40:00.007Z",
		},
		{
			user: { id: 456, nickname: "닉네임", userType: "LEARNER" },
			courseId: 2,
			questionId: 7,
			title:
				"Flutter 설치 후 'flutter doctor'에서 Xcode 경로를 못 찾는다고 나와요",
			content:
				"Flutter 개발하려는데 flutter doctor에서 Xcode 설치가 안 됐다고 뜨네요. xcode-select --install 해봤는데도 안 되는데 어떻게 해야 할까요?",
			isAnswered: "HAS_COMMENT" as const,
			createdAt: "2025-08-05T08:45:00.007Z",
			updatedAt: "2025-08-05T08:45:00.007Z",
		},
		{
			user: { id: 789, nickname: "닉네임", userType: "LEARNER" },
			courseId: 2,
			questionId: 8,
			title:
				"Flutter에서 핫리로드가 안 먹히고 전체 빌드만 돼요. 해결법 있나요?",
			content:
				"개발 속도가 너무 느려서 핫리로드를 써보고 싶은데 안 먹히네요. 최신 Flutter 버전인데도 그러면 버그일까요?",
			isAnswered: "HAS_COMMENT" as const,
			createdAt: "2025-08-05T08:50:00.007Z",
			updatedAt: "2025-08-05T08:50:00.007Z",
		},
		{
			user: { id: 234, nickname: "닉네임", userType: "LEARNER" },
			courseId: 2,
			questionId: 9,
			title:
				"Flutter 앱에서 네비게이션이 꼬였어요, 다시 초기화하는 방법 알려주세요",
			content:
				"Navigator.push를 너무 많이 써서 스택이 엉켰는데 초기화하는 가장 깔끔한 방법이 궁금해요.",
			isAnswered: "HAS_COMMENT" as const,
			createdAt: "2025-08-05T08:55:00.007Z",
			updatedAt: "2025-08-05T08:55:00.007Z",
		},
	];

	return (
		<div className="flex flex-col mt-16">
			<CommunityMain courses={uploadCourses} questions={myCourseQuestions} />
		</div>
	);
}

export default CreatorCommunity;
