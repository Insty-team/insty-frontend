"use client";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { emailReg, nicknameReg, passwordReg } from "@/app/utils/regex";
import { SignupForm } from "@/app/types";
import SocialLogin from "@/app/_components/social/SocialLogin";
import {
	TextInput,
	PasswordInput,
	PasswordConfirmInput,
} from "@/app/_components/validation";

function Signup() {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<SignupForm>({
		mode: "onChange",
	});

	const onSubmit = (data: SignupForm) => {
		const submitData = { ...data };
		delete submitData.confirmPassword;
		console.log(submitData);
	};

	const handleNicknameCheck = () => {
		//닉네임 중복 체크
		console.log("닉네임 중복 체크를 눌렀어요.");
	};

	const handleEmailCheck = () => {
		//이메일 중복 체크
		console.log("이메일 중복 체크를 눌렀어요.");
	};

	const sizeClass = "text-base";

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<p className="mt-12 text-3xl font-semibold"> 회원가입하기</p>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-md p-4 flex flex-col items-center space-y-6"
				>
					<TextInput
						label="닉네임"
						name="nickname"
						type="text"
						placeholder="닉네임을 입력해주세요."
						register={register}
						validation={{
							required: "",
							pattern: {
								value: nicknameReg,
								message: "닉네임 형식이 잘못되었습니다.",
							},
						}}
						error={errors.nickname}
						checkDuplication={
							<button
								type="button"
								onClick={handleNicknameCheck}
								className="px-3 py-1 rounded-lg bg-primary-blue-300 hover:bg-primary-blue-500 cursor-pointer text-white text-sm"
							>
								닉네임 중복 확인
							</button>
						}
					/>
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
						checkDuplication={
							<button
								type="button"
								onClick={handleEmailCheck}
								className="px-3 py-1 rounded-lg bg-primary-blue-300 hover:bg-primary-blue-500 cursor-pointer text-white text-sm"
							>
								이메일 중복 확인
							</button>
						}
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

					<PasswordConfirmInput
						label="비밀번호 확인"
						name="confirmPassword"
						confirmPasswordName={getValues("password")}
						register={register}
						validation={{
							required: "",
						}}
						error={errors.confirmPassword}
					/>

					<button
						type="submit"
						className={`w-full py-3 rounded-xl bg-primary-blue-400 hover:bg-primary-blue-500 cursor-pointer text-white font-semibold ${sizeClass}`}
					>
						회원가입
					</button>

					<div className="text-md text-black-100">
						계정이 이미 있으신가요?{" "}
						<Link
							href="/login"
							className="text-primary-blue-200 underline font-medium"
						>
							로그인
						</Link>
					</div>

					<SocialLogin />
				</form>
			</div>
		</>
	);
}

export default Signup;
