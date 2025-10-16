import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import instyPng from '@/assets/insty.png';

export default function Login() {
  return (
    <>
      <section className="flex min-h-screen items-center justify-center p-8">
        <div className="flex flex-col items-center gap-12">
          <Image src={instyPng} alt="logo" className="w-[208px]" priority />
          <div className="text-center">
            <p className="text-black-200 text-lg">어떤 활동을 시작하시겠어요?</p>
            <p className="text-black-400/90 text-2xl font-bold">가입 유형을 선택하고 시작하세요!</p>
          </div>
          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <div className="group border-primary-blue-400 flex h-[360px] w-[320px] flex-col items-center justify-between gap-8 rounded-2xl border-4 px-8 py-10 shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <span className="text-2xl font-bold select-none">러너</span>
              <div className="flex w-full flex-col items-start gap-4">
                <p className="text-lg font-medium">
                  설치 가이드를 보고 <br /> 전문가처럼 설치해 보세요!
                </p>
                <p className="text-black-200 text-base">영상과 문서로 쉽게 설치하세요.</p>
              </div>
              <Link
                href="/login/learner"
                className="group-hover:bg-primary-blue-400/30 flex h-12 cursor-pointer items-center gap-2 rounded-sm px-10 py-2 text-xl transition-all duration-300 group-hover:font-bold group-hover:text-blue-500"
              >
                <span>시작하기</span>
                <ChevronRight className="size-5" />
              </Link>
            </div>

            <div className="group flex h-[360px] w-[320px] flex-col items-center justify-between gap-8 rounded-2xl border-4 border-orange-400 px-8 py-10 shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <span className="text-2xl font-bold select-none">크리에이터</span>
              <div className="flex w-full flex-col items-start gap-4">
                <p className="text-lg font-medium">
                  나만의 설치 가이드 제작으로 <br /> 수익을 창출할 수 있어요!
                </p>
                <p className="text-black-200 text-base">설치 가이드를 제작하고 공유하세요.</p>
              </div>
              <Link
                href="/login/creator"
                className="flex h-12 cursor-pointer items-center gap-2 rounded-sm px-10 py-2 text-xl transition-all duration-300 group-hover:bg-orange-400/30 group-hover:font-bold group-hover:text-orange-500"
              >
                <span>시작하기</span>
                <ChevronRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
