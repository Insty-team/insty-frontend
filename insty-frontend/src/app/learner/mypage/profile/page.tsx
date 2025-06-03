"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BaseButton } from "@/app/_components/common";
import {
	TextInput,
	PasswordInput,
	PasswordConfirmInput,
} from "@/app/_components/validation";
import { ChangeProfileForm } from "@/app/types";
import { emailReg, nicknameReg, passwordReg } from "@/app/utils/regex";

function Profile() {
	const [isEditing, setIsEditing] = useState(false);

	// FIXME: 실제 유저 데이터로 변경 필요
	const MOCK_USER_INFO = {
		id: "test",
		name: "김가나",
		email: "kim-gana@example.com",
		description: "안녕하세요. 김가나 입니다.",
	};

	const onClickProfileEditButton = () => setIsEditing(true);

	// 프로필 수정 관련
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<ChangeProfileForm>({
		mode: "onChange",
	});

	const onSaveProfileInfo = () => {
		handleSubmit(onSubmit);
		setIsEditing(false);
	};

	const onSubmit = (data: ChangeProfileForm) => {
		const submitData = { ...data };
		console.log(submitData);
	};

	return (
		<div className="flex flex-col gap-12 justify-center items-center w-full">
			{isEditing ? (
				<>
					<div className="flex flex-col w-[700px] gap-10">
						<div className="flex gap-10">
							<div className="flex flex-col gap-2 justify-center items-center w-[160px]">
								<Image
									src="/profile.svg"
									width={128}
									height={128}
									alt="프로필 사진"
								/>
								<button
									type="button"
									onClick={() => console.log("profile check")}
									className="px-3 py-1 rounded-lg bg-primary-green-400 active:bg-primary-green-500 cursor-pointer text-white text-sm"
								>
									프로필 사진 수정
								</button>
							</div>
							<div className="h-full w-full">
								<div className="flex flex-col gap-1 h-full">
									<label className="block text-lg font-medium mb-1 text-black-300">
										소개글
									</label>
									<textarea
										placeholder={MOCK_USER_INFO.description}
										className="w-full h-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none resize-none"
									/>
								</div>
							</div>
						</div>
						{/* Form */}
						<div className="flex items-center justify-center">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="w-full p-4 flex flex-col items-center space-y-6"
							>
								<TextInput
									label="닉네임"
									name="nickname"
									type="text"
									placeholder={MOCK_USER_INFO.name}
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
											onClick={() => console.log("nickname check")}
											className="px-3 py-1 rounded-lg bg-primary-green-400 active:bg-primary-green-500 cursor-pointer text-white text-sm"
										>
											닉네임 중복 확인
										</button>
									}
								/>
								<TextInput
									label="이메일"
									name="email"
									type="email"
									placeholder={MOCK_USER_INFO.email}
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
											onClick={() => console.log("email check")}
											className="px-3 py-1 rounded-lg bg-primary-green-400 active:bg-primary-green-500 cursor-pointer text-white text-sm"
										>
											이메일 중복 확인
										</button>
									}
								/>
								<PasswordInput
									label="현재 비밀번호"
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
									label="변경할 비밀번호"
									name="changedPassword"
									confirmPasswordName={getValues("password")}
									register={register}
									validation={{
										required: "",
									}}
									error={errors.changedPassword}
								/>
								<div className="mt-10 w-full">
									<BaseButton title="저장하기" onClick={onSaveProfileInfo} />
								</div>
							</form>
						</div>
					</div>
				</>
			) : (
				<>
					<Image
						src="/profile.svg"
						width={128}
						height={128}
						alt="프로필 사진"
					/>
					<div className="flex flex-col gap-10">
						{[
							{ label: "닉네임", value: MOCK_USER_INFO.name },
							{ label: "이메일", value: MOCK_USER_INFO.email },
							{ label: "소개글", value: MOCK_USER_INFO.description },
						].map((item) => (
							<div key={item.label} className="flex flex-col gap-2">
								<span className="text-xl font-semibold">{item.label}</span>
								<span className="text-2xl">{item.value}</span>
							</div>
						))}
					</div>
					<div className="w-90">
						<BaseButton
							title="프로필 수정하기"
							onClick={onClickProfileEditButton}
						/>
					</div>
				</>
			)}
		</div>
	);
}

export default Profile;
