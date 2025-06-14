import Image from "next/image";

function SocialLogin() {
	return (
		<>
			<div className="text-lg text-black-100 font-semibold">
				소셜 로그인으로 간편하게 시작하기
			</div>
			<div className="flex space-x-4">
				{/* 나중에 링크 달아놓을 곳 */}
				<Image
					src="/kakao.svg"
					alt="kakao"
					className="rounded-2xl cursor-pointer"
					width={36}
					height={36}
				/>
				<Image
					src="/google.svg"
					alt="google"
					className="rounded-2xl cursor-pointer"
					width={36}
					height={36}
				/>
				<Image
					src="/naver.svg"
					alt="naver"
					className="rounded-2xl cursor-pointer"
					width={36}
					height={36}
				/>
			</div>
		</>
	);
}

export default SocialLogin;
