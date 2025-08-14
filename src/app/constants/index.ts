/**
 * 전역으로 사용하는 상수(데이터, 문자 등)를 정의하는 파일입니다.
 * 모든 상수는 `UpperCase`로 작성하고 `underscore(_)`로 구분합니다.
 */

//퍼블릭 페이지(토큰 필요X)
export const PUBLIC_PAGE_PATH = [
	"/",
	"/login",
	"/login/learner",
	"/login/creator",
	"/signup",
	"/kakao/login/callback",
	"/naver/login/callback",
	"/google/login/callback",
];

// localStorage key 관련
export const INSTY_ACCESS_TOKEN_KEY = "@insty-app.accessToken";
export const INSTY_REFRESH_TOKEN_KEY = "@insty-app.refreshToken";
export const INSTY_RECEIVE_EMAIL_KEY = "@insty-app.receive.email";

// Creator 크리에이터 관련
export const CREATOR_MENU_LIST = [
	{ id: 1, title: "대시보드", path: "/creator/dashboard" },
	{ id: 2, title: "강의 관리", path: "/creator/courses" },
	{ id: 3, title: "마이페이지", path: "/creator/mypage" },
	{ id: 4, title: "커뮤니티", path: "/creator/community" },
];

export const CREATOR_MYPAGE_MENU_LIST = [
	{ id: 1, title: "나의 정보 관리" },
	{ id: 2, title: "내 계좌 정보" },
	{ id: 3, title: "이메일 수신 여부" },
];

// Learner 러너 관련
export const LEARNER_MENU_LIST = [
	{ id: 1, title: "맞춤 콘텐츠 추천", path: "/learner/recommend" },
	{ id: 2, title: "마이페이지", path: "/learner/mypage" },
	{ id: 3, title: "커뮤니티", path: "/learner/community" },
];

export const LEARNER_MYPAGE_MENU_LIST = [
	{ id: 1, title: "나의 정보 관리" },
	{ id: 2, title: "내 활동" },
	{ id: 3, title: "강의중 AI 챗봇 질문 이력" },
	{ id: 4, title: "구매 내역" },
	{ id: 5, title: "설정" },
];

export const LEARNER_MYPAGE_ACTIVITY_SUB_MENU = [
	{ id: 1, title: "내가 쓴 글" },
	{ id: 2, title: "내가 댓글을 작성한 게시글" },
	{ id: 3, title: "내가 북마크한 게시글" },
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

//환불 규정 안내
export const REFUND_POLICY = [
	{
		line: 1,
		text: "본 콘텐츠는 디지털 영상 콘텐츠로, 구매 즉시 시청이 가능하여 환불이 제한될 수 있습니다.",
	},
	{
		line: 2,
		text: "단, 결제 후 7일 이내 영상 재생 또는 실습 자료 다운로드 이력이 없는 경우에 한해 환불이 가능합니다.",
	},
	{
		line: 3,
		text: "일부 시청 또는 실습 자료 다운로드 후에는 환불이 불가능 합니다.",
	},
];

export const MAX_FILE_NAME = 150;
export const MAX_VIDEO_DURATION = 15 * 60;

// 커뮤니티 empty data
export const EMPTY_UPLOAD_COURSE = "업로드한 강의가 없습니다.";
export const EMPTY_ENROLLMENT_COURSE = "수강한 강의가 없습니다.";
export const EMPTY_QUESTION = "질문이 없습니다.";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
