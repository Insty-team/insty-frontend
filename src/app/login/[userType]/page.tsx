"use client";

import * as Amplitude from "@amplitude/analytics-browser";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import SocialLogin from "@/app/_components/social/SocialLogin";
import { PasswordInput, TextInput } from "@/app/_components/validation";
import { postLogin } from "@/app/api/backend";
import { useAuthStore, useUserStore } from "@/app/stores";
import { LoginForm } from "@/app/types";
import { emailReg, passwordReg, trackEvent } from "@/app/utils";

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
		watch,
	} = useForm<LoginForm>({
		mode: "onChange",
	});
	const email = watch("email");
	const password = watch("password");

	const onSubmit = async (data: LoginForm) => {
		// Amplitude 추적
		Amplitude.track("Login Submitted");
		// Mixpanel 추적
		trackEvent("로그인_시도");

		try {
			const submitData = {
				...data,
				userType: userType === "creator" ? "CREATOR" : "LEARNER",
			};
			const res = await postLogin(submitData);
			if (res && res.success) {
				// 로그인 성공 추적
				Amplitude.track("Login Completed");
				trackEvent("로그인_성공");

				setAccessToken(res.data.token.accessToken);
				setRefreshToken(res.data.token.refreshToken);

				//액세스 토큰으로 나중에 사용자 정보를 조회한다. 이후 값 저장
				setUser({
					nickname: res.data.nickname,
					userType: res.data.userType,
				});

				if (userType === "creator") {
					setUserType("CREATOR");
					router.push("/creator/courses");
				} else {
					setUserType("LEARNER");
					router.push("/learner/recommend");
				}
			} else {
				// 로그인 실패 추적
				Amplitude.track("Login Failed");
				trackEvent("로그인_실패");
				Swal.fire({
					title: "로그인 실패!",
					text:
						`${res.error.message} === "사용자를 찾을 수 없습니다."` ||
						`${res.error.message} === "비밀번호가 올바르지 않습니다."`
							? "이메일 또는 비밀번호가 올바르지 않습니다."
							: `${res.error.message}`,
					icon: "error",
				}).then(() => {
					return;
				});
			}
		} catch (error) {
			// 로그인 에러 추적
			Amplitude.track("Login Error");
			trackEvent("로그인_에러");
			console.error("로그인 실패:", error);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image
						src="/insty.png"
						alt="logo"
						width={208}
						height={181}
						priority
					/>
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
								message:
									"영문/숫자/특수문자를 포함한 8~20자 이내로 입력해주세요.",
							},
						}}
						error={errors.password}
					/>
					<button
						type="submit"
						className={`w-full py-3 rounded-xl text-white font-semibold ${
							!!errors.email || !!errors.password || !email || !password
								? "bg-gray-scale-300 cursor-not-allowed"
								: "bg-primary-green-300 hover:bg-primary-green-500 cursor-pointer"
						}`}
						disabled={
							!!errors.email || !!errors.password || !email || !password
						}
					>
						로그인
					</button>
				</form>
				<div className="flex flex-col items-center gap-4">
					<div className="text-md text-black-100">
						계정이 없으신가요?{" "}
						<Link
							href="/signup"
							className="text-primary-blue-200 underline font-medium"
						>
							회원가입
						</Link>
					</div>
					<SocialLogin />
				</div>
			</div>
		</>
	);
}

export default Login;
