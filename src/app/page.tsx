import ScrollAnimation from './_components/ScrollAnimation';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowDown, BookOpen, Brain, CheckCircle, MessageCircle, Sparkles, Upload, Zap } from 'lucide-react';

import creatorGif from '@/assets/creatorfunc.gif';
import learnerGif from '@/assets/learnerfunc.gif';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-white">
      <ScrollAnimation />

      {/* 로그인 버튼 - 글래스 효과 */}
      <Link
        href="/login"
        className="fixed-login-button fixed top-4 right-4 z-50 rounded-full bg-white/80 px-6 py-2.5 font-semibold text-gray-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="text-primary-green-500 h-4 w-4" />
          로그인
        </span>
      </Link>

      {/* Hero 섹션 */}
      <section
        id="problem"
        data-section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      >
        {/* 애니메이션 배경 */}
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-violet-100 via-blue-50 to-emerald-100" />

        {/* 플로팅 장식 요소들 */}
        <div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-300 opacity-30 mix-blend-multiply blur-3xl" />
        <div className="animate-blob absolute top-40 right-10 h-72 w-72 rounded-full bg-yellow-300 opacity-30 mix-blend-multiply blur-3xl [animation-delay:2s]" />
        <div className="animate-blob absolute bottom-20 left-1/2 h-72 w-72 rounded-full bg-pink-300 opacity-30 mix-blend-multiply blur-3xl [animation-delay:4s]" />

        {/* 플로팅 아이콘들 */}
        <div className="animate-float absolute top-32 left-[15%] rounded-2xl bg-white/60 p-4 shadow-lg backdrop-blur-sm">
          <span className="text-3xl">🛠️</span>
        </div>
        <div className="animate-float-delayed absolute top-48 right-[20%] rounded-2xl bg-white/60 p-4 shadow-lg backdrop-blur-sm">
          <span className="text-3xl">⚙️</span>
        </div>
        <div className="animate-float absolute bottom-40 left-[20%] rounded-2xl bg-white/60 p-4 shadow-lg backdrop-blur-sm [animation-delay:1s]">
          <span className="text-3xl">💡</span>
        </div>
        <div className="animate-float-delayed absolute right-[15%] bottom-32 rounded-2xl bg-white/60 p-4 shadow-lg backdrop-blur-sm">
          <span className="text-3xl">🚀</span>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* 배지 */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm">
            <Sparkles className="text-primary-green-500 h-4 w-4" />
            <span className="text-sm font-medium text-gray-700">AI 기반 설치 가이드 플랫폼</span>
          </div>

          <h1 className="mb-8 text-5xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-7xl">
            처음에 뭐든{' '}
            <span className="relative">
              <span className="gradient-text-blue">설치하고 세팅</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10C50 4 150 4 198 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            하고
            <br />참 어렵죠?
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-xl text-gray-600 md:text-2xl">
            설치 방법부터 복잡한 환경 설정까지...
          </p>

          <p className="mb-12 text-2xl font-semibold md:text-3xl">
            복잡한 설치, <span className="gradient-text">Insty</span>가 해결해 드릴게요!
          </p>

          <div className="flex justify-center">
            <div className="animate-bounce rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm">
              <ArrowDown className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </section>

      {/* 러너 섹션 */}
      <section
        id="learner"
        data-section
        className="relative flex min-h-screen translate-y-10 items-center justify-center overflow-hidden px-6 py-20 opacity-0 transition-all duration-1000 ease-out"
      >
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,white_1px,transparent_1px),radial-gradient(circle_at_75%_75%,white_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">For Learners</span>
            </div>
            <h2 className="mb-6 text-4xl font-extrabold text-white md:text-6xl">
              러너라면 내가 원하는
              <br />
              <span className="text-yellow-300">강의를 찾아보세요</span>
            </h2>
            <p className="mx-auto max-w-xl text-xl text-white/80">Insty AI가 가이드와 강의 추천을 해드릴게요.</p>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* GIF 컨테이너 */}
            <div className="relative">
              <div className="animate-pulse-glow absolute -inset-4 rounded-3xl bg-white/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
                <Image src={learnerGif} alt="learnerfunc" width={600} height={600} unoptimized className="rounded-xl" />
              </div>
            </div>

            {/* 기능 카드들 */}
            <div className="space-y-6">
              <div className="group glass-card transform rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">AI 학습 도우미</h3>
                </div>
                <p className="text-gray-600">수강 중 막히는 부분이 있다면, 즉시 질문하고 맞춤형 답변을 받으세요.</p>
              </div>

              <div className="group glass-card transform rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">강의 추천</h3>
                </div>
                <p className="text-gray-600">내 목표에 맞는 강의를 AI가 추천해 드립니다.</p>
              </div>

              <div className="group glass-card transform rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <MessageCircle className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">커뮤니티</h3>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Coming Soon
                  </span>
                </div>
                <p className="text-gray-600">크리에이터와 소통하며 성장하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 크리에이터 섹션 */}
      <section
        id="creator"
        data-section
        className="relative flex min-h-screen translate-y-10 items-center justify-center overflow-hidden px-6 py-20 opacity-0 transition-all duration-1000 ease-out"
      >
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100" />

        {/* 장식 요소 */}
        <div className="animate-blob bg-primary-green-300 absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl" />
        <div className="animate-blob absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-teal-300 opacity-20 blur-3xl [animation-delay:3s]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="bg-primary-green-500/10 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <Zap className="text-primary-green-600 h-4 w-4" />
              <span className="text-primary-green-700 text-sm font-medium">For Creators</span>
            </div>
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900 md:text-6xl">
              크리에이터라면
              <br />
              <span className="gradient-text">불필요한 시간을 줄이세요</span>
            </h2>
            <p className="mx-auto max-w-xl text-xl text-gray-600">Insty AI가 영상을 분석하여 초안을 완성해 드립니다.</p>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* 스텝 카드들 */}
            <div className="order-2 space-y-6 lg:order-1">
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-blue-500 to-blue-600" />
                <div className="flex items-start gap-5 pl-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-xl font-bold text-white shadow-lg">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-semibold text-blue-600">STEP 1</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-800">영상 업로드</h3>
                    <p className="text-gray-600">강의 영상을 업로드하세요.</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-purple-500 to-purple-600" />
                <div className="flex items-start gap-5 pl-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-semibold text-purple-600">STEP 2</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-800">AI 초안 분석</h3>
                    <p className="text-gray-600">제목부터 핵심 내용까지, 자동으로 완성해 드립니다.</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="bg-primary-green-500 to-primary-green-600 absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-emerald-500" />
                <div className="flex items-start gap-5 pl-4">
                  <div className="bg-primary-green-500 to-primary-green-600 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 text-xl font-bold text-white shadow-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-primary-green-600 mb-1 text-sm font-semibold">STEP 3</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-800">업로드 완료!</h3>
                    <p className="text-gray-600">훨씬 더 쉽게 강의를 준비할 수 있어요.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GIF 컨테이너 */}
            <div className="relative order-1 lg:order-2">
              <div className="animate-pulse-glow bg-primary-green-400/30 absolute -inset-4 rounded-3xl blur-2xl" />
              <div className="border-primary-green-200 relative overflow-hidden rounded-2xl border bg-white p-2 shadow-2xl">
                <Image src={creatorGif} alt="creatorfunc" width={600} height={600} unoptimized className="rounded-xl" />
              </div>
            </div>
          </div>

          {/* 하단 배지 */}
          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl bg-white px-8 py-5 shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">강의 준비 시간이 엄청 줄어들 거예요!</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section
        id="cta"
        data-section
        className="relative translate-y-10 overflow-hidden py-32 text-white opacity-0 transition-all duration-1000 ease-out"
      >
        {/* 배경 */}
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.03)_55%,transparent_55%)] bg-[length:20px_20px]" />
        </div>

        {/* 장식 원들 */}
        <div className="animate-pulse-glow bg-primary-green-500/30 absolute top-10 left-10 h-32 w-32 rounded-full blur-2xl" />
        <div className="animate-pulse-glow absolute right-10 bottom-10 h-40 w-40 rounded-full bg-blue-500/30 blur-2xl [animation-delay:2s]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="text-primary-green-400 h-4 w-4" />
            <span className="text-sm font-medium text-white/90">무료로 시작하세요</span>
          </div>

          <h2 className="mb-6 text-4xl font-extrabold md:text-6xl">
            지금 바로
            <br />
            <span className="from-primary-green-400 bg-gradient-to-r via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              경험해 보세요!
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-white/70">
            복잡한 설치 과정, 이제 Insty와 함께 쉽게 해결하세요.
          </p>

          <Link
            href="/home"
            className="group from-primary-green-500 hover:shadow-primary-green-500/25 relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r to-emerald-500 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">시작하기</span>
            <ArrowDown className="relative z-10 h-5 w-5 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
            <div className="animate-shimmer absolute inset-0" />
          </Link>
        </div>
      </section>
    </div>
  );
}
