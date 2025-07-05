"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { BaseButton } from "@/app/_components/common";
import {
	PasswordConfirmInput,
	PasswordInput,
	TextInput,
} from "@/app/_components/validation";
import { getEmailCheck, getNicknameCheck } from "@/app/api/backend";
import { useEditUserProfileInfoMutation } from "@/app/queries";
import { useGetUserProfileInfoQuery } from "@/app/queries";
import { ChangeProfileForm } from "@/app/types";
import { emailReg, nicknameReg, passwordReg } from "@/app/utils";

function MyPageProfile() {
	const [isEditing, setIsEditing] = useState(false);
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
	const onClickProfileEditButton = () => setIsEditing(true);

	const queryClient = useQueryClient();
	const { data: userInfo } = useGetUserProfileInfoQuery();
	const { mutate: editProfile } = useEditUserProfileInfoMutation();

	// 초기값
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
		watch,
		trigger,
	} = useForm<ChangeProfileForm>({
		defaultValues: {
			nickname: "",
			email: "",
			password: "",
			changedPassword: "",
			introduce: "",
		},
		mode: "onChange",
	});

	const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean>(true);
	const [nicknameCheckStatus, setNicknameCheckStatus] = useState<string>("");
	const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(true);
	const [emailCheckStatus, setEmailCheckStatus] = useState<string>("");
	const password = watch("password");
	const changedPassword = watch("changedPassword");
	const nickname = watch("nickname");
	const email = watch("email");

	useEffect(() => {
		trigger("changedPassword");
	}, [password, trigger]);

	useEffect(() => {
		if (!userInfo) return;
		reset({
			nickname: userInfo.nickname,
			email: userInfo.email,
			password: "",
			changedPassword: "",
			introduce: userInfo.introduce,
		});
	}, [userInfo, reset]);

	useEffect(() => {
		if (!userInfo) return;
		if (nickname === userInfo.nickname) {
			setIsNicknameAvailable(true);
			setNicknameCheckStatus("");
		} else {
			setIsNicknameAvailable(false);
			setNicknameCheckStatus("");
		}
	}, [nickname, userInfo]);

	useEffect(() => {
		if (!userInfo) return;
		if (email === userInfo.email) {
			setIsEmailAvailable(true);
			setEmailCheckStatus("");
		} else {
			setIsEmailAvailable(false);
			setEmailCheckStatus("");
		}
	}, [email, userInfo]);

	const isNicknameChanged = nickname !== userInfo?.nickname;
	const isEmailChanged = email !== userInfo?.email;
	const isChangedPasswordSame = password && password === changedPassword;

	const isSaveDisabled =
		(isNicknameChanged && !isNicknameAvailable) ||
		(isEmailChanged && !isEmailAvailable) ||
		isChangedPasswordSame;

	const onSaveProfileInfo = (data: ChangeProfileForm) => {
		if (isNicknameChanged && !isNicknameAvailable) {
			Swal.fire({
				icon: "error",
				title: "닉네임 중복확인을 해주세요.",
				confirmButtonText: "확인",
			});
			return;
		} else if (isEmailChanged && !isEmailAvailable) {
			Swal.fire({
				icon: "error",
				title: "이메일 중복확인을 해주세요.",
				confirmButtonText: "확인",
			});
			return;
		} else if (isChangedPasswordSame) {
			Swal.fire({
				icon: "error",
				title: "현재 비밀번호와 다른 비밀번호를 입력해주세요.",
			});
			return;
		}

		const body = {
			email: data.email,
			currentPassword: data.password,
			newPassword: data.changedPassword,
			nickname: data.nickname,
			introduce: data.introduce,
		};

		const formData = new FormData();
		formData.append(
			"userUpdateReq",
			new Blob([JSON.stringify(body)], { type: "application/json" }),
		);

		if (profileImageFile) {
			formData.append("profileImage", profileImageFile);
		}

		editProfile(formData, {
			onSuccess: () => {
				Swal.fire({
					icon: "success",
					title: "수정에 성공했습니다.",
					confirmButtonText: "확인",
				}).then(() => {
					queryClient.invalidateQueries({ queryKey: ["userProfile"] });
					setIsEditing(false);
					reset();
				});
			},
			onError: () => {
				Swal.fire({
					icon: "error",
					title: `${password === "" ? "현재 비밀번호를 입력해주세요" : "현재 비밀번호가 일치하지 않습니다."}`,
					confirmButtonText: "확인",
				});
			},
		});
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
		<div className="flex flex-col gap-12 justify-center items-center w-full">
			{isEditing ? (
				<>
					<div className="flex flex-col w-[700px] gap-10">
						<div className="flex gap-10">
							<div className="flex flex-col gap-2 justify-center items-center w-[160px]">
								<Image
									src={
										profileImageFile
											? URL.createObjectURL(profileImageFile)
											: userInfo?.thumbnailUrl || "/profile.svg"
									}
									width={128}
									height={128}
									alt="프로필 사진"
									style={{
										objectFit: "cover",
										width: "128px",
										height: "128px",
									}}
									className="rounded-full"
								/>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) setProfileImageFile(file);
									}}
									className="hidden"
									id="profileImageInput"
								/>
								<label
									htmlFor="profileImageInput"
									className="px-3 py-1 rounded-lg bg-primary-green-400 active:bg-primary-green-500 cursor-pointer text-white text-sm"
								>
									프로필 사진 수정
								</label>
							</div>
							<div className="h-full w-full">
								<div className="flex flex-col gap-1 h-full">
									<label className="block text-lg font-medium mb-1 text-black-300">
										소개글
									</label>
									<textarea
										placeholder={userInfo?.introduce}
										className="w-full h-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none resize-none"
									/>
								</div>
							</div>
						</div>
						{/* Form */}
						<div className="flex items-center justify-center">
							<form
								onSubmit={handleSubmit(onSaveProfileInfo)}
								className="w-full p-4 flex flex-col items-center space-y-6"
							>
								<TextInput
									label="닉네임"
									name="nickname"
									type="text"
									placeholder={userInfo?.nickname}
									register={register}
									validation={{
										required: "",
										pattern: {
											value: nicknameReg,
											message: "닉네임 형식이 잘못되었습니다.",
										},
										onChange: () => {
											setIsNicknameAvailable(false);
											setNicknameCheckStatus("");
										},
									}}
									error={
										errors.nickname
											? errors.nickname
											: isNicknameChanged && !isNicknameAvailable
												? { message: "닉네임 중복 확인을 해주세요." }
												: undefined
									}
									checkDuplication={
										<BaseButton
											title="닉네임 중복 확인"
											userType="CREATOR"
											className="!px-3 !py-1 !rounded-lg !cursor-pointer !text-sm"
											onClick={handleNicknameCheck}
											disabled={
												!!errors.nickname ||
												!nickname ||
												nickname.length < 2 ||
												nickname === userInfo?.nickname
											}
										/>
									}
									success={
										isNicknameAvailable !== null ? nicknameCheckStatus : ""
									}
									status={
										isNicknameAvailable === null
											? undefined
											: isNicknameAvailable
												? "success"
												: "error"
									}
								/>
								<TextInput
									label="이메일"
									name="email"
									type="email"
									placeholder={userInfo?.email}
									register={register}
									validation={{
										required: "",
										pattern: {
											value: emailReg,
											message: "이메일 형식이 잘못되었습니다.",
										},
										onChange: () => {
											setIsEmailAvailable(false);
											setEmailCheckStatus("");
										},
									}}
									error={
										errors.email
											? errors.email
											: isEmailChanged && !isEmailAvailable
												? { message: "이메일 중복 확인을 해주세요." }
												: undefined
									}
									checkDuplication={
										<BaseButton
											title="이메일 중복 확인"
											userType="CREATOR"
											className="!px-3 !py-1 !rounded-lg !cursor-pointer !text-sm"
											onClick={handleEmailCheck}
											disabled={
												!!errors.email ||
												!email ||
												email.length < 2 ||
												email === userInfo?.email
											}
										/>
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
									type="change"
									label="변경할 비밀번호"
									name="changedPassword"
									confirmPasswordName={password}
									register={register}
									validation={{
										required: "",
										pattern: {
											value: passwordReg,
											message: "비밀번호 형식이 잘못되었습니다.",
										},
										validate: (value: string) => {
											if (value === password) {
												return "현재 비밀번호와 다르게 입력해주세요.";
											}
											return true;
										},
									}}
									error={errors.changedPassword}
								/>
								<div className="mt-10 w-full">
									<BaseButton
										title="저장하기"
										onClick={handleSubmit(onSaveProfileInfo)}
										userType="CREATOR"
										disabled={!!isSaveDisabled}
									/>
								</div>
							</form>
						</div>
					</div>
				</>
			) : (
				<>
					<Image
						src={
							userInfo?.thumbnailUrl ? userInfo.thumbnailUrl : "/profile.svg"
						}
						width={128}
						height={128}
						alt="프로필 사진"
						style={{ objectFit: "cover", width: "128px", height: "128px" }}
						className="rounded-full"
					/>
					<div className="flex flex-col gap-10">
						{[
							{ label: "닉네임", value: userInfo?.nickname },
							{ label: "이메일", value: userInfo?.email },
							{ label: "소개글", value: userInfo?.introduce },
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
							userType="CREATOR"
							onClick={onClickProfileEditButton}
						/>
					</div>
				</>
			)}
		</div>
	);
}

export default MyPageProfile;
