import ScrollAnimation from './_components/ScrollAnimation';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowDown } from 'lucide-react';

import creatorGif from '@/assets/creatorfunc.gif';
import learnerGif from '@/assets/learnerfunc.gif';

export default function Home() {
  return (
    <div className="relative bg-white">
      <ScrollAnimation />
      <Link
        href="/login"
        className="fixed-login-button hover:bg-primary-green-600 bg-primary-green-500 fixed top-2 right-2 z-50 rounded-xl px-6 py-2 font-bold text-white transition-all duration-300"
      >
        로그인
      </Link>

      <section
        id="problem"
        data-section
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-black-500 mb-8 text-5xl font-bold">처음에 뭐든 설치하고 세팅하고 참 어렵죠?</h1>
          <p className="text-black-200 mb-6 text-3xl md:text-2xl">설치 방법부터 복잡한 환경 설정까지...</p>
          <p className="text-black-100 mb-12 text-2xl">복잡한 설치, 저희 Insty가 해결해 드릴게요!</p>
          <ArrowDown className="text-gray-scale-400 mx-auto size-8 animate-bounce" />
        </div>
      </section>

      <section
        id="learner"
        data-section
        className="flex min-h-screen translate-y-10 items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-6 opacity-0 transition-all duration-1000 ease-out"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-primary-blue-500 mb-6 text-4xl font-bold md:text-5xl">
              러너라면 내가 원하는 강의를 찾아보세요
            </h2>
            <p className="text-black-200 text-xl">Insty AI가 가이드와 강의 추천을 해드릴게요.</p>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <Image src={learnerGif} alt="learnerfunc" width={500} height={500} unoptimized />
            <div>
              <div className="space-y-8">
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h3 className="text-black-400 mb-3 text-xl font-bold">🤖 AI 학습 도우미</h3>
                  <p className="text-black-200">수강 중 막히는 부분이 있다면, 즉시 질문하고 맞춤형 답변을 받으세요.</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h3 className="text-black-400 mb-3 text-xl font-bold">📚 강의 추천</h3>
                  <p className="text-black-200">내 목표에 맞는 강의를 AI가 추천해 드립니다.</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h3 className="text-black-400 mb-3 text-xl font-bold">💬 커뮤니티 (구현 예정)</h3>
                  <p className="text-black-200">크리에이터와 소통하며 성장하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="creator"
        data-section
        className="flex min-h-screen translate-y-10 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-6 opacity-0 transition-all duration-1000 ease-out"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-primary-green-500 mb-6 text-4xl font-bold md:text-5xl">
              크리에이터라면 불필요한 시간을 줄이세요
            </h2>
            <p className="text-black-200 text-xl">Insty AI가 영상을 분석하여 초안을 완성해 드립니다.</p>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <Image src={creatorGif} alt="creatorfunc" width={500} height={500} unoptimized />

            <div className="order-1 md:order-2">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-blue-400 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white">
                    1
                  </div>
                  <div>
                    <h3 className="text-black-400 mb-2 text-xl font-bold">영상 업로드</h3>
                    <p className="text-black-200">강의 영상을 업로드하세요.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-verdigris flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white">
                    2
                  </div>
                  <div>
                    <h3 className="text-black-400 mb-2 text-xl font-bold">AI 초안 분석</h3>
                    <p className="text-black-200">제목부터 핵심 내용까지, 자동으로 완성해 드립니다.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-green-600 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white">
                    3
                  </div>
                  <div>
                    <h3 className="text-black-400 mb-2 text-xl font-bold">업로드 완료!</h3>
                    <p className="text-black-200">훨씬 더 쉽게 강의를 준비할 수 있어요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-6 rounded-full bg-white px-8 py-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span className="text-black-300 font-semibold">강의 준비 시간이 엄청 줄어들 거예요!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cta"
        data-section
        className="bg-black-400 translate-y-10 py-20 text-white opacity-0 transition-all duration-1000 ease-out"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-gray-scale-50 mb-8 text-4xl font-bold">지금 바로 경험해 보세요!</h2>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="bg-primary-green-500 hover:bg-primary-green-600 rounded-lg px-8 py-4 font-bold text-white transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
