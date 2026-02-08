'use client';

import { useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import RichTextEditor from '@/shared/components/editor/RichTextEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { getDisplayContent } from '@/shared/lib/tiptap-content';
import { Star, MoreHorizontal } from 'lucide-react';

type Attachment = {
  id: number;
  name: string;
  url: string;
};

type Answer = {
  answerId: number;
  user: {
    id: number;
    nickname: string;
    userType?: string;
  };
  content: string;
  createdAt: string;
  attachments?: Attachment[];
};

type QuestionAnswersProps = {
  // 답변 데이터
  answers: Answer[];
  acceptedAnswer?: Answer | null;
  totalCount?: number;
  
  // 사용자 정보
  currentUserId?: number;
  questionAuthorId?: number;
  
  // 액션 핸들러
  onAccept?: (answerId: number) => void;
  onEdit?: (answerId: number, content: string) => void;
  onUpdate?: (answerId: number, content: string, files: File[], deleteAttachmentIds: number[]) => void;
  onDelete?: (answerId: number) => void;
  
  // 로딩 상태
  isAccepting?: boolean;
  isUpdating?: boolean;
  
  // 더보기
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export default function QuestionAnswers({
  answers,
  acceptedAnswer,
  totalCount,
  currentUserId,
  questionAuthorId,
  onAccept,
  onEdit,
  onUpdate,
  onDelete,
  isAccepting = false,
  isUpdating = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: QuestionAnswersProps) {
  // 인라인 수정 상태(답변 1개만 동시에 수정 가능)
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingFiles, setEditingFiles] = useState<File[]>([]);
  const [editingExistingAttachments, setEditingExistingAttachments] = useState<Attachment[]>([]);
  const [editingDeleteAttachmentIds, setEditingDeleteAttachmentIds] = useState<number[]>([]);

  // 답변 인라인 수정 시작: 기존 내용/기존 첨부를 상태로 복사하고, 새로 올린 파일/삭제 목록은 초기화
  const startInlineEdit = (answerId: number, content: string, attachments?: Attachment[]) => {
    setEditingAnswerId(answerId);
    setEditingContent(content);
    setEditingFiles([]);
    setEditingExistingAttachments(attachments ?? []);
    setEditingDeleteAttachmentIds([]);
  };

  // 답변 인라인 수정 취소: 편집 상태 초기화
  const cancelInlineEdit = () => {
    setEditingAnswerId(null);
    setEditingContent('');
    setEditingFiles([]);
    setEditingExistingAttachments([]);
    setEditingDeleteAttachmentIds([]);
  };

  // 기존 첨부 삭제 처리(서버에 deleteFileIds로 전달): 화면에서 제거 + 삭제 목록에 id 누적
  const handleRemoveExistingAttachment = (attachmentId: number) => {
    setEditingDeleteAttachmentIds((prev) => [...prev, attachmentId]);
    setEditingExistingAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  // 답변 인라인 수정 저장
  // - editor html에서 텍스트만 뽑아 비어있는 답변 저장을 방지
  // - onUpdate가 있으면(= 인라인 수정 지원) update 콜백 호출
  const saveInlineEdit = () => {
    if (!editingAnswerId) return;
    const textOnly = editingContent
      .replaceAll(/<[^>]*>/g, ' ')
      .replaceAll('&nbsp;', ' ')
      .trim();
    if (!textOnly) return;
    onUpdate?.(editingAnswerId, editingContent, editingFiles, editingDeleteAttachmentIds);
    cancelInlineEdit();
  };

  // 답변(및 채택 답변) 첨부 이미지 렌더링
  const renderAttachments = (attachments?: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {attachments
          .filter((file) => file?.url)
          .map((file) => (
            <div key={file.id} className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={file.url}
                alt={file.name ?? 'Attachment'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 200px"
              />
            </div>
          ))}
      </div>
    );
  };

  return (
    <section className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Answers</h3>
        {totalCount !== undefined && <span className="text-muted-foreground text-xs">{totalCount}</span>}
      </div>

      {/* 채택된 답변 */}
      {acceptedAnswer && (
        <div className="relative rounded-xl border border-primary-green-200 bg-gradient-to-br from-primary-green-50/50 to-primary-green-100/30 p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary-green-400 ring-offset-2">
                  <AvatarFallback className="bg-primary-green-600 text-white font-semibold">
                    {acceptedAnswer.user.nickname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{acceptedAnswer.user.nickname}</h4>
                  </div>
                  <p className="text-primary-green-700 text-xs font-medium mt-0.5">
                    {dayjs(acceptedAnswer.createdAt).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
              </div>
              
              {/* 질문 작성자만 채택 취소 가능 */}
              {questionAuthorId === currentUserId && onAccept && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 text-primary-green-700 hover:text-primary-green-800 hover:bg-primary-green-100"
                  onClick={() => onAccept(acceptedAnswer.answerId)}
                  disabled={isAccepting}
                >
                  {isAccepting ? 'Canceling...' : 'Unaccept'}
                </Button>
              )}
            </div>

            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getDisplayContent(acceptedAnswer.content) }}
            />
            {renderAttachments(acceptedAnswer.attachments)}
          </div>
        </div>
      )}

      {/* 일반 답변 목록 */}
      {answers.length > 0 && (
        <div className="space-y-0">
          {answers.map((answer, index) => (
            <Card
              key={answer.answerId}
              className={`shadow-none rounded-none ${index < answers.length - 1 ? 'border-b' : ''}`}
            >
              <CardContent className="p-2">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {answer.user.nickname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{answer.user.nickname}</h4>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {dayjs(answer.createdAt).format('MMM D, YYYY h:mm A')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 질문 작성자만(그리고 아직 채택 답변이 없을 때만) 답변 채택 가능 */}
                    {questionAuthorId === currentUserId && !acceptedAnswer && onAccept && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => onAccept(answer.answerId)}
                        disabled={isAccepting}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {isAccepting ? 'Accepting...' : 'Accept'}
                      </Button>
                    )}
                    
                    {/* 답변 작성자만 수정/삭제 메뉴 표시 */}
                    {answer.user.id === currentUserId && (onUpdate || onEdit || onDelete) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(onUpdate || onEdit) && (
                            <DropdownMenuItem
                              onClick={() => {
                                // onUpdate가 있으면: 모달 대신 현재 컴포넌트에서 인라인 수정 모드
                                // onUpdate가 없고 onEdit만 있으면: 외부(부모)에서 편집 UI를 처리
                                if (onUpdate) {
                                  startInlineEdit(answer.answerId, answer.content, answer.attachments);
                                  return;
                                }
                                onEdit?.(answer.answerId, answer.content);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(answer.answerId)}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                {!(onUpdate && editingAnswerId === answer.answerId) && (
                  <>
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: getDisplayContent(answer.content) }}
                    />
                    {renderAttachments(answer.attachments)}
                  </>
                )}

                {/* 인라인 수정 모드 */}
                {onUpdate && editingAnswerId === answer.answerId && (
                  <div className="mt-3 space-y-2">
                    <RichTextEditor
                      value={editingContent}
                      onChange={setEditingContent}
                      placeholder="Update your answer"
                      showSendButton={false}
                      showAttachButton={true}
                      onFilesChange={setEditingFiles}
                      existingAttachments={editingExistingAttachments}
                      onRemoveExistingAttachment={handleRemoveExistingAttachment}
                      isDisabled={isUpdating}
                    />
                    {/* Save/Cancel */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelInlineEdit} disabled={isUpdating}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveInlineEdit} disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="w-full"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* 답변 없음 */}
      {!acceptedAnswer && answers.length === 0 && (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">No answers yet. Be the first to answer!</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
