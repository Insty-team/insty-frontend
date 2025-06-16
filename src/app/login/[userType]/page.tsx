"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { SocialLogin } from "@/app/_components/social";
import { PasswordInput, TextInput } from "@/app/_components/validation";
import { postLogin } from "@/app/api/backend";
import { useAuthStore, useUserStore } from "@/app/stores";
import { LoginForm } from "@/app/types";
import { emailReg, passwordReg } from "@/app/utils";
import Swal from "sweetalert2";

function Login() {
	const params = useParams();
	const router = useRouter();
	const type = params.userType === "creator" ? "크리에이터" : "러너";
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
			const submitData = {
				...data,
				userType: params.userType === "creator" ? "CREATOR" : "LEARNER",
			};
			const res = await postLogin(submitData);

			if (!res.success) {
				Swal.fire({
					title: "로그인 실패",
					text: res.error.message,
					icon: "error",
				});
				console.log(res.error);
				return;
			}

			setAccessToken(res.data.token.accessToken);
			setRefreshToken(res.data.token.refreshToken);

			//액세스 토큰으로 나중에 사용자 정보를 조회한다. 이후 값 저장
			setUser({
				nickname: res.data.nickname,
				userType: res.data.userType,
			});

			if (params.userType === "creator") {
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

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<p className="mt-12 text-3xl font-semibold"> {type}로 로그인하기</p>
				</div>
			</div>
			<div className="flex items-center justify-center">
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
						className={`w-full py-3 rounded-xl text-white font-semibold ${
							!!errors.email ||
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
				</form>
			</div>
		</>
	);
}

export default Login;
