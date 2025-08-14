"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
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
import { ALLOWED_FILE_TYPES } from "@/app/types/allowedFileTypes";
import { UserUpdateRequest } from "@/app/types/user";
import { emailReg, nicknameReg, passwordReg } from "@/app/utils";

import Modal from "../common/Modal";

function MyPageProfile({ mode }: { mode: "CREATOR" | "LEARNER" }) {
	const [isEditing, setIsEditing] = useState(false);
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
	const profileImageInputRef = useRef<HTMLInputElement>(null);
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
	const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] =
		useState<boolean>(false);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const password = watch("password");
	const changedPassword = watch("changedPassword");
	const nickname = watch("nickname");
	const email = watch("email");

	const isSocialLoginUser = userInfo?.socialType === null ? false : true;

	// 닉네임 에러 메시지 로직
	const getNicknameErrorMessage = () => {
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

		return undefined;
	};

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
		if (isSocialLoginUser) {
			if (isNicknameChanged && !isNicknameAvailable) {
				Swal.fire({
					icon: "error",
					title: "닉네임 중복확인을 해주세요.",
					confirmButtonText: "확인",
				});
				return;
			}
		} else {
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
		}

		const body: UserUpdateRequest = isSocialLoginUser
			? {
					nickname: data.nickname,
					email: data.email,
					currentPassword: "",
				}
			: {
					nickname: data.nickname,
					email: data.email,
					currentPassword: data.password,
				};

		if (!isSocialLoginUser && mode === "CREATOR") {
			body.introduce = data.introduce;
		}

		if (!isSocialLoginUser && data.changedPassword) {
			body.newPassword = data.changedPassword;
		}

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
					title: "수정에 실패하였습니다.",
					text: `${password === "" ? "현재 비밀번호를 입력해주세요" : "현재 비밀번호가 일치하지 않습니다."}`,
					confirmButtonText: "확인",
				});
			},
		});
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

	const handleWithdrawalModalOpen = () => {
		setIsWithdrawalModalOpen(true);
	};

	const handleWithdrawal = () => {
		console.log("탈퇴");
	};

	return (
		<div className="flex flex-col gap-12 justify-center items-center w-full">
			{isEditing ? (
				<>
					<div className="flex flex-col w-[700px] gap-10">
						<div className="flex justify-start">
							<IoArrowBack
								size={24}
								className="cursor-pointer hover:bg-gray-scale-100 rounded-full"
								onClick={() => setIsEditing(false)}
							/>
						</div>
						<div
							className={`flex gap-10 ${mode === "LEARNER" ? "justify-center" : ""}`}
						>
							<div className="flex flex-col gap-2 justify-center items-center w-[160px] aspect-square">
								<Image
									src={
										profileImageFile
											? URL.createObjectURL(profileImageFile)
											: userInfo?.thumbnailUrl || "/profile.svg"
									}
									alt="프로필 사진"
									width={128}
									height={128}
									className="rounded-full object-cover"
									style={{ width: "128px", height: "128px" }}
								/>
								<input
									ref={profileImageInputRef}
									type="file"
									accept={ALLOWED_FILE_TYPES.image.accept}
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											if (!ALLOWED_FILE_TYPES.image.types.includes(file.type)) {
												Swal.fire({
													title: "지원하지 않는 파일 형식",
													text: "JPG, JPEG, PNG, WEBP 파일만 업로드 가능합니다.",
													icon: "error",
													confirmButtonText: "확인",
												});
												if (profileImageInputRef.current) {
													profileImageInputRef.current.value = "";
												}
												return;
											}
											setProfileImageFile(file);
										}
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
							{mode === "CREATOR" && (
								<div className="h-full w-full">
									<div className="flex flex-col gap-1 h-full">
										<label className="block text-lg font-medium mb-1 text-black-300">
											소개글
										</label>
										<textarea
											{...register("introduce")}
											placeholder={
												userInfo?.introduce
													? userInfo.introduce
													: "소개글을 입력해주세요."
											}
											className="w-full h-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none resize-none"
										/>
									</div>
								</div>
							)}
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
									placeholder="닉네임을 입력하세요."
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
										isNicknameAvailable === false && nicknameCheckStatus
											? { message: nicknameCheckStatus }
											: getNicknameErrorMessage() ||
												errors.nickname ||
												(isNicknameChanged && !isNicknameAvailable
													? { message: "닉네임 중복 확인을 해주세요." }
													: undefined)
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
									placeholder="이메일을 입력하세요."
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
										isEmailAvailable === false && emailCheckStatus
											? { message: emailCheckStatus }
											: errors.email ||
												(isEmailChanged && !isEmailAvailable
													? { message: "이메일 중복 확인을 해주세요." }
													: undefined)
									}
									checkDuplication={
										isSocialLoginUser ? (
											<></>
										) : (
											<BaseButton
												title="이메일 중복 확인"
												className="!px-3 !py-1 !rounded-lg !cursor-pointer !text-sm"
												onClick={handleEmailCheck}
												disabled={
													!!errors.email ||
													!email ||
													email.length < 2 ||
													email === userInfo?.email
												}
											/>
										)
									}
									success={isEmailAvailable !== null ? emailCheckStatus : ""}
									status={
										isEmailAvailable === null
											? undefined
											: isEmailAvailable
												? "success"
												: "error"
									}
									disabled={isSocialLoginUser}
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
											message:
												"영문/숫자/특수문자를 포함한 8~20자 이내로 입력해주세요.",
										},
									}}
									error={errors.password}
									disabled={isSocialLoginUser}
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
											message:
												"영문/숫자/특수문자를 포함한 8~20자 이내로 입력해주세요.",
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
					<div className="flex flex-col gap-2 justify-center items-center w-[160px] aspect-square">
						<Image
							src={
								userInfo?.thumbnailUrl ? userInfo.thumbnailUrl : "/profile.svg"
							}
							width={128}
							height={128}
							alt="프로필 사진"
							className="rounded-full object-cover"
							style={{ width: "128px", height: "128px" }}
						/>
					</div>
					<div className="flex flex-col gap-10">
						{[
							{ label: "닉네임", value: userInfo?.nickname },
							{ label: "이메일", value: userInfo?.email },
							...(mode === "CREATOR"
								? [
										{
											label: "소개글",
											value: userInfo?.introduce || "소개글이 없습니다.",
										},
									]
								: []),
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
						<div className="flex justify-end mt-2 mr-2">
							<button
								className="text-gray-scale-200 cursor-pointer hover:text-gray-scale-300"
								onClick={handleWithdrawalModalOpen}
							>
								회원탈퇴
							</button>
						</div>
					</div>
				</>
			)}
			<Modal
				open={isWithdrawalModalOpen}
				onClose={() => setIsWithdrawalModalOpen(false)}
				title="회원탈퇴"
				onCloseTitle="취소"
				actionsTitle="탈퇴하기"
				actions={handleWithdrawal}
				disabled={!isChecked}
			>
				<div className="p-6">
					<h2 className="text-xl font-bold mb-4">
						정말 계정을 탈퇴하시겠습니까?
					</h2>

					<div className="space-y-3 mb-6">
						<p>
							• 계정 및 개인 정보, 업로드한 강의, 수강한 강의 기록 등 영구
							삭제됩니다.
						</p>
						<p>
							• 작성하신 커뮤니티 게시물/댓글은 개인정보를 제거한 후 게시물만
							유지될 수 있습니다.
						</p>
						<p>• 진행 후에는 복구가 불가합니다.</p>
					</div>

					<label className="flex items-center mb-4">
						<input
							type="checkbox"
							checked={isChecked}
							onChange={(e) => setIsChecked(e.target.checked)}
						/>
						<span className="ml-2">위 내용을 모두 확인했습니다.</span>
					</label>
				</div>
			</Modal>
		</div>
	);
}

export default MyPageProfile;
