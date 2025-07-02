"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import SocialLogin from "@/app/_components/social/SocialLogin";
import {
	PasswordConfirmInput,
	PasswordInput,
	TextInput,
} from "@/app/_components/validation";
import { getEmailCheck, getNicknameCheck, postSignup } from "@/app/api/backend";
import { SignupForm } from "@/app/types";
import { emailReg, nicknameReg, passwordReg } from "@/app/utils";

function Signup() {
	const [isNicknameAvailable, setIsNicknameAvailable] = useState<
		boolean | null
	>(null);
	const [nicknameCheckStatus, setNicknameCheckStatus] = useState<string>("");
	const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
		null,
	);
	const [emailCheckStatus, setEmailCheckStatus] = useState<string>("");
	const {
		register,
		handleSubmit,
		getValues,
		watch,
		formState: { errors },
	} = useForm<SignupForm>({
		mode: "onChange",
	});
	const router = useRouter();

	const nickname = watch("nickname");
	const email = watch("email");

	const onSubmit = async (data: SignupForm) => {
		const submitData = { ...data };
		delete submitData.confirmPassword;

		try {
			const res = await postSignup(submitData);
			Swal.fire({
				icon: "success",
				iconColor: "#6ead79",
				title: "회원가입 성공",
				text: `${res.nickname}님, 환영합니다.`,
				confirmButtonText: "로그인하러 가기",
				confirmButtonColor: "#6ead79",
			}).then(() => {
				router.push("/login");
			});
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: "error",
				iconColor: "#ff4f64",
				title: "오류",
				text: "회원가입에 실패했습니다.",
				confirmButtonText: "다시 시도하기",
				confirmButtonColor: "#ff4f64",
			});
		}
	};

	const handleNicknameCheck = async () => {
		const res = await getNicknameCheck(getValues("nickname"));
		setIsNicknameAvailable(res.isAvailable);
		setNicknameCheckStatus(res.reason);
	};

	const handleEmailCheck = async () => {
		const res = await getEmailCheck(getValues("email"));
		setIsEmailAvailable(res.isAvailable);
		setEmailCheckStatus(res.reason);
	};

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
					<div className="w-full">
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
								onChange: () => {
									setIsNicknameAvailable(null);
									setNicknameCheckStatus("");
								},
							}}
							error={
								errors.nickname
									? errors.nickname
									: !errors.nickname && nickname && isNicknameAvailable === null
										? { message: "닉네임 중복 확인을 해주세요." }
										: undefined
							}
							checkDuplication={
								<button
									type="button"
									onClick={() => handleNicknameCheck()}
									disabled={!!errors.nickname || nickname === ""}
									className={`px-3 py-1 rounded-lg ${
										errors.nickname || nickname === ""
											? "bg-gray-scale-300 cursor-not-allowed"
											: "bg-primary-green-300 hover:bg-primary-green-500 cursor-pointer"
									} text-white text-sm`}
								>
									닉네임 중복 확인
								</button>
							}
						/>
						{isNicknameAvailable !== null && (
							<p
								className={`mt-1 ml-2 ${
									isNicknameAvailable
										? "text-primary-green-500"
										: "text-secondary-red-300"
								}`}
							>
								{nicknameCheckStatus}
							</p>
						)}
					</div>
					<div className="w-full">
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
								onChange: () => {
									setIsEmailAvailable(null);
									setEmailCheckStatus("");
								},
							}}
							error={
								errors.email
									? errors.email
									: !errors.email && email && isEmailAvailable === null
										? { message: "이메일 중복 확인을 해주세요." }
										: undefined
							}
							checkDuplication={
								<button
									type="button"
									onClick={() => handleEmailCheck()}
									disabled={!!errors.email || email === ""}
									className={`px-3 py-1 rounded-lg ${
										errors.email || email === ""
											? "bg-gray-scale-300 cursor-not-allowed"
											: "bg-primary-green-300 hover:bg-primary-green-500 cursor-pointer"
									} text-white text-sm`}
								>
									이메일 중복 확인
								</button>
							}
						/>
						{isEmailAvailable !== null && (
							<p
								className={`mt-1 ml-2 ${
									isEmailAvailable
										? "text-primary-green-500"
										: "text-secondary-red-300"
								}`}
							>
								{emailCheckStatus}
							</p>
						)}
					</div>

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
						className={`w-full mt-2 py-3 rounded-xl text-white font-semibold ${
							!isNicknameAvailable ||
							!isEmailAvailable ||
							!getValues("password") ||
							!getValues("confirmPassword")
								? "bg-gray-scale-300 cursor-not-allowed"
								: "bg-primary-green-300 hover:bg-primary-green-500 cursor-pointer"
						}`}
						disabled={
							!isNicknameAvailable ||
							!isEmailAvailable ||
							!getValues("password") ||
							!getValues("confirmPassword")
						}
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
