'use client';

import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { getDisplayContent } from '@/shared/lib/tiptap-content';
import { useGetCourseQuestionsInfinite } from '@/shared/services/course/course.hook';
import type { CourseQuestionListItemResponse, CourseQuestionStatus } from '@/shared/services/course/course.type';
import { Search, Calendar } from 'lucide-react';
import QuestionLabel from '@/shared/components/question/QuestionLabel';

type Props = {
  readonly courseId: string;
  readonly onSelectQuestion: (questionId: number) => void;
  readonly onClickWrite: () => void;
  readonly sheetIsOpen: boolean;
  readonly isActive: boolean;
};

export default function QuestionListSheet({
  courseId,
  onSelectQuestion,
  onClickWrite,
  sheetIsOpen,
  isActive,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<'all' | CourseQuestionStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchQuestions,
  } = useGetCourseQuestionsInfinite(Number(courseId), {
    pageSize: 10,
    orderBy: 'createdAt',
    order: 'desc',
    statuses: statusFilter === 'all' ? undefined : [statusFilter],
    keyword: searchQuery || undefined,
  });

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (sheetIsOpen && isActive) {
      refetchQuestions();
    }
  }, [sheetIsOpen, isActive, refetchQuestions]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 필터 버튼 */}
      <div className="flex items-center justify-between gap-3 flex-shrink-0 mb-4">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="h-8 text-sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'WAITING' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('WAITING')}
            className="h-8 text-sm"
          >
            Waiting
          </Button>
          <Button
            variant={statusFilter === 'ANSWERED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('ANSWERED')}
            className="h-8 text-sm"
          >
            Answered
          </Button>
          <Button
            variant={statusFilter === 'ACCEPTED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('ACCEPTED')}
            className="h-8 text-sm"
          >
            Accepted
          </Button>
        </div>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={onClickWrite}
          className="h-8 gap-1.5 text-sm"
        >
          <span className="text-lg">+</span> Write
        </Button>
      </div>

      {/* 질문 검색 */}
      <div className="relative flex-shrink-0 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input 
          placeholder="Search" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>

      {/* 질문 목록 */}
      <ScrollArea className="flex-1 min-h-0">
        {isQuestionsLoading ? (
          <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">Loading...</div>
        ) : isQuestionsError ? (
          <div className="text-muted-foreground py-8 text-center text-sm">Failed to load questions.</div>
        ) : questionsData?.items && questionsData.items.length > 0 ? (
          <div className="space-y-3 pr-4">
            {questionsData.items.map((item: CourseQuestionListItemResponse) => {
              return (
                <Card
                  key={item.questionId}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                  onClick={() => onSelectQuestion(item.questionId)}
                >
                  <CardContent className="p-4">
                    {/* 헤더: 사용자 정보 + 상태 배지 */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {item.user.nickname?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.user.nickname}</span>
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Calendar className="h-3 w-3" />
                            {dayjs(item.createdAt).format('MMM DD, YYYY')}
                          </div>
                        </div>
                      </div>
                      
                      <QuestionLabel status={item.status} />
                    </div>

                    {/* 제목 */}
                    <h4 className="text-foreground text-base font-semibold mb-2 line-clamp-1">
                      Q. {item.title}
                    </h4>

                    {/* 내용 미리보기 */}
                    <p
                      className="text-muted-foreground text-sm line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: getDisplayContent(item.content) }}
                    />
                  </CardContent>
                </Card>
              );
            })}
              
              {/* Load More 버튼 */}
              {hasNextPage && (
                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                    className="w-full"
                  >
                    {isFetchingNextPage ? 'Loading...' : `Load More (${questionsData.pagination?.currentPage || 1} / ${questionsData.pagination?.totalPages || 1})`}
                  </Button>
                </div>
              )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground py-8 text-center text-sm">
            <p>No questions registered.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
