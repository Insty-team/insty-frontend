'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Bot, CheckCircle2, MessageSquare } from 'lucide-react';

// 임시 데이터 (실제 API 연동 시 교체)
const pendingQa = [
  {
    id: 'qa-1',
    courseTitle: 'React 서버 컴포넌트 심화',
    question: 'use server에서 클라이언트 상태를 어떻게 관리하나요?',
    author: '수강생 김**',
    askedAt: '2025년 11월 22일',
    status: '답변 대기',
  },
  {
    id: 'qa-2',
    courseTitle: 'Next.js 성능 최적화',
    question: 'prefetch와 use client 경계 처리는 어떻게 정하는 게 좋을까요?',
    author: '수강생 이**',
    askedAt: '2025년 11월 24일',
    status: '답변 대기',
  },
  {
    id: 'qa-3',
    courseTitle: '테스트 자동화',
    question: 'React Query의 isFetching과 isLoading을 같이 쓰는 팁이 있을까요?',
    author: '수강생 박**',
    askedAt: '2025년 11월 20일',
    status: '답변 대기',
  },
];

const communityToModerate = [
  {
    id: 'comm-1',
    courseTitle: 'TypeScript 완전정복',
    content: '함께 복습할 모각코 파트너 구합니다! 마음 맞으신 분 DM 주세요.',
    author: '수강생 김하나',
    postedAt: '2시간 전',
    likes: 8,
    replies: 3,
  },
];

const chatbotQuestions = [
  {
    id: 'chat-1',
    courseTitle: 'AI 챗봇 헬퍼',
    question: 'CSV 데이터가 깨끗하지 않을 때 Next.js에서 미리 검증하는 패턴이 궁금해요.',
    time: '13:42',
    date: '2025년 11월 26일',
  },
];

export default function CreatorQaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Q&A · 커뮤니티 · 챗봇 답변</h2>
        <p className="text-muted-foreground mt-1">
          수강생의 질문에 답하고, 커뮤니티와 챗봇 질문을 확인하세요
        </p>
      </div>

      <Tabs defaultValue="qa" className="space-y-6">
        <TabsList>
          <TabsTrigger value="qa">Q&A 답변 대기</TabsTrigger>
          <TabsTrigger value="community">커뮤니티</TabsTrigger>
          <TabsTrigger value="chatbot">챗봇 질문</TabsTrigger>
        </TabsList>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                답변 대기 Q&A
              </CardTitle>
              <CardDescription>수강생이 남긴 질문에 답변해 주세요</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingQa.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">답변 대기 중인 질문이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingQa.map((item) => (
                    <article
                      key={item.id}
                      className="border-border bg-card/60 rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                            {item.courseTitle}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">{item.question}</h3>
                          <p className="text-muted-foreground mt-2 text-sm">
                            {item.author} · {item.askedAt}
                          </p>
                        </div>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                      <Button className="mt-4" size="sm">
                        답변 작성
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>커뮤니티 활동</CardTitle>
              <CardDescription>내 강의 커뮤니티 게시물을 확인하고 참여하세요</CardDescription>
            </CardHeader>
            <CardContent>
              {communityToModerate.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">확인할 커뮤니티 글이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {communityToModerate.map((item) => (
                    <article
                      key={item.id}
                      className="border-border rounded-xl border bg-background/50 p-5 shadow-sm"
                    >
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                        {item.courseTitle}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">{item.content}</h3>
                      <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
                        <span>{item.author}</span>
                        <span>{item.postedAt}</span>
                        <span>좋아요 {item.likes}</span>
                        <span>댓글 {item.replies}</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4">
                        댓글 달기
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                챗봇 질문 기록
              </CardTitle>
              <CardDescription>
                수강생이 AI 챗봇에 한 질문을 확인하고, 필요 시 보완 답변을 제공하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chatbotQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bot className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">챗봇 질문 기록이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatbotQuestions.map((item) => (
                    <article
                      key={item.id}
                      className="border-border/80 rounded-xl border bg-background/80 p-4"
                    >
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>{item.courseTitle}</span>
                        <span>
                          {item.date} {item.time}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium">{item.question}</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        추가 답변 보기
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
