import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import instyPng from '@/assets/insty.png';

function Select() {
  return (
    <>
      <div className="flex w-full justify-center p-8">
        <div className="flex flex-col items-center">
          <Image src={instyPng} alt="logo" width={208} height={181} priority />
          <div className="mt-12 text-center">
            <p className="text-black-200 text-2xl">어떤 활동을 시작하시겠어요?</p>
            <p className="text-black-400 text-3xl font-bold">가입 유형을 선택하고 시작하세요!</p>
          </div>
          <div className="mt-12 flex justify-between gap-20">
            <div className="!border-primary-blue-400 flex h-[400px] flex-col items-center justify-between rounded-2xl border p-16">
              <p className="text-black-400 mb-4 text-3xl font-semibold">러너</p>
              <div className="text-black-200 text-center text-2xl">
                <div>
                  <p>설치 가이드를 보고</p>
                  <p>전문가처럼 설치해 보세요!</p>
                </div>
                <div className="mt-2">
                  <p>영상과 문서로</p>
                  <p>따라 하기 쉬운 가이드 제공</p>
                </div>
              </div>
              <Link
                href="/login/learner"
                className="bg-primary-blue-300 hover:bg-primary-blue-500 mt-12 flex h-12 cursor-pointer items-center gap-2 rounded-2xl border px-10 py-2 text-xl text-white"
              >
                <span>시작하기</span>
                <ChevronRight className="size-5" />
              </Link>
            </div>
            <div className="!border-orange flex h-[400px] flex-col items-center justify-between rounded-2xl border p-16">
              <p className="text-black-400 mb-4 text-3xl font-semibold">크리에이터</p>
              <div className="text-black-200 text-center text-2xl">
                <div>
                  <p>나만의 설치 가이드를</p>
                  <p>제작하고 공유하세요!</p>
                </div>
                <div className="mt-2">
                  <p>가이드 제작으로</p>
                  <p>수익을 창출할 수 있어요.</p>
                </div>
              </div>
              <Link
                href="/login/creator"
                className="bg-orange hover:bg-orange-hover mt-12 flex h-12 cursor-pointer items-center gap-2 rounded-2xl border px-10 py-2 text-xl text-white"
              >
                <span>시작하기</span>
                <ChevronRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Select;
