

'use client';

import { useMemo, useState } from 'react';

import RichTextEditor from '@/shared/components/editor/RichTextEditor';
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
import { useGetCourseCommunityPostsInfinite, useDeleteCourseCommunityPostById, usePostCourseCommunityPostById } from '@/shared/services/community/community.hook';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { getDisplayContent } from '@/shared/lib/tiptap-content';
import dayjs from 'dayjs';
import { ArrowLeft, Calendar, MessageCircle, Heart, MoreHorizontal, Sparkles } from 'lucide-react';

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
  author: string;
  userId?: number;
};

export default function CommunityFeed({ courseId, courseName, onBack, onPostClick }: Props) {
  const { data: profile } = useGetProfile();
  const currentUserId = profile?.id;
  const isLearner = profile?.userType === 'LEARNER';
  
  const [postContent, setPostContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  
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

  const posts = useMemo(() => postsData?.items?.map((post) => {
    type ExtendedPost = typeof post & {
      commentCount?: number;
      createdDate?: string;
    };

    const extended = post as ExtendedPost;

    const commentCount = typeof extended.commentCount === 'number' && Number.isFinite(extended.commentCount) ? extended.commentCount : 0;

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
      author: post.user?.nickname ?? 'Unknown Author',
      userId: post.user?.id,
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
            {/* 글 작성 폼 */}
            {isLearner && (
              <div className="p-4">
                <div className="space-y-3">
                  <RichTextEditor
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
                  {postContent.trim() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePolishPost}
                      disabled={isPolishing}
                      className="gap-2"
                    >
                      <Sparkles className="size-4" />
                      {isPolishing ? 'Polishing...' : 'Polish with AI'}
                    </Button>
                  )}
                </div>
              </div>
            )}
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
                        <DropdownMenuItem>수정하기</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          삭제하기
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
                  <h4 className="text-lg font-semibold leading-tight">{post.title}</h4>
                  <div 
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: getDisplayContent(post.content) }}
                  />
                </div>

                {/* 포스트 푸터 */}
                <div className="flex items-center gap-3 mt-6 pt-4">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm">{post.commentCount}</span>
                  </button>
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
    </div>
  );
}
