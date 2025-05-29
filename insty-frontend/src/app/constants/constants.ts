/**
 * 전역으로 사용하는 상수(데이터, 문자 등)를 정의하는 파일입니다.
 * 모든 상수는 `UpperCase`로 작성하고 `underscore(_)`로 구분합니다.
 */

// Creator 크리에이터 관련
export const CREATOR_MENU_LIST = [
	{ id: 1, title: "대시보드", path: "/creator/dashboard" },
	{ id: 2, title: "영상 관리", path: "/creator/videos" },
	{ id: 3, title: "마이페이지", path: "/creator/mypage" },
	{ id: 4, title: "커뮤니티", path: "/creator/community" },
];

export const CREATOR_MYPAGE_MENU_LIST = [
	{ id: 1, title: "나의 정보 관리", path: "/creator/mypage/profile" },
	{ id: 2, title: "내 계좌 정보", path: "/creator/mypage/account" },
	{ id: 3, title: "설정", path: "/creator/mypage/setting" },
];

// Learner 러너 관련
export const LEARNER_MENU_LIST = [
	{ id: 1, title: "맞춤 콘텐츠 추천", path: "/learner/recommend" },
	{ id: 2, title: "마이페이지", path: "/learner/mypage" },
	{ id: 3, title: "커뮤니티", path: "/learner/community" },
];

export const LEARNER_MYPAGE_MENU_LIST = [
	{ id: 1, title: '나의 정보 관리', path: '/learner/mypage/profile'},
	{ id: 2, title: '내 활동', path: '/learner/mypage/activity'},
	{ id: 3, title: 'AI 챗봇 질문 이력', path: '/learner/mypage/ai'},
	{ id: 4, title: '구매 내역', path: '/learner/mypage/buy'},
	{ id: 5, title: '찜한 영상', path: '/learner/mypage/like'},
	{ id: 6, title: '설정', path: '/learner/mypage/setting'},
]

//영상 관리 헤더에 사용
export const VIDEOS_HEADER_LIST = [
    { id: "manage", title: "영상 관리" },
    { id: "upload", title: "영상 업로드" },
    { id: "revenue", title: "수익 확인하기" },
];

//더미 데이터
export const VIDEOS_DUMMY_LIST = [
	{
		id: 1,
		title:
			"영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목1",
		thumbnail: "/dog.png",
		tags: [
			"RTX 3060",
			"우분투",
			"리눅스",
			"windows",
			"macOS",
			"RTX 3060",
			"우분투",
			"리눅스",
			"windows",
			"macOS",
		],
		views: "999,999,999회",
		uploadDate: "2025년 04월 09일",
		price: "999,999,999원",
		detailUrl: "#",
		editUrl: "#",
	},
	{
		id: 2,
		title:
			"영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목2",
		thumbnail: "/dog.png",
		tags: [
			"RTX 3060",
			"우분투",
			"리눅스",
			"windows",
			"macOS",
			"RTX 3060",
			"우분투",
			"리눅스",
			"windows",
			"macOS",
		],
		views: "999,999,999회",
		uploadDate: "2025년 04월 09일",
		price: "999,999,999원",
		detailUrl: "#",
		editUrl: "#",
	},
	{
		id: 3,
		title:
			"영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목 영상 제목3",
		thumbnail: "/dog.png",
		tags: [
			"RTX 3060",
			"우분투",
			"리눅스",
			"windows",
			"macOS",
			"RTX 3060",
			"우분투",
			"리눅스",
			"windows",
			"macOS",
		],
		views: "999,999,999회",
		uploadDate: "2025년 04월 09일",
		price: "999,999,999원",
		detailUrl: "#",
		editUrl: "#",
	},
];
