"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { emailReg, passwordReg } from "@/app/utils/regex";
import { LoginForm } from "@/app/types";
import Link from "next/link";
import TextInput from "@/app/_components/validation/TextInput";
import PasswordInput from "@/app/_components/validation/PasswordInput";
import SocialLogin from "@/app/_components/social/SocialLogin";

export default function Login() {
	const params = useParams();
	const type = params.userType === "creator" ? "크리에이터" : "러너";

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
						className="w-full py-3 rounded-xl bg-primary-blue-400 hover:bg-primary-blue-500 cursor-pointer text-white font-semibold"
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
