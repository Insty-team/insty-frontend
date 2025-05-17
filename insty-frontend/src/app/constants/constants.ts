/**
 * 전역으로 사용하는 상수(데이터, 문자 등)를 정의하는 파일입니다.
 */

// Creator 크리에이터 관련
export const creatorMenuList = [
	{ id: 1, title: "대시보드", path: "/creator/dashboard" },
	{ id: 2, title: "영상 관리", path: "/creator/videos" },
	{ id: 3, title: "마이페이지", path: "/creator/mypage" },
	{ id: 4, title: "커뮤니티", path: "/creator/community" },
];

export const creatorMyPageMenuList = [
  { id: 1, title: "나의 정보 관리", path: "/creator/mypage/profile"},
  { id: 2, title: "내 계좌 정보", path: "/creator/mypage/account"},
  { id: 3, title: "설정", path: "/creator/mypage/setting"}, 
]


// Learner 러너 관련
export const learnerMenuList = [
	{ id: 1, title: "맞춤 콘텐츠 추천", path: "/learner/recommend" },
	{ id: 2, title: "마이페이지", path: "/learner/mypage" },
	{ id: 3, title: "커뮤니티", path: "/learner/community" },
];
