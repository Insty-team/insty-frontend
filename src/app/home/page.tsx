'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Markdown } from '@/shared/components/ui/markdown';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { useGetSearchRecommendHistory, usePostSearchRecommend } from '@/shared/services/ai-search/ai-search.hook';
import {
  CourseRecommendationResponse,
  RecommendationHistoryResponse,
  RecommendedCourse,
} from '@/shared/services/ai-search/ai-search.type';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MoreHorizontal,
  PenSquare,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';

import instyLogo from '@/assets/Logo.png';

// 목업 채팅 히스토리 데이터
const MOCK_CHAT_HISTORY = [
  {
    id: '1',
    title: 'React 강의 추천 요청',
    preview: 'React 기초부터 고급까지 배울 수 있는...',
    date: new Date(),
    category: 'today',
  },
  {
    id: '2',
    title: 'Python 데이터 분석 강의',
    preview: '판다스와 넘파이를 활용한...',
    date: new Date(),
    category: 'today',
  },
  {
    id: '3',
    title: 'TypeScript 입문 강의',
    preview: '타입스크립트 기초 문법부터...',
    date: new Date(Date.now() - 86400000),
    category: 'yesterday',
  },
  {
    id: '4',
    title: 'Next.js 풀스택 개발',
    preview: 'Next.js로 풀스택 웹앱 만들기...',
    date: new Date(Date.now() - 86400000),
    category: 'yesterday',
  },
  {
    id: '5',
    title: 'Docker & Kubernetes',
    preview: '컨테이너 기술의 기초부터...',
    date: new Date(Date.now() - 86400000 * 3),
    category: 'week',
  },
  {
    id: '6',
    title: 'AWS 클라우드 입문',
    preview: 'AWS 서비스 전반에 대한...',
    date: new Date(Date.now() - 86400000 * 5),
    category: 'week',
  },
  {
    id: '7',
    title: '알고리즘 문제 풀이',
    preview: '코딩테스트 대비 알고리즘...',
    date: new Date(Date.now() - 86400000 * 10),
    category: 'month',
  },
  {
    id: '8',
    title: 'Git & GitHub 마스터',
    preview: '버전 관리의 기초부터...',
    date: new Date(Date.now() - 86400000 * 15),
    category: 'month',
  },
];

type ChatHistoryItem = (typeof MOCK_CHAT_HISTORY)[number];

// 사이드바 컴포넌트
function ChatSidebar({
  isOpen,
  onToggle,
  chatHistory,
  selectedChatId,
  onSelectChat,
  onNewChat,
}: {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: ChatHistoryItem[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}) {
  const groupedHistory = {
    today: chatHistory.filter((chat) => chat.category === 'today'),
    yesterday: chatHistory.filter((chat) => chat.category === 'yesterday'),
    week: chatHistory.filter((chat) => chat.category === 'week'),
    month: chatHistory.filter((chat) => chat.category === 'month'),
  };

  const ChatItem = ({ chat }: { chat: ChatHistoryItem }) => (
    <button
      onClick={() => onSelectChat(chat.id)}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-slate-100',
        selectedChatId === chat.id && 'bg-slate-100',
      )}
    >
      <MessageSquare className="size-4 shrink-0 text-slate-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700">{chat.title}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="rounded p-1 hover:bg-slate-200"
          onClick={(e) => {
            e.stopPropagation();
            // 편집 기능 (UI만)
          }}
        >
          <PenSquare className="size-3.5 text-slate-500" />
        </button>
        <button
          className="rounded p-1 hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation();
            // 삭제 기능 (UI만)
          }}
        >
          <Trash2 className="size-3.5 text-red-500" />
        </button>
      </div>
    </button>
  );

  const CategorySection = ({ title, chats }: { title: string; chats: ChatHistoryItem[] }) => {
    if (chats.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</p>
        <div className="space-y-0.5">
          {chats.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 flex h-screen flex-col border-r bg-slate-50 transition-all duration-300',
          isOpen ? 'w-72' : 'w-0',
        )}
      >
        {isOpen && (
          <>
            {/* 사이드바 헤더 */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Image src={instyLogo} alt="Insty AI" height={26} />
              </div>
              <Button variant="ghost" size="icon" onClick={onToggle} className="size-8">
                <ChevronLeft className="size-4" />
              </Button>
            </div>

            {/* 새 채팅 버튼 */}
            <div className="p-3">
              <Button
                onClick={onNewChat}
                variant="outline"
                className="w-full justify-start gap-2 border-dashed border-slate-300 bg-white hover:bg-slate-50"
              >
                <PenSquare className="size-4" />
                <span>새 채팅 시작</span>
              </Button>
            </div>

            {/* 채팅 히스토리 */}
            <ScrollArea className="flex-1 px-2">
              <div className="py-2">
                <CategorySection title="오늘" chats={groupedHistory.today} />
                <CategorySection title="어제" chats={groupedHistory.yesterday} />
                <CategorySection title="지난 7일" chats={groupedHistory.week} />
                <CategorySection title="지난 30일" chats={groupedHistory.month} />
              </div>
            </ScrollArea>

            {/* 사이드바 푸터 */}
            <div className="border-t p-3">
              <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-slate-300 text-xs text-slate-700">나</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">사용자</p>
                  <p className="truncate text-xs text-slate-500">무료 플랜</p>
                </div>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4 text-slate-500" />
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* 사이드바 토글 버튼 (닫힌 상태) */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 size-10 rounded-full border-slate-200 bg-white shadow-md hover:bg-slate-50"
        >
          <ChevronRight className="size-5" />
        </Button>
      )}
    </>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  courses?: RecommendedCourse[];
}

const createWelcomeMessage = (): Message => ({
  id: `welcome-${Date.now()}`,
  role: 'assistant',
  content:
    '안녕하세요! 👋 저는 Insty AI 강의 추천 어시스턴트입니다. 어떤 강의를 찾고 계신가요? 관심 분야, 학습 목표, 선호하는 학습 스타일 등을 알려주시면 맞춤형 강의를 추천해드리겠습니다!',
  timestamp: new Date(),
  courses: [],
});

export default function LearnerPage() {
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 사이드바 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');

  const { mutateAsync: postSearchRecommend } = usePostSearchRecommend();
  const { data: searchRecommendHistory } = useGetSearchRecommendHistory();

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  type RecommendationHistoryMessage = RecommendationHistoryResponse['messages'][number];

  const mapHistoryMessageToMessage = useCallback((message: RecommendationHistoryMessage): Message => {
    if (message.sender === 'assistant') {
      return {
        id: message.message_id.toString(),
        role: 'assistant',
        content: message.content,
        timestamp: new Date(message.created_at),
        courses: message.courses ?? [],
      };
    }

    return {
      id: message.message_id.toString(),
      role: 'user',
      content: message.content,
      timestamp: new Date(message.created_at),
    };
  }, []);

  useEffect(() => {
    if (!searchRecommendHistory?.messages || searchRecommendHistory.messages.length === 0) {
      setMessages([createWelcomeMessage()]);
      return;
    }

    setMessages(searchRecommendHistory.messages.map(mapHistoryMessageToMessage));
    setErrorMessage(null);
  }, [mapHistoryMessageToMessage, searchRecommendHistory?.messages]);

  const appendAssistantErrorMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (rawMessage: string) => {
      const text = rawMessage.trim();
      if (!text) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await postSearchRecommend({
          query: text,
        });
        const assistantPayload: CourseRecommendationResponse | undefined = response?.data;

        if (!assistantPayload) {
          appendAssistantErrorMessage('AI 응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.');
          return;
        }

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: assistantPayload.message,
          courses: assistantPayload.courses,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('메시지 전송 실패:', error);
        setErrorMessage('메시지 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
        appendAssistantErrorMessage('메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    },
    [appendAssistantErrorMessage],
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
  };

  const handleRequestCourse = (course: RecommendedCourse) => {
    void sendMessage(`"${course.course_title}" 강의를 신청하고 싶습니다.`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setSelectedChatId(id);
    // 실제 구현 시 해당 채팅 내용을 불러오는 로직 추가
  }, []);

  const handleNewChat = useCallback(() => {
    setSelectedChatId(null);
    setMessages([createWelcomeMessage()]);
    // 새 채팅 시작 로직
  }, []);

  return (
    <div className="flex h-screen w-full">
      {/* 사이드바 */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        chatHistory={MOCK_CHAT_HISTORY}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* 메인 채팅 영역 */}
      <div
        className={cn(
          'flex flex-1 flex-col bg-gradient-to-b from-slate-100 to-white transition-all duration-300',
          isSidebarOpen ? 'ml-72' : 'ml-0',
        )}
      >
        {/* 헤더 */}
        <div className="border-b bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && <div className="w-10" />} {/* 토글 버튼 공간 확보 */}
              <div>
                <p className="text-sm text-slate-500">React 강의 추천 요청</p>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-hidden">
          <div className="mx-auto h-full max-w-5xl px-4">
            <div ref={scrollRef} className="h-full overflow-y-auto pb-4">
              <div className="space-y-6">
                {errorMessage && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-gray-200 text-gray-700">AI</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`flex max-w-[80%] flex-col gap-2 ${
                        message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'rounded-tr-none bg-gray-200 text-gray-700'
                            : 'rounded-tl-none bg-white shadow-sm'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          <Markdown>{message.content}</Markdown>
                        </div>
                      </div>
                      {/* 강의 추천 카드 */}
                      {message.courses && message.courses.length > 0 && (
                        <div className="grid w-full grid-cols-3 gap-3">
                          {message.courses.map((course) => (
                            <Card
                              key={course.course_id}
                              className="w-full justify-between overflow-hidden transition-all hover:shadow-md"
                            >
                              <CardHeader>
                                <CardTitle className="h-12 text-base font-semibold">{course.course_title}</CardTitle>
                              </CardHeader>
                              <CardContent className="bg-muted relative h-48 w-full flex-shrink-0">
                                {course.thumbnail_url && (
                                  <Image
                                    src={course.thumbnail_url}
                                    alt={course.course_title}
                                    className="object-contain transition-transform duration-200"
                                    fill
                                  />
                                )}
                              </CardContent>
                              <Separator />
                              <CardFooter className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">무료</span>
                                <Button variant="ghost" size="sm">
                                  <Link href={`/course/${course.course_id}`}>수강하기</Link>
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}

                      <span className="text-xs text-slate-400">
                        {message.timestamp.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {message.role === 'user' && (
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-slate-200 text-slate-700">나</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* 로딩 인디케이터 */}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-gray-200 text-gray-700">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Spinner className="size-3 text-slate-500" />
                        <p className="text-sm text-slate-500">
                          최고의 결과를 위해 생각을 정리 중이에요... 잠시만 기다려주세요 ✨
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="어떤 강의를 찾고 계신가요? (Shift + Enter로 줄바꿈)"
                className="max-h-[200px] min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="size-[60px] shrink-0"
              >
                <Send className="size-5" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              AI가 제공하는 정보는 참고용이며, 실제 강의 내용과 다를 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
