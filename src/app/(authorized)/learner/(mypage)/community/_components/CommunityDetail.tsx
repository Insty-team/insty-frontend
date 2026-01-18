
'use client';

import { useState } from 'react';

import CommunityTextArea from '@/shared/components/editor/CommunityTextArea';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ArrowLeft, Heart, MessageCircle, Calendar, MoreHorizontal } from 'lucide-react';
import { useGetCourseCommunityPostById, useGetCourseCommunityPostCommentsInfinite, usePostCourseCommunityPostCommentById, useDeleteCourseCommunityPostCommentById, usePostCourseCommunityPostLike, useDeleteCourseCommunityPostLike, usePostCourseCommunityPostCommentLike, useDeleteCourseCommunityPostCommentLike } from '@/shared/services/community/community.hook';
import { usePostCourseVideoUpload } from '@/shared/services/video/video.hook';
import { useGetProfile } from '@/shared/services/user/user.hook';
import dayjs from 'dayjs';

type Props = {
  courseId: string;
  courseName: string;
  postId: number;
  onBack: () => void;
};

function CommentLikeButton({ commentId, likeCount, likedByMe }: { commentId: number; likeCount: number; likedByMe: boolean }) {
  const { mutate: likeComment, isPending: isLiking } = usePostCourseCommunityPostCommentLike(commentId);
  const { mutate: unlikeComment, isPending: isUnliking } = useDeleteCourseCommunityPostCommentLike(commentId);

  const handleToggleLike = () => {
    if (likedByMe) {
      unlikeComment();
    } else {
      likeComment();
    }
  };

  return (
    <button 
      className={`flex items-center gap-2 transition-colors ${likedByMe ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={handleToggleLike}
      disabled={isLiking || isUnliking}
    >
      <Heart className={`h-4 w-4 ${likedByMe ? 'fill-current' : ''}`} />
      <span className="text-xs">{likeCount}</span>
    </button>
  );
}

export default function CommunityDetail({ courseId, courseName, postId, onBack }: Props) {
  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;
  
  const { data: post, isLoading, isError } = useGetCourseCommunityPostById(Number(courseId), postId);
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourseCommunityPostCommentsInfinite(Number(courseId), postId, 20);

  const comments = commentsData?.items || [];
  const pagination = commentsData?.pagination;
  const [commentContent, setCommentContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [videoUuid, setVideoUuid] = useState<string | null>();
  const [editorKey, setEditorKey] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  
  const { mutate: postComment, isPending: isPosting } = usePostCourseCommunityPostCommentById(Number(courseId), postId);
  const { mutate: uploadVideo, isPending: isUploadingVideo } = usePostCourseVideoUpload();
  const { mutate: deleteComment } = useDeleteCourseCommunityPostCommentById();
  const { mutate: likePost, isPending: isLiking } = usePostCourseCommunityPostLike(Number(courseId), postId);
  const { mutate: unlikePost, isPending: isUnliking } = useDeleteCourseCommunityPostLike(Number(courseId), postId);

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCommentToDelete(null);
        },
      });
    }
  };

  const handleToggleLike = () => {
    if (post?.likedByMe) {
      unlikePost();
    } else {
      likePost();
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
        
    console.log('댓글 작성 정보:', {
      content: commentContent,
      videoUuid: videoUuid,
      attachments: attachedFiles,
    });
    
    postComment(
      {
        content: commentContent,
        videoUuid: undefined,
        attachments: attachedFiles,
      },
      {
        onSuccess: () => {
          setCommentContent('');
          setAttachedFiles([]);
          setVideoUuid(undefined);
          setEditorKey(prev => prev + 1); // 강제 리랜더링
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Post Detail</h3>
          </div>
        </div>
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Post Detail</h3>
          </div>
        </div>
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Failed to load post</p>
            <Button variant="outline" onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold">
            {courseName}
          </h3>
        </div>
        <div className="size-8"></div>
      </div>

      {/* 포스트 상세 내용부터 스크롤 */}
      <ScrollArea className="max-w-3xl mx-auto h-full rounded-lg h-[calc(100vh-20rem)] bg-white">
          <Card className="border-b shadow-none">
            <CardContent className="">
            {/* 포스트 헤더 */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {post.user?.nickname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-lg">{post.user?.nickname}</div>
                  <div className="flex gap-1 items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    {dayjs(post.createdAt).format('MMM D, YYYY h:mm A')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 포스트 내용 */}
            <div className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">
              {post.content}
            </div>
            
            {/* 이미지 */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {post.attachments
                  .filter((file: any) => file?.url)
                  .map((file: any) => (
                    <div key={file.id} className="relative inline-block">
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-60 w-auto rounded border object-contain"
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* 포스트 푸터 */}
            <div className="flex items-center gap-3 mt-6 pt-4">
              <button 
                className={`flex items-center gap-2 transition-colors ${post.likedByMe ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={handleToggleLike}
                disabled={isLiking || isUnliking}
              >
                <Heart className={`h-5 w-5 ${post.likedByMe ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likeCount ?? 0}</span>
              </button>
              <button 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsCommenting(!isCommenting)}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{pagination?.totalItems ?? 0}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 댓글 섹션 */}
        <div>
          {/* 댓글 작성 폼 */}
          <div className={`transition-all duration-300 ease-in-out ${isCommenting ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            {isCommenting && (
              <Card className="border-b shadow-none">
                <CardContent className="">
                  <CommunityTextArea
                    key={editorKey}
                    value={commentContent}
                    onChange={setCommentContent}
                    onSend={handleSubmitComment}
                    placeholder="Write a comment..."
                    showSendButton={true}
                    showAttachButton={true}
                    isSending={isPosting}
                    onFilesChange={setAttachedFiles}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          
          {comments.length === 0 ? (
            <Card className="shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment, index) => (
              <Card key={comment.commentId} className={`shadow-none ${index < comments.length - 1 ? 'border-b' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {comment.user?.nickname?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{comment.user?.nickname}</div>
                        <div className="flex gap-1 items-center text-muted-foreground text-sm">
                          <Calendar className="h-4 w-4" />
                          {dayjs(comment.createdAt).format('MMM D, YYYY h:mm A')}
                        </div>
                      </div>
                    </div>
                    
                    {/* 내 댓글일 경우 드롭다운 메뉴 */}
                    {comment.user?.id === currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteComment(comment.commentId)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </div>
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {comment.attachments
                            .filter((attachment: any) => attachment?.url)
                            .map((attachment: any) => (
                              <div key={attachment.id} className="relative inline-block">
                                <Image
                                  src={attachment.url}
                                  alt={attachment.name}
                                  width={0}
                                  height={0}
                                  sizes="100vw"
                                  className="h-20 w-auto rounded border object-contain"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    
                    {/* 댓글 좋아요 */}
                    <CommentLikeButton 
                      commentId={comment.commentId}
                      likeCount={comment.likeCount ?? 0}
                      likedByMe={comment.likedByMe ?? false}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {/* 더보기 버튼 */}
          {hasNextPage && (
            <div className="flex justify-center py-4 px-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="w-full"
              >
                {isFetchingNextPage ? 'Loading...' : `Load More (${pagination?.currentPage || 1} / ${pagination?.totalPages || 1})`}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteComment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}