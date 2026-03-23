'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { LoginRequiredLink } from '@/shared/components/LoginRequiredLink';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Markdown } from '@/shared/components/ui/markdown';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { useGetSearchRecommendHistory, usePostSearchRecommend, usePostSearchRecommendServices } from '@/shared/services/ai-search/ai-search.hook';
import {
  CourseRecommendationResponse,
  RecommendationHistoryResponse,
  RecommendedCourse,
  RecommendedService,
} from '@/shared/services/ai-search/ai-search.type';
import { ExternalLink, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  courses?: RecommendedCourse[];
  services?: RecommendedService[];
}

const createWelcomeMessage = (): Message => ({
  id: `welcome-${Date.now()}`,
  role: 'assistant',
  content:
    '안녕하세요! 👋 저는 Insty AI 강의 추천 어시스턴트입니다. 어떤 강의를 찾고 계신가요? 관심 분야, 학습 목표, 선호하는 학습 스타일 등을 알려주시면 맞춤형 강의를 추천해드리겠습니다!',
  timestamp: new Date(),
  courses: [],
});

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: postSearchRecommend } = usePostSearchRecommend();
  const { mutateAsync: postSearchRecommendServices } = usePostSearchRecommendServices();
  const { data: searchRecommendHistory } = useGetSearchRecommendHistory();

  // 자동 스크롤 (전체 페이지)
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
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
        const [servicesResponse, coursesResponse] = await Promise.all([
          postSearchRecommendServices({ query: text }),
          postSearchRecommend({ query: text }),
        ]);

        const servicesPayload = servicesResponse?.data;
        const coursesPayload: CourseRecommendationResponse | undefined = coursesResponse?.data;

        if (!servicesPayload && !coursesPayload) {
          appendAssistantErrorMessage('AI 응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.');
          return;
        }

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: servicesPayload?.message ?? coursesPayload?.message ?? '',
          services: servicesPayload?.services ?? [],
          courses: coursesPayload?.courses ?? [],
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 bg-gray-100">
        <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
          <div className="pb-4">
            <div className="space-y-4 sm:space-y-6">
              {errorMessage && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 sm:px-4 sm:py-3 sm:text-sm">
                  {errorMessage}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="size-7 shrink-0 sm:size-8">
                      <AvatarFallback className="bg-gray-200 text-xs text-gray-700 sm:text-sm">AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`flex max-w-[85%] flex-col gap-2 sm:max-w-[80%] ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 ${
                        message.role === 'user'
                          ? 'rounded-tr-none bg-gray-200 text-gray-700'
                          : 'rounded-tl-none bg-white shadow-sm'
                      }`}
                    >
                      <div className="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                    {/* AI 서비스 추천 카드 */}
                    {message.services && message.services.length > 0 && (
                      <div className="w-full space-y-3">
                        <p className="text-xs font-semibold text-slate-500 sm:text-sm">추천 AI 서비스</p>
                        {message.services.map((service) => (
                          <Card key={service.title} className="w-full overflow-hidden">
                            <CardHeader className="p-3 pb-2 sm:p-4 sm:pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-sm font-semibold sm:text-base">{service.title}</CardTitle>
                                <a
                                  href={service.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex shrink-0 items-center gap-1 text-xs text-blue-500 hover:underline"
                                >
                                  바로가기 <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                              <p className="text-xs text-slate-500 sm:text-sm">{service.description}</p>
                            </CardHeader>
                            {service.courses && service.courses.length > 0 && (
                              <>
                                <Separator />
                                <CardContent className="p-3 sm:p-4">
                                  <p className="mb-2 text-xs font-medium text-slate-400">관련 강의</p>
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {service.courses.map((course) => (
                                      <Card
                                        key={course.course_id}
                                        className="w-full justify-between overflow-hidden transition-all hover:shadow-md"
                                      >
                                        <CardHeader className="p-3 sm:p-4">
                                          <CardTitle className="line-clamp-2 h-10 text-xs font-semibold sm:h-12 sm:text-sm">
                                            {course.course_title}
                                          </CardTitle>
                                        </CardHeader>
                                        {course.thumbnail_url && (
                                          <CardContent className="bg-muted relative h-24 w-full flex-shrink-0 sm:h-32">
                                            <Image
                                              src={course.thumbnail_url}
                                              alt={course.course_title}
                                              className="object-contain transition-transform duration-200"
                                              fill
                                            />
                                          </CardContent>
                                        )}
                                        <Separator />
                                        <CardFooter className="flex items-center justify-between p-3 sm:p-4">
                                          <span className="text-xs font-medium text-slate-500">무료</span>
                                          <LoginRequiredLink
                                            href={`/course/${course.course_id}`}
                                            className="text-xs font-medium underline-offset-4 hover:underline"
                                            dialogDescription="강의를 수강하려면 먼저 로그인해 주세요."
                                          >
                                            수강하기
                                          </LoginRequiredLink>
                                        </CardFooter>
                                      </Card>
                                    ))}
                                  </div>
                                </CardContent>
                              </>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* 강의 추천 카드 */}
                    {message.courses && message.courses.length > 0 && (
                      <div className="w-full space-y-2">
                        <p className="text-xs font-semibold text-slate-500 sm:text-sm">추천 강의</p>
                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                          {message.courses.map((course) => (
                            <Card
                              key={course.course_id}
                              className="w-full justify-between overflow-hidden transition-all hover:shadow-md"
                            >
                              <CardHeader className="p-3 sm:p-4 lg:p-6">
                                <CardTitle className="line-clamp-2 h-10 text-sm font-semibold sm:h-12 sm:text-base">
                                  {course.course_title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="bg-muted relative h-32 w-full flex-shrink-0 sm:h-40 lg:h-48">
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
                              <CardFooter className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
                                <span className="text-xs font-medium text-slate-500 sm:text-sm">무료</span>
                                <LoginRequiredLink
                                  href={`/course/${course.course_id}`}
                                  className="text-xs font-medium underline-offset-4 hover:underline sm:text-sm"
                                  dialogDescription="강의를 수강하려면 먼저 로그인해 주세요."
                                >
                                  수강하기
                                </LoginRequiredLink>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 sm:text-xs">
                      {message.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="size-7 shrink-0 sm:size-8">
                      <AvatarFallback className="bg-slate-200 text-xs text-slate-700 sm:text-sm">나</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* 로딩 인디케이터 */}
              {isLoading && (
                <div className="flex gap-2 sm:gap-3">
                  <Avatar className="size-7 shrink-0 sm:size-8">
                    <AvatarFallback className="bg-gray-200 text-xs text-gray-700 sm:text-sm">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl border bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Spinner className="size-3 text-slate-500" />
                      <p className="text-xs text-slate-500 sm:text-sm">
                        <span className="hidden sm:inline">최고의 결과를 위해 생각을 정리 중이에요... 잠시만 기다려주세요 ✨</span>
                        <span className="sm:hidden">생각 중이에요... ✨</span>
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
      <div className="sticky bottom-0 border-t bg-white">
        <div className="mx-auto max-w-5xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="어떤 강의를 찾고 계신가요?"
              className="max-h-[120px] min-h-[48px] resize-none text-sm sm:max-h-[200px] sm:min-h-[60px] sm:text-base"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="size-12 shrink-0 sm:size-[60px]"
            >
              <Send className="size-4 sm:size-5" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-500 sm:text-xs">
            AI가 제공하는 정보는 참고용이며, 실제 강의 내용과 다를 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
