'use client';

import { useMemo, useState } from 'react';

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Spinner } from '@/shared/components/ui/spinner';
import { useGetCourseCommunityPostsInfinite, useDeleteCourseCommunityPostById, usePostCourseCommunityPostById, usePostCourseCommunityPostLike, useDeleteCourseCommunityPostLike } from '@/shared/services/community/community.hook';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { usePostCommunityThoughtDraft } from '@/shared/services/ai-community/ai-community.hook';
import dayjs from 'dayjs';
import { ArrowLeft, Calendar, MessageCircle, Heart, MoreHorizontal, Sparkles, Copy, Check, X } from 'lucide-react';

type Props = {
  courseId: string;
  courseName: string;
  onBack: () => void;
  onPostClick: (postId: number) => void;
};

type PostRow = {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
  author: string;
  userId?: number;
  attachments?: any[];
};

function LikeButton({ postId, likeCount, likedByMe, courseId }: { postId: number; likeCount: number; likedByMe: boolean; courseId: number }) {
  const { mutate: likePost, isPending: isLiking } = usePostCourseCommunityPostLike(courseId, postId);
  const { mutate: unlikePost, isPending: isUnliking } = useDeleteCourseCommunityPostLike(courseId, postId);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedByMe) {
      unlikePost();
    } else {
      likePost();
    }
  };

  return (
    <button 
      className={`flex items-center gap-2 transition-colors ${likedByMe ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={handleToggleLike}
      disabled={isLiking || isUnliking}
    >
      <Heart className={`h-5 w-5 ${likedByMe ? 'fill-current' : ''}`} />
      <span className="text-sm">{likeCount}</span>
    </button>
  );
}

export default function CommunityFeed({ courseId, courseName, onBack, onPostClick }: Props) {
  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;
  
  const [postContent, setPostContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  
  // AI panel states
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiFiles, setAiFiles] = useState<File[]>([]);
  const [aiResult, setAiResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const {
    data: postsData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourseCommunityPostsInfinite(Number(courseId), 20);

  const { mutate: deletePost } = useDeleteCourseCommunityPostById(Number(courseId));
  const { mutate: createPost, isPending: isPosting } = usePostCourseCommunityPostById(Number(courseId));
  const { mutate: generateThoughtDraft, isPending: isGeneratingDraft } = usePostCommunityThoughtDraft();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
      deletePost(postToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPostToDelete(null);
        },
      });
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    createPost(
      {
        title: postContent.split('\n')[0].substring(0, 50) || 'New Post',
        content: postContent,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      },
      {
        onSuccess: () => {
          setPostContent('');
          setUploadedFiles([]);
          setEditorKey(prev => prev + 1);
        },
      },
    );
  };

  const handlePolishPost = () => {
    if (!postContent.trim()) return;
    
    setIsPolishing(true);
    
    setTimeout(() => {
      const polishedContent = `📝 ${postContent.trim()}`;
      setPostContent(polishedContent);
      setIsPolishing(false);
    }, 1500);
  };

  const handleOpenAiPanel = () => {
    setIsAiPanelOpen(true);
    setAiInput('');
    setAiFiles([]);
    setAiResult('');
    setAiError('');
    setIsCopied(false);
  };

  const handleCloseAiPanel = () => {
    setIsAiPanelOpen(false);
  };

  const handleGenerateAiContent = async () => {
    if (!aiInput.trim()) return;
    
    setIsGenerating(true);
    setAiError('');
    setAiResult('');
    setIsCopied(false);
    
    generateThoughtDraft(
      {
        course_id: Number(courseId),
        query: aiInput,
        has_attachment: aiFiles.length > 0,
        files: aiFiles.length > 0 ? aiFiles : undefined,
      },
      {
        onSuccess: (response) => {
          const { post_content } = response.data;
          setAiResult(post_content);
          setIsGenerating(false);
        },
        onError: (error) => {
          setAiError('Something went wrong. Please try again.');
          setIsGenerating(false);
        },
      },
    );
  };

  const handleApplyResult = async () => {
    if (!aiResult) return;
    
    try {
      await navigator.clipboard.writeText(aiResult);
      
      setIsCopied(true);
      
      setTimeout(() => {
        if (aiFiles.length > 0) {
          setUploadedFiles(prev => [...prev, ...aiFiles]);
          setEditorKey(prev => prev + 1);
        }
        setIsCopied(false);
        setIsAiPanelOpen(false);
      }, 500);
    } catch (error) {
      console.error('Failed to copy:', error);
      setAiError('Failed to copy text. Please try again.');
    }
  };

  const posts = useMemo(() => postsData?.items?.map((post) => {
    type ExtendedPost = typeof post & {
      commentCount?: number;
      createdDate?: string;
      likeCount?: number;
      likedByMe?: boolean;
    };

    const extended = post as ExtendedPost;

    const commentCount = typeof extended.commentCount === 'number' && Number.isFinite(extended.commentCount) ? extended.commentCount : 0;
    const likeCount = typeof extended.likeCount === 'number' && Number.isFinite(extended.likeCount) ? extended.likeCount : 0;

    const rawCreatedDate = extended.createdDate ?? extended.createdAt;
    let formattedCreatedDate = 'Date info unavailable';
    if (rawCreatedDate) {
      const date = new Date(rawCreatedDate);
      formattedCreatedDate = Number.isNaN(date.getTime()) ? rawCreatedDate : date.toLocaleDateString('en-US');
    }

    return {
      id: post.postId,
      title: post.title ?? 'Untitled Post',
      content: post.content ?? '',
      createdDate: formattedCreatedDate,
      commentCount,
      likeCount,
      likedByMe: extended.likedByMe ?? false,
      author: post.user?.nickname ?? 'Unknown Author',
      userId: post.user?.id,
      attachments: post.attachments,
    };
  }) || [], [postsData]);
  const pagination = postsData?.pagination;
  const showLoadingState = isLoading || (posts.length === 0 && isFetchingNextPage);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold">{courseName}</h3>
        </div>
        <div className="size-8"></div>
      </div>

      {/* 포스트 목록 */}
      {showLoadingState ? (
        <Card className="shadow-none rounded-lg max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Loading community posts...</p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="shadow-none rounded-lg max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">Failed to load community posts</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="shadow-none rounded-lg max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No community posts yet</p>
            <Button>Create First Post</Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="max-w-3xl mx-auto h-[calc(100vh-20rem)] rounded-lg bg-white">
          <div className="">
              <div className="p-4">
                <div className="space-y-3">
                  <CommunityTextArea
                    key={editorKey}
                    value={postContent}
                    onChange={setPostContent}
                    placeholder="Share your thoughts, ask questions, or spark a conversation..."
                    onSend={handleCreatePost}
                    showSendButton={true}
                    showAttachButton={true}
                    onFilesChange={setUploadedFiles}
                    isSending={isPosting}
                    className="rounded-md"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenAiPanel}
                      className="gap-2"
                    >
                      <Sparkles className="size-4" />
                      Help me organize my thoughts (optional)
                    </Button>
                  </div>
                </div>
              </div>
            {posts.map((post, index) => (
              <Card key={post.id} className={`shadow-none ${index < posts.length - 1 ? 'border-b' : ''}`}>
                <CardContent className="p-6">
                {/* 포스트 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.author}</div>
                      <div className="flex gap-1 items-center text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        {dayjs(post.createdDate).format('MMM D, YYYY h:mm A')}
                      </div>
                    </div>
                  </div>
                  
                  {/* 내 포스트일 경우 드롭다운 메뉴 */}
                  {post.userId === currentUserId && (
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
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* 포스트 내용 */}
                <div 
                  className="space-y-4 cursor-pointer p-2 -m-2 rounded-md transition-colors"
                  onClick={() => onPostClick(post.id)}
                >
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                  
                  {/* 이미지 */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.attachments
                        .filter((file: any) => file?.url)
                        .slice(0, 2)
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
                </div>

                {/* 포스트 푸터 */}
                <div className="flex items-center gap-3 mt-6 pt-4">
                  <LikeButton 
                    postId={post.id} 
                    likeCount={post.likeCount} 
                    likedByMe={post.likedByMe}
                    courseId={Number(courseId)}
                  />
                  <button 
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => onPostClick(post.id)}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.commentCount}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* 더보기 버튼 */}
          {hasNextPage && posts.length > 0 && (
            <div className="flex justify-center py-4 px-6">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full"
              >
                {isFetchingNextPage ? 'Loading...' : `Load More (${pagination?.currentPage || 1} / ${pagination?.totalPages || 1})`}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 커뮤니티 포스트 AI 초안 작성 패널 */}
      <Sheet open={isAiPanelOpen} onOpenChange={setIsAiPanelOpen}>
        <SheetContent side="right" className="w-[600px] sm:w-[600px] !max-w-none overflow-y-auto px-8">
          <SheetHeader>
            <SheetTitle>Help me organize my thoughts</SheetTitle>
            <SheetDescription>
              Jot down a few thoughts and let AI help you organize them into a clear post.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* AI Input */}
            <div className="space-y-2">
              <CommunityTextArea
                value={aiInput}
                onChange={setAiInput}
                placeholder="Jot down a few thoughts…"
                showSendButton={false}
                showAttachButton={true}
                onFilesChange={setAiFiles}
                className="min-h-[80px]"
                isDisabled={isGenerating}
              />
            </div>
            
            {/* Generate Button */}
            <Button
              onClick={handleGenerateAiContent}
              disabled={!aiInput.trim() || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Spinner className="size-4" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate
                </>
              )}
            </Button>
            
            {/* AI Result */}
            {aiResult && (
              <div className="space-y-3 rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">AI suggestion:</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleApplyResult}
                    className="gap-2 h-8"
                  >
                    {isCopied ? (
                      <>
                        <Check className="size-4" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Apply to Post
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {aiResult}
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {aiError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{aiError}</p>
              </div>
            )}
            
            {/* Instructions */}
            {!aiResult && !aiError && !isGenerating && (
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  💡 Tip: After generating, click "Apply to Post" to use the AI-generated content and attached files in your post. You can edit it as needed.
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
