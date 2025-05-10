"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { emailReg, passwordReg } from "@/app/utils/regex";
import { LoginForm } from "@/app/types";

export default function Login() {
	const params = useParams();
	const type = params.userType === "creator" ? "크리에이터" : "러너";
	const [showPassword, setShowPassword] = useState(false);

	const onChangeShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		mode: "onChange",
	});

	const onSubmit = (data: LoginForm) => {
		console.log(data);
	};

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<p className="mt-12 text-3xl font-semibold"> {type}로 로그인하기</p>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-4 flex flex-col items-center space-y-6">
					<div className="w-full">
						<label className="block text-lg font-medium mb-1 text-black-300">이메일</label>
						<input
							type="email"
							placeholder="이메일을 입력해주세요."
							className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none"
							{...register("email", {
								required: "",
								pattern: {
									value: emailReg,
									message: "이메일 형식이 잘못되었습니다",
								},
							})}
						/>
						{errors.email && (
							<p className="mt-1 ml-2 text-secondary-red-300">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="w-full relative">
						<label className="block text-lg font-medium mb-1 text-black-300">비밀번호</label>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="비밀번호를 입력해주세요."
							className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none"
							{...register("password", {
								required: "",
								pattern: {
									value: passwordReg,
									message: "비밀번호 형식이 잘못되었습니다.",
								},
							})}
						/>
						<button
							className="absolute right-3 top-10.5 cursor-pointer"
							onClick={onChangeShowPassword}
						>
							<Image
								src={showPassword ? "/unshow.svg" : "/show.svg"}
								alt="아이콘"
								width={24}
								height={24}
							/>
						</button>
						{errors.password && (
							<p className="mt-1 ml-2 text-secondary-red-300">
								{errors.password?.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full py-3 rounded-xl bg-primary-blue-400 hover:bg-primary-blue-500 cursor-pointer text-white font-semibold"
					>
						로그인
					</button>

					<div className="text-md text-black-100">
						계정이 없으신가요?{" "}
						<a
							href="/signup"
							className="text-primary-blue-200 underline font-medium"
						>
							회원가입
						</a>
					</div>

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
				</form>
			</div>
		</>
	);
}
