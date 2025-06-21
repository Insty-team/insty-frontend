"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { GoBellFill, GoChevronDown, GoChevronUp } from "react-icons/go";
import Swal from "sweetalert2";

import { postLogout } from "@/app/api/backend";
import { LEARNER_MENU_LIST } from "@/app/constants";
import {
  useGetUserProfileInfoQuery,
  usePatchUserTypeMutation,
} from "@/app/queries";
import { useUserStore } from "@/app/stores";

import BaseDropdown from "./BaseDropdown";

function LearnerHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // 드롭다운 메뉴 핸들링
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const { user, setUserType, resetUser } = useUserStore();

  const { data: userInfo } = useGetUserProfileInfoQuery();
  const { mutate: patchUserType } = usePatchUserTypeMutation();

  const recommend = LEARNER_MENU_LIST[0];

  const changeUserType = () => {
    const typeToChange = user.userType === "LEARNER" ? "CREATOR" : "LEARNER";
    patchUserType(typeToChange, {
      onSuccess: (res) => {
        setUserType(res.userType);
        res.userType === "LEARNER"
          ? router.replace("/learner/recommend")
          : router.replace("/creator/dashboard");
      },
    });
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "로그아웃 하시겠어요?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
      confirmButtonColor: "#6ead79",
      cancelButtonColor: "#ff4f64",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await postLogout();
          resetUser();
          localStorage.removeItem("accessToken");
          router.push("/login");
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    });
  };

  return (
    <div className="flex justify-between items-center w-full px-4">
      <div className="w-full max-w-[1400px] h-[88px] flex justify-between mx-auto">
        <div className="flex gap-20">
          <Link
            href={recommend.path}
            className="flex justify-center items-center"
          >
            <Image
              className="object-contain"
              src="/insty.png"
              alt="logo"
              width={72}
              height={63}
            />
          </Link>
          <div className="flex justify-center items-center gap-24 cursor-pointer --text-2lg font-bold">
            {LEARNER_MENU_LIST.map((menu) => (
              <Link
                key={menu.id}
                href={menu.path}
                className={`${
                  pathname.includes(menu.path)
                    ? "text-primary-green-600"
                    : "text-black-400"
                }`}
              >
                {menu.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-8 justify-center items-center">
          <GoBellFill className="cursor-pointer size-8 text-gray-300" />
          {userInfo?.thumbnailUrl ? (
            <Image
              src={userInfo.thumbnailUrl}
              width={128}
              height={128}
              alt="프로필 사진"
              style={{ objectFit: "cover", width: "32px", height: "32px" }}
              className="rounded-full"
            />
          ) : (
            <FaCircleUser className="cursor-pointer size-7.5 text-gray-300" />
          )}
          <BaseDropdown
            isOpen={isDropdownMenuOpen}
            setIsOpen={setIsDropdownMenuOpen}
            trigger={
              <button className="--text-2lg font-medium cursor-pointer">
                <div className="flex gap-2 items-center justify-center">
                  <span>{userInfo?.nickname}</span>
                  {isDropdownMenuOpen ? (
                    <GoChevronUp size={20} />
                  ) : (
                    <GoChevronDown size={20} />
                  )}
                </div>
              </button>
            }
            items={[
              {
                label: "🔄 크리에이터로 전환",
                onClick: () => changeUserType(),
              },
              {
                label: "🚪 로그아웃",
                onClick: () => handleLogout(),
                danger: true,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default LearnerHeader;
