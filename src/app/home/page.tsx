'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Markdown } from '@/shared/components/ui/markdown';
import { Separator } from '@/shared/components/ui/separator';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import { useGetSearchRecommendHistory, usePostSearchRecommend } from '@/shared/services/ai-search/ai-search.hook';
import {
  CourseRecommendationResponse,
  RecommendationHistoryResponse,
  RecommendedCourse,
} from '@/shared/services/ai-search/ai-search.type';
import { Send, Sparkles } from 'lucide-react';

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: postSearchRecommend } = usePostSearchRecommend();
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 bg-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="pb-4">
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
      <div className="sticky bottom-0 border-t bg-white">
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
  );
}
