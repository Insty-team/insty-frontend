import Image from 'next/image';
import Link from 'next/link';

import { Facebook, Instagram, Mail, Twitter, Youtube } from 'lucide-react';

import LogoImage from '@/assets/Logo.png';

// TODO: 브랜드 로고 변경해야함 simple-icons
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* 회사 정보 */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image src={LogoImage} alt="Insty" width={120} height={40} className="h-8 w-auto" />
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md text-sm">
              Insty는 누구나 쉽게 배우고 가르칠 수 있는 온라인 강의 플랫폼입니다. 당신의 지식과 경험을 공유하고, 새로운
              것을 배워보세요.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
              <Link
                href="mailto:contact@insty.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="mb-4 font-semibold">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  강의 둘러보기
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/apply"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  크리에이터 신청
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  요금 안내
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  블로그
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h3 className="mb-4 font-semibold">지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  고객센터
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  사이트맵
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h3 className="mb-4 font-semibold">정책</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  환불정책
                </Link>
              </li>
              <li>
                <Link
                  href="/community-guidelines"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  커뮤니티 가이드
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-muted-foreground text-sm">
              <p>© {currentYear} Insty. All rights reserved.</p>
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <span>사업자등록번호: 123-45-67890</span>
              <span className="hidden md:inline">|</span>
              <span>대표이사: 홍길동</span>
              <span className="hidden md:inline">|</span>
              <span>서울특별시 강남구 테헤란로 123</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
