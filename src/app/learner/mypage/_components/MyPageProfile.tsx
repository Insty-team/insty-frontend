"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { BaseButton } from "@/app/_components/common";
import {
  PasswordConfirmInput,
  PasswordInput,
  TextInput,
} from "@/app/_components/validation";
import {
  useEditUserProfileInfoMutation,
  useGetUserProfileInfoQuery,
} from "@/app/queries";
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
    formState: { isValid, errors },
  } = useForm<ChangeProfileForm>({
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      introduce: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!userInfo) return;
    reset({
      nickname: userInfo.nickname,
      email: userInfo.email,
      password: "",
      introduce: userInfo.introduce,
    });
  }, [userInfo, reset]);

  const onSaveProfileInfo = handleSubmit((data: ChangeProfileForm) => {
    const body = {
      email: data.email,
      password: data.password,
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
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setIsEditing(false);
      },
      onError: () => {
        alert("수정에 실패했습니다.");
      },
    });
  });

  return (
    <div className="flex flex-col gap-12 justify-center items-center w-full">
      {isEditing ? (
        <>
          <div className="flex flex-col w-[700px] gap-10">
            <div className="flex gap-10">
              <div className="flex flex-col gap-2 justify-center items-center w-full">
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
            </div>
            {/* Form */}
            <div className="flex items-center justify-center">
              <form
                onSubmit={onSaveProfileInfo}
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
                  placeholder={userInfo?.email}
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
                    pattern: {
                      value: passwordReg,
                      message: "비밀번호 형식이 잘못되었습니다.",
                    },
                  }}
                  error={errors.password}
                />
                <div className="mt-10 w-full">
                  <BaseButton
                    title="수정하기"
                    onClick={onSaveProfileInfo}
                    disabled={!isValid}
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

export default MyPageProfile;
