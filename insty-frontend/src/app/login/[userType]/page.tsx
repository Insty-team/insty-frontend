"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { emailReg, passwordReg } from "@/app/utils/regex";

export default function Login() {
	const params = useParams();
	const type = params.userType === "creator" ? "크리에이터" : "러너";
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);
	const [password, setPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(false);

	const onChangeShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
		setEmail(value);
		if (emailReg.test(value)) {
			setIsEmailValid(true);
		} else {
			setIsEmailValid(false);
		}
	};

	const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
		setPassword(value);
		if (passwordReg.test(value)) {
			setIsPasswordValid(true);
		} else {
			setIsPasswordValid(false);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<p className="mt-12 text-3xl font-semibold"> {type}로 로그인하기</p>
				</div>
			</div>
			<div className="flex items-center justify-center bg-white">
				<div className="w-full max-w-md p-4 flex flex-col items-center space-y-6">
					<div className="w-full">
						<label className="block text-sm font-medium mb-1">이메일</label>
						<input
							type="email"
							placeholder="이메일을 입력해주세요."
							className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none"
							value={email}
							onChange={onChangeEmail}
						/>
						<p className="mt-1 ml-2 text-secondary-red-300">
							{email.length && !isEmailValid
								? "이메일 형식이 잘못되었습니다."
								: ""}
						</p>
					</div>

					<div className="w-full relative">
						<label className="block text-sm font-medium mb-1">비밀번호</label>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="비밀번호를 입력해주세요."
							className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none"
							value={password}
							onChange={onChangePassword}
						/>
						<button
							className="absolute right-3 top-8.5 text-gray-400 cursor-pointer"
							onClick={onChangeShowPassword}
						>
							<Image
								src={showPassword ? "/unshow.svg" : "/show.svg"}
								alt="아이콘"
								width={24}
								height={24}
							/>
						</button>
						<p className="mt-1 ml-2 text-secondary-red-300">
							{!isPasswordValid ? "비밀번호 형식이 잘못되었습니다." : ""}
						</p>
					</div>

					<button className="w-full py-3 rounded-xl bg-primary-blue-400 hover:bg-primary-blue-500 cursor-pointer text-white font-semibold">
						로그인
					</button>

					<div className="text-sm text-gray-600">
						계정이 없으신가요?{" "}
						<a
							href="/signup"
							className="text-primary-blue-200 underline font-medium"
						>
							회원가입
						</a>
					</div>

					<div className="text-sm text-gray-500">
						소셜 로그인으로 간편하게 시작하기
					</div>

					<div className="flex space-x-4">
						{/* 나중에 링크 달아놓을 곳 */}
						<Image
							src="/kakao.svg"
							alt="kakao"
							className="rounded-2xl cursor-pointer"
							width={32}
							height={32}
						/>
						<Image
							src="/google.svg"
							alt="google"
							className="rounded-2xl cursor-pointer"
							width={32}
							height={32}
						/>
						<Image
							src="/naver.svg"
							alt="naver"
							className="rounded-2xl cursor-pointer"
							width={32}
							height={32}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
