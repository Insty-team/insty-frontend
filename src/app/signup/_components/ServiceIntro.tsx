import Image from 'next/image';

import { BookOpen, Play, Share2 } from 'lucide-react';

import instyPng from '@/assets/Logo.png';

/**
 * 서비스 소개 영역 컴포넌트
 *
 * 책임:
 * - 왼쪽 사이드 서비스 소개 UI 렌더링
 * - 로그인/회원가입 페이지에서 공통 사용
 */
export const ServiceIntro = () => {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-12 lg:flex">
      <div className="flex max-w-md flex-col items-center gap-10 text-center text-white">
        <Image src={instyPng} alt="logo" className="w-[180px] brightness-0 invert" priority />
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">설치 가이드 플랫폼</h1>
          <p className="text-lg text-emerald-100">인스티와 함께 시작하세요!</p>
        </div>

        <div className="mt-4 space-y-6">
          <FeatureItem
            icon={<Play className="h-5 w-5" />}
            title="영상으로 쉽게 배우기"
            description="전문가의 설치 가이드 영상을 보고 따라하세요"
          />
          <FeatureItem
            icon={<BookOpen className="h-5 w-5" />}
            title="문서로 꼼꼼히 확인"
            description="단계별 문서 가이드로 놓친 부분을 체크하세요"
          />
          <FeatureItem
            icon={<Share2 className="h-5 w-5" />}
            title="나만의 가이드 제작"
            description="설치 가이드를 만들어 공유하고 수익을 창출하세요"
          />
        </div>
      </div>
    </div>
  );
};

type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex items-start gap-4 text-left">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-emerald-100">{description}</p>
      </div>
    </div>
  );
};
