'use client';

import { ServiceIntro, SignupForm } from './_components';

/**
 * 회원가입 페이지
 *
 * 책임:
 * - 페이지 레이아웃 구성
 * - 서비스 소개와 회원가입 폼 조합
 */
export default function SignupPage() {
  return (
    <section className="flex min-h-screen">
      <ServiceIntro />
      <SignupForm />
    </section>
  );
}
