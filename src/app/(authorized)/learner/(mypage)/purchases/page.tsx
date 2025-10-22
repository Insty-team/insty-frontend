'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';

// 임시 데이터 - 추후 API 연동
const mockPurchases = [
  {
    id: 1,
    courseName: 'Next.js 완벽 가이드',
    instructor: '김개발',
    purchaseDate: '2025-10-15',
    price: 59000,
    thumbnail: '/placeholder-course.jpg',
    status: 'completed',
  },
  {
    id: 2,
    courseName: 'React 기초부터 실전까지',
    instructor: '박코딩',
    purchaseDate: '2025-10-10',
    price: 49000,
    thumbnail: '/placeholder-course.jpg',
    status: 'completed',
  },
];

export default function LearnerPurchasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">구매내역</h2>
        <p className="text-muted-foreground mt-1">구매한 강의 목록을 확인하세요</p>
      </div>

      {mockPurchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">아직 구매한 강의가 없습니다</p>
            <Button>강의 둘러보기</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockPurchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-muted h-20 w-32 flex-shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-lg font-semibold">{purchase.courseName}</h3>
                        <p className="text-muted-foreground mb-2 text-sm">{purchase.instructor}</p>
                        <p className="text-muted-foreground text-sm">구매일: {purchase.purchaseDate}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="mb-2 text-lg font-bold">{purchase.price.toLocaleString()}원</p>
                        <Badge variant="secondary">결제완료</Badge>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm">강의 보기</Button>
                      <Button size="sm" variant="outline">
                        영수증 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
