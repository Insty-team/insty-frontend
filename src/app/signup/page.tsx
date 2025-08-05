"use client";

import * as Amplitude from "@amplitude/analytics-browser";
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
import { emailReg, nicknameReg, passwordReg, trackEvent } from "@/app/utils";

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
	const password = watch("password");

	// 닉네임 에러 메시지 로직
	const getNicknameErrorMessage = () => {
		if (!nickname) return undefined; // 입력하지 않았을 때는 아무 문구 없음

		if (nickname.length < 2) {
			return { message: "닉네임은 2글자 이상입니다." };
		}

		if (nickname.length > 10) {
			return { message: "닉네임은 10글자 이하여야 합니다." };
		}

		if (!nicknameReg.test(nickname)) {
			return {
				message: "닉네임은 2~10자의 한글, 영어 또는 숫자 여야 합니다.",
			};
		}

		if (isNicknameAvailable === null) {
			return { message: "닉네임 중복 확인을 해주세요." };
		}

		return undefined;
	};

	const onSubmit = async (data: SignupForm) => {
		Amplitude.track("Signup Submitted");
		trackEvent("회원가입_시도");
		const submitData = { ...data };
		delete submitData.confirmPassword;

		try {
			const res = await postSignup(submitData);
			Amplitude.track("Signup Completed");
			trackEvent("회원가입_완료");
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
			Amplitude.track("Signup Failed");
			trackEvent("회원가입_실패");
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
		if (res.error) {
			setIsNicknameAvailable(false);
			setNicknameCheckStatus(res.error.message);
		} else {
			setIsNicknameAvailable(true);
			setNicknameCheckStatus("사용 가능한 닉네임입니다.");
		}
	};

	const handleEmailCheck = async () => {
		const res = await getEmailCheck(getValues("email"));
		if (res.error) {
			setIsEmailAvailable(false);
			setEmailCheckStatus(res.error.message);
		} else {
			setIsEmailAvailable(true);
			setEmailCheckStatus("사용 가능한 이메일입니다.");
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<p className="mt-12 text-3xl font-semibold"> 회원가입하기</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
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
									message: "닉네임 형식이 맞지 않습니다.",
								},
								onChange: () => {
									setIsNicknameAvailable(null);
									setNicknameCheckStatus("");
								},
							}}
							error={getNicknameErrorMessage()}
							checkDuplication={
								<button
									type="button"
									onClick={() => handleNicknameCheck()}
									disabled={
										!!errors.nickname || !nickname || nickname.length < 2
									}
									className={`px-3 py-1 rounded-lg ${
										errors.nickname || !nickname || nickname.length < 2
											? "bg-gray-scale-300 cursor-not-allowed"
											: "bg-primary-green-300 hover:bg-primary-green-500 cursor-pointer"
									} text-white text-sm`}
								>
									닉네임 중복 확인
								</button>
							}
							success={isNicknameAvailable !== null ? nicknameCheckStatus : ""}
							status={
								isNicknameAvailable === null
									? undefined
									: isNicknameAvailable
										? "success"
										: "error"
							}
						/>
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
							success={isEmailAvailable !== null ? emailCheckStatus : ""}
							status={
								isEmailAvailable === null
									? undefined
									: isEmailAvailable
										? "success"
										: "error"
							}
						/>
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
						type="signup"
						label="비밀번호 확인"
						name="confirmPassword"
						confirmPasswordName={password}
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
				</form>
				<div className="flex flex-col items-center gap-4">
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
				</div>
			</div>
		</>
	);
}

export default Signup;
