'use client';

import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { BookOpen, Clock, Plus, Send, Sparkles, Star, Users } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  courses?: CourseRecommendation[];
}

interface CourseRecommendation {
  id: string;
  title: string;
  instructor: string;
  description: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: string;
  available: boolean;
}

export default function LearnerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '안녕하세요! 👋 저는 Insty AI 강의 추천 어시스턴트입니다. 어떤 강의를 찾고 계신가요? 관심 분야, 학습 목표, 선호하는 학습 스타일 등을 알려주시면 맞춤형 강의를 추천해드리겠습니다!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 시뮬레이션: AI 응답 (실제로는 API 호출)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '관심사를 분석해보니 다음 강의들을 추천드립니다:',
        timestamp: new Date(),
        courses: [
          {
            id: '1',
            title: 'React와 Next.js 마스터하기',
            instructor: '김개발',
            description: '현대적인 웹 애플리케이션 개발의 핵심 기술을 배워보세요.',
            rating: 4.8,
            students: 1234,
            duration: '12주',
            level: '중급',
            price: '₩89,000',
            available: true,
          },
          {
            id: '2',
            title: 'TypeScript 완벽 가이드',
            instructor: '이타입',
            description: '타입스크립트로 안전하고 확장 가능한 코드를 작성하는 법을 학습합니다.',
            rating: 4.9,
            students: 856,
            duration: '8주',
            level: '초급',
            price: '₩69,000',
            available: true,
          },
          {
            id: '3',
            title: '고급 웹 성능 최적화',
            instructor: '박최적',
            description: '웹사이트의 성능을 극대화하는 다양한 기법들을 배웁니다.',
            rating: 4.7,
            students: 432,
            duration: '6주',
            level: '고급',
            price: '₩0',
            available: false,
          },
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleRequestCourse = (course: CourseRecommendation) => {
    const requestMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `"${course.title}" 강의를 신청하고 싶습니다.`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, requestMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `"${course.title}" 강의 신청이 접수되었습니다! 📝\n\n강사님께 강의 개설 요청을 전달했으며, 충분한 수강생이 모이면 강의가 개설됩니다. 강의 개설 알림을 이메일로 보내드리겠습니다. 다른 도움이 필요하신가요?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* 헤더 */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="from-primary-green-100 to-primary-green-600 flex size-10 items-center justify-center rounded-full bg-gradient-to-br">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI 강의 추천</h1>
              <p className="text-sm text-slate-500">원하는 강의를 찾아보세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-5xl px-4 py-6">
          <div ref={scrollRef} className="h-full overflow-y-auto pb-4">
            <div className="space-y-6">
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* 강의 추천 카드 */}
                    {message.courses && message.courses.length > 0 && (
                      <div className="w-full space-y-3">
                        {message.courses.map((course) => (
                          <Card key={course.id} className="w-full overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <CardTitle className="text-base leading-tight font-semibold">
                                    {course.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1 text-sm">{course.instructor}</CardDescription>
                                </div>
                                <Badge variant={course.available ? 'default' : 'secondary'} className="shrink-0">
                                  {course.available ? '수강 가능' : '개설 예정'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <p className="mb-3 text-sm text-slate-600">{course.description}</p>
                              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{course.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="size-3.5" />
                                  <span>{course.students.toLocaleString()}명</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="size-3.5" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="size-3.5" />
                                  <span>{course.level}</span>
                                </div>
                              </div>
                            </CardContent>
                            <Separator />
                            <CardFooter className="flex items-center justify-between pt-3">
                              <span className="text-lg font-bold text-blue-600">{course.price}</span>
                              <Button
                                size="sm"
                                variant={course.available ? 'default' : 'outline'}
                                onClick={() => {
                                  if (course.available) {
                                    // 수강 신청 로직
                                    alert('수강 신청 페이지로 이동합니다.');
                                  } else {
                                    handleRequestCourse(course);
                                  }
                                }}
                              >
                                {course.available ? (
                                  <>
                                    <BookOpen className="size-4" />
                                    수강 신청
                                  </>
                                ) : (
                                  <>
                                    <Plus className="size-4" />
                                    강의 신청
                                  </>
                                )}
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
                    <div className="flex gap-1">
                      <div className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
                      <div className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
                      <div className="size-2 animate-bounce rounded-full bg-slate-400"></div>
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
  );
}
