'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const qaHistory = [
  {
    id: 'qa-1',
    courseTitle: 'React 서버 컴포넌트 심화',
    question: 'use server에서 클라이언트 상태를 어떻게 관리하나요?',
    answerSnippet:
      'React 19에서는 서버 데이터를 선물아도, 클라이언트 상태는 use client 컴포넌트에서 useState/유효한 store로 분리하면 됩니다.',
    status: '답변 완료',
    answeredAt: '2025년 11월 22일',
  },
  {
    id: 'qa-2',
    courseTitle: 'Next.js 성능 최적화',
    question: 'prefetch와 use client 경계 처리는 어떻게 정하는 게 좋을까요?',
    answerSnippet:
      '기본은 서버 컴포넌트로 두고, prefetch가 필요한 interactive 내는 use client로 따로 묶어서 필요한 시점에만 상태를 관리하세요.',
    status: '답변 중',
    answeredAt: '2025년 11월 24일',
  },
  {
    id: 'qa-3',
    courseTitle: '테스트 자동화',
    question: 'React Query의 isFetching과 isLoading을 같이 쓰는 팁이 있을까요?',
    answerSnippet: '전자는 백그라운드 갱신, 후자는 첫 로딩이므로 버튼 disable 등 UI 영향 구분해서 쓰면 됩니다.',
    status: '일시 보류',
    answeredAt: '2025년 11월 20일',
  },
];

const communityComments = [
  {
    id: 'community-1',
    courseTitle: 'TypeScript 완전정복',
    content: '함께 복습할 모각코 파트너 구합니다! 마음 맞으신 분 DM 주세요.',
    author: '수강생 김하나',
    postedAt: '2시간 전',
    likes: 8,
    replies: 3,
  },
  {
    id: 'community-2',
    courseTitle: 'AI 기반 콘텐츠 제작',
    content: '이번 챕터에서 추천해준 생성형 프롬프트 템플릿 잘 써먹고 있어요.',
    author: '수강생 정민우',
    postedAt: '어제',
    likes: 12,
    replies: 5,
  },
  {
    id: 'community-3',
    courseTitle: 'Next.js 마스터',
    content: '코드 리뷰 파트에서 사용한 디렉토리 구조로 시작해도 될까요?',
    author: '수강생 박유진',
    postedAt: '2025년 11월 24일',
    likes: 4,
    replies: 1,
  },
];

const chatbotHistory = [
  {
    date: '2025년 11월 26일',
    questions: [
      {
        id: 'chat-1',
        courseTitle: 'AI 챗봇 헬퍼',
        time: '13:42',
        text: 'CSV 데이터가 깨끗하지 않을 때 Next.js에서 미리 검증하는 패턴이 궁금해요.',
      },
      {
        id: 'chat-2',
        courseTitle: 'AI 챗봇 헬퍼',
        time: '14:10',
        text: '파일 업로드 전용 인풋에 focus 유지하는 방법 알려주세요.',
      },
    ],
  },
  {
    date: '2025년 11월 25일',
    questions: [
      {
        id: 'chat-3',
        courseTitle: '실전 React',
        time: '10:05',
        text: 'useMemo 대신 use client 상태를 분리하는 기준이 뭐죠?',
      },
    ],
  },
];

export default function LearnerHistoryPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Q&amp;A · 커뮤니티 · 챗봇</h2>
        <p className="text-muted-foreground mt-1">
          강의별로 남긴 질문과 커뮤니티 코멘트, AI 챗봇에 묻고 답한 히스토리를 탭으로 확인하세요.
        </p>
      </div>

      <Tabs defaultValue="qa" className="space-y-6">
        <TabsList>
          <TabsTrigger value="qa">Q&amp;A 히스토리</TabsTrigger>
          <TabsTrigger value="community">커뮤니티 댓글</TabsTrigger>
          <TabsTrigger value="chatbot">챗봇 질문</TabsTrigger>
        </TabsList>

        <TabsContent value="qa">
          <div className="space-y-4">
            {qaHistory.map((item) => (
              <article
                key={item.id}
                className="border-border bg-card/60 rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      {item.courseTitle}
                    </p>
                    <h2 className="text-foreground mt-1 text-lg font-semibold">{item.question}</h2>
                  </div>
                  <span className="border-border text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium tracking-widest uppercase">
                    {item.status}
                  </span>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.answerSnippet}</p>
                <p className="text-muted-foreground mt-4 text-xs">답변일 {item.answeredAt}</p>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="space-y-4">
            {communityComments.map((comment) => (
              <article key={comment.id} className="border-border bg-background/50 rounded-2xl border p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      {comment.courseTitle}
                    </p>
                    <h2 className="text-foreground mt-1 text-lg font-semibold">{comment.content}</h2>
                  </div>
                  <div className="text-muted-foreground text-right text-xs">
                    <p>{comment.author}</p>
                    <p className="mt-1">{comment.postedAt}</p>
                  </div>
                </div>
                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                  <span>좋아요 {comment.likes}</span>
                  <span>댓글 {comment.replies}</span>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="space-y-5">
            {chatbotHistory.map((group) => (
              <section key={group.date} className="border-border bg-card/40 space-y-3 rounded-2xl border px-5 py-4">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">{group.date}</p>
                <div className="space-y-3">
                  {group.questions.map((question) => (
                    <div key={question.id} className="border-border/80 bg-background/80 rounded-2xl border p-4">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>{question.courseTitle}</span>
                        <span>{question.time}</span>
                      </div>
                      <p className="text-foreground mt-2 text-sm font-medium">{question.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
