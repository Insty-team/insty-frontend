"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { PasswordInput, TextInput } from "@/app/_components/validation";
import { postLogin, getSocialAuthCode } from "@/app/api/backend";
import { useAuthStore, useUserStore } from "@/app/stores";
import { LoginForm } from "@/app/types";
import { emailReg, passwordReg } from "@/app/utils";

function Login() {
	const { userType } = useParams();
	const router = useRouter();
	const type = userType === "creator" ? "크리에이터" : "러너";

	const { setAccessToken, setRefreshToken } = useAuthStore();
	const { setUser, setUserType } = useUserStore();
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<LoginForm>({
		mode: "onChange",
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			const submitData = { ...data, userType: userType === "creator" ? "CREATOR" : "LEARNER" };
			const res = await postLogin(submitData);
			setAccessToken(res.data.token.accessToken);
			setRefreshToken(res.data.token.refreshToken);

			//액세스 토큰으로 나중에 사용자 정보를 조회한다. 이후 값 저장
			setUser({
				nickname: res.data.nickname,
				userType: res.data.userType,
			});

			if (userType === "creator") {
				setUserType("CREATOR");
				router.push("/creator/dashboard");
			} else {
				setUserType("LEARNER");
				router.push("/learner/recommend");
			}
		} catch (error) {
			console.error("로그인 실패:", error);
		}
	};

	// 카카오 로그인
	const handleKakaoLogin = async () => {
		const state = userType === "creator" ? "CREATOR" : "LEARNER";
		const res = await getSocialAuthCode("KAKAO", state);
		window.location.href = res;
	};

	// 네이버 로그인
	const handleNaverLogin = async () => {
		const state = userType === "creator" ? "CREATOR" : "LEARNER";
		const res = await getSocialAuthCode('NAVER', state)
		window.location.href = res
	}

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<p className="mt-12 text-3xl font-semibold"> {type}로 로그인하기</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-8">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-md p-4 flex flex-col items-center space-y-6"
				>
					<TextInput
						label="이메일"
						name="email"
						type="email"
						placeholder="이메일을 입력해주세요."
						register={register}
						validation={{
							required: "",
							pattern: {
								value: emailReg,
								message: "이메일 형식이 잘못되었습니다.",
							},
						}}
						error={errors.email}
					/>

					<PasswordInput
						label="비밀번호"
						name="password"
						placeholder="비밀번호를 입력해주세요."
						register={register}
						validation={{
							required: "",
							pattern: {
								value: passwordReg,
								message: "비밀번호 형식이 잘못되었습니다.",
							},
						}}
						error={errors.password}
					/>
					<button
						type="submit"
						className={`w-full py-3 rounded-xl text-white font-semibold ${!!errors.email ||
							!!errors.password ||
							!getValues("email") ||
							!getValues("password")
							? "bg-gray-scale-300 cursor-not-allowed"
							: "bg-primary-green-300 hover:bg-primary-green-500 cursor-pointer"
							}`}
						disabled={
							!!errors.email ||
							!!errors.password ||
							!getValues("email") ||
							!getValues("password")
						}
					>
						로그인
					</button>
					{/* Social Login */}
					<div className="text-md text-black-100">
						계정이 없으신가요?{" "}
						<Link
							href="/signup"
							className="text-primary-blue-200 underline font-medium"
						>
							회원가입
						</Link>
					</div>
				</form>
				<div className="text-lg text-black-100 font-semibold">
					소셜 로그인으로 간편하게 시작하기
				</div>
				<div className="flex space-x-4">
					<button onClick={() => handleKakaoLogin()}>
						<Image
							src="/kakao.svg"
							alt="kakao"
							className="rounded-2xl cursor-pointer"
							width={36}
							height={36}

						/>
					</button>
					<button>
						<Image
							src="/google.svg"
							alt="google"
							className="rounded-2xl cursor-pointer"
							width={36}
							height={36}
						/>
					</button>
					<button onClick={() => handleNaverLogin()}>
						<Image
							src="/naver.svg"
							alt="naver"
							className="rounded-2xl cursor-pointer"
							width={36}
							height={36}
						/>
					</button>
				</div>
			</div>
		</>
	);
}

export default Login;
