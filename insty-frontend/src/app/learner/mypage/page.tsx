import { redirect } from "next/navigation";

// 마이페이지 진입 시 '나의 정보 관리'로 리다이렉트 처리
function MyPage() {
	redirect("/learner/mypage/profile");
}

export default MyPage;
