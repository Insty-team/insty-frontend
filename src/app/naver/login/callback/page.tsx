"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { postSocialLogin } from "@/app/api/backend";
import { useAuthStore, useUserStore } from "@/app/stores";
import { UserType } from "@/app/types";

function NaverCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const { setAccessToken, setRefreshToken } = useAuthStore();
  const { setUser, setUserType } = useUserStore();

  useEffect(() => {
    if (!code || !state) {
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        const res = await postSocialLogin("NAVER", {
          code: code,
          userType: state as UserType,
        });
        setAccessToken(res.token.accessToken);
        setRefreshToken(res.token.refreshToken);

        setUser({
          nickname: res.nickname,
          userType: res.userType,
        });

        if (res.userType === "CREATOR") {
          setUserType("CREATOR");
          router.push("/creator/dashboard");
        } else {
          setUserType("LEARNER");
          router.push("/learner/recommend");
        }
      } catch (err) {
        console.error("로그인 실패:", err);
        router.replace("/login");
      }
    };

    sendCodeToBackend();
  }, [code, router]);

  return (
    <Suspense fallback={<div>네이버 로그인 중...</div>}>
      <div>네이버 로그인 중...</div>
    </Suspense>
  );
}

export default NaverCallback;
