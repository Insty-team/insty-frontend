'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/utils';
import { BarChart3, BookOpen, CreditCard } from 'lucide-react';

const navigation = [
  { name: '내 계좌정보', href: '/creator/account', icon: CreditCard },
  { name: '판매 대시보드', href: '/creator/dashboard', icon: BarChart3 },
  { name: '내 강의 관리', href: '/creator/courses', icon: BookOpen },
];

export default function CreatorMyPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">크리에이터 센터</h1>
        <p className="text-muted-foreground mt-2">강의와 수익을 관리하세요</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 사이드바 네비게이션 */}
        <aside className="flex-shrink-0 lg:w-64">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
