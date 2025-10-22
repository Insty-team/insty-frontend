'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';

export default function CreatorAccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [bankName, setBankName] = useState('신한은행');
  const [accountNumber, setAccountNumber] = useState('110-123-456789');
  const [accountHolder, setAccountHolder] = useState('홍길동');

  const handleSave = () => {
    // TODO: API 연동
    alert('계좌정보가 저장되었습니다!');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">내 계좌정보</h2>
        <p className="text-muted-foreground mt-1">수익금을 받을 계좌를 관리하세요</p>
      </div>

      {/* 현재 계좌 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>등록된 계좌</CardTitle>
              <CardDescription>수익금이 이 계좌로 입금됩니다</CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                수정
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bank">은행</Label>
            <Select value={bankName} onValueChange={setBankName} disabled={!isEditing}>
              <SelectTrigger id="bank">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="신한은행">신한은행</SelectItem>
                <SelectItem value="국민은행">국민은행</SelectItem>
                <SelectItem value="우리은행">우리은행</SelectItem>
                <SelectItem value="하나은행">하나은행</SelectItem>
                <SelectItem value="기업은행">기업은행</SelectItem>
                <SelectItem value="농협은행">농협은행</SelectItem>
                <SelectItem value="카카오뱅크">카카오뱅크</SelectItem>
                <SelectItem value="토스뱅크">토스뱅크</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">계좌번호</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="'-' 없이 입력"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-holder">예금주</Label>
            <Input
              id="account-holder"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave}>저장</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 정산 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>정산 내역</CardTitle>
          <CardDescription>최근 6개월 정산 내역을 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { month: '2025년 10월', amount: 1450000, status: '정산 완료', date: '2025-11-05' },
              { month: '2025년 9월', amount: 1280000, status: '정산 완료', date: '2025-10-05' },
              { month: '2025년 8월', amount: 950000, status: '정산 완료', date: '2025-09-05' },
            ].map((settlement, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{settlement.month}</p>
                    <p className="text-muted-foreground text-sm">{settlement.date} 정산</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{settlement.amount.toLocaleString()}원</p>
                    <p className="text-sm text-green-600">{settlement.status}</p>
                  </div>
                </div>
                {idx < 2 && <Separator />}
              </div>
            ))}
          </div>

          <Button variant="outline" className="mt-4 w-full">
            전체 정산 내역 보기
          </Button>
        </CardContent>
      </Card>

      {/* 세금 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>세금 정보</CardTitle>
          <CardDescription>사업자 정보 및 세금 관련 설정</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">사업자 등록 여부</p>
                <p className="text-muted-foreground text-sm">사업자 정보를 등록하세요</p>
              </div>
              <Button variant="outline" size="sm">
                등록하기
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">원천징수 영수증</p>
                <p className="text-muted-foreground text-sm">연간 원천징수 내역을 확인하세요</p>
              </div>
              <Button variant="outline" size="sm">
                다운로드
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
