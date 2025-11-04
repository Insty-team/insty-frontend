'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

const categories = [
  '프로그래밍',
  '웹 개발',
  '모바일 앱 개발',
  '데이터 사이언스',
  'AI/머신러닝',
  '디자인',
  '비즈니스',
  '기타',
];

export default function LearnerCourseRequestPage() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: API 연동
    setTimeout(() => {
      alert('강의 요청이 제출되었습니다!');
      setCategory('');
      setTitle('');
      setDescription('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">강의 요청하기</h2>
        <p className="text-muted-foreground mt-1">원하는 강의를 요청하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>강의 요청 작성</CardTitle>
          <CardDescription>
            어떤 강의를 듣고 싶으신가요? 여러분의 요청을 크리에이터들이 확인하고 강의를 제작할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">강의 제목</Label>
              <Input
                id="title"
                placeholder="예: React Native로 크로스플랫폼 앱 만들기"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                placeholder="어떤 내용을 다루면 좋을지, 어떤 수준의 강의를 원하시는지 자세히 작성해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                required
              />
              <p className="text-muted-foreground text-sm">최소 50자 이상 작성해주세요</p>
            </div>

            <Button type="submit" disabled={isSubmitting || !category || !title || description.length < 50}>
              {isSubmitting ? '제출 중...' : '요청 제출'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 내가 요청한 강의 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>내가 요청한 강의</CardTitle>
          <CardDescription>제출한 강의 요청 목록을 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">아직 요청한 강의가 없습니다</div>
        </CardContent>
      </Card>
    </div>
  );
}
