"use client"

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { postSocialLogin } from '@/app/api/backend';
import { useAuthStore, useUserStore } from '@/app/stores';
import { UserType } from '@/app/types';

function KaKaoCallback() {
  const router = useRouter()
  const params = useParams();
  const searchParams = useSearchParams();

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const { setAccessToken, setRefreshToken } = useAuthStore();
  const { setUser, setUserType } = useUserStore()

  useEffect(() => {
    if (!code || !state) { return }
    console.log('code', code, 'state', state)

    const sendCodeToBackend = async () => {
      try {
        const res = await postSocialLogin('KAKAO', { code: code, userType: state as UserType })
        console.log('postSocialLogin', res)

        setAccessToken(res.token.accessToken)
        setRefreshToken(res.token.refreshToken)

        setUser({
          nickname: res.nickname,
          userType: res.userType
        })

        if (params.userType === "creator") {
          setUserType("CREATOR");
          router.push("/creator/dashboard");
        } else {
          setUserType("LEARNER");
          router.push("/learner/recommend");
        }
      } catch (err) {
        console.error('로그인 실패:', err);
        router.replace('/login')
      }
    };

    sendCodeToBackend();
  }, [code, router]);


  return <>카카오 로그인 중...</>
}

export default KaKaoCallback