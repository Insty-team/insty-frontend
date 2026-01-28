import AuthGuard from '@/shared/components/AuthGuard';

export default function CreatorCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      }
    >
      {children}
    </AuthGuard>
  );
}
