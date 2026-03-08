'use client';

import { CommunityDetailDialog, CommunityUpdateDialog, QuestionDetailDialog } from './_components';

import { useState } from 'react';

import CommunityPostList from '@/shared/components/community/CommunityPostList';
import QuestionLabel from '@/shared/components/question/QuestionLabel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { getDisplayContent } from '@/shared/lib/tiptap-content';
import {
  useDeleteCourseCommunityPostById,
  useGetMyCourseCommunityPostsInfinite,
} from '@/shared/services/community/community.hook';
import {
  DELETE_course_community_post_like_by_id,
  POST_course_community_post_like_by_id,
} from '@/shared/services/community/community.service';
import { useDeleteCourseQuestion, useGetMyCourseQuestionsInfinite } from '@/shared/services/course/course.hook';
import { GET_my_course_questions } from '@/shared/services/course/course.service';
import { useGetProfile } from '@/shared/services/user/user.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

const chatbotHistory = [
  {
    date: 'November 26, 2025',
    questions: [
      {
        id: 'chat-1',
        courseTitle: 'AI Chatbot Helper',
        time: '13:42',
        text: 'How can I validate CSV data in Next.js before processing when the data is not clean?',
      },
      {
        id: 'chat-2',
        courseTitle: 'AI Chatbot Helper',
        time: '14:10',
        text: 'How do I maintain focus on a file upload input field?',
      },
    ],
  },
  {
    date: 'November 25, 2025',
    questions: [
      {
        id: 'chat-3',
        courseTitle: 'Practical React',
        time: '10:05',
        text: 'What are the criteria for separating client state instead of using useMemo?',
      },
    ],
  },
];

export default function LearnerHistoryPage() {
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile();
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [likeStateByPostKey, setLikeStateByPostKey] = useState<
    Record<string, { likeCount: number; likedByMe: boolean }>
  >({});
  const [selectedQuestion, setSelectedQuestion] = useState<{
    courseId: number;
    questionId: number;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    courseId: number;
    questionId: number;
    title: string;
  } | null>(null);
  const [deletePostTarget, setDeletePostTarget] = useState<{
    courseId: number;
    postId: number;
  } | null>(null);
  const [editingPost, setEditingPost] = useState<{
    courseId: number;
    postId: number;
    content: string;
  } | null>(null);
  const [selectedPost, setSelectedPost] = useState<{
    courseId: number;
    postId: number;
  } | null>(null);

  const {
    data: myCourseQuestions,
    fetchNextPage: fetchNextQuestions,
    hasNextPage: hasNextQuestions,
    isFetchingNextPage: isFetchingNextQuestions,
  } = useGetMyCourseQuestionsInfinite({
    pageSize: 10,
    orderBy: 'createdAt',
    order: 'desc',
    keyword: searchQuery || undefined,
  });

  const {
    data: myCoursePosts,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useGetMyCourseCommunityPostsInfinite(10);
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteCourseQuestion();
  const { mutate: deletePost, isPending: isDeletingPost } = useDeleteCourseCommunityPostById();

  const myCommunityPosts = myCoursePosts?.items ?? [];
  const myCommunityPostsPagination = myCoursePosts?.pagination;

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: ({ courseId, postId }: { courseId: number; postId: number }) =>
      POST_course_community_post_like_by_id(courseId, postId),
    onSuccess: (response, variables) => {
      const likeInfo = (response as any)?.data;
      if (!likeInfo) return;
      const key = `${variables.courseId}:${variables.postId}`;
      setLikeStateByPostKey((prev) => ({
        ...prev,
        [key]: {
          likeCount: likeInfo.likeCount,
          likedByMe: likeInfo.likedByMe,
        },
      }));
    },
  });

  const { mutate: unlikePost, isPending: isUnlikingPost } = useMutation({
    mutationFn: ({ courseId, postId }: { courseId: number; postId: number }) =>
      DELETE_course_community_post_like_by_id(courseId, postId),
    onSuccess: (response, variables) => {
      const likeInfo = (response as any)?.data;
      if (!likeInfo) return;
      const key = `${variables.courseId}:${variables.postId}`;
      setLikeStateByPostKey((prev) => ({
        ...prev,
        [key]: {
          likeCount: likeInfo.likeCount,
          likedByMe: likeInfo.likedByMe,
        },
      }));
    },
  });

  const myCommunityPostsData = myCommunityPosts.map((item) => {
    const key = `${item.courseId}:${item.postId}`;
    const likeOverride = likeStateByPostKey[key];

    return {
      postId: item.postId,
      courseId: item.courseId,
      content: item.content,
      createdAt: item.createdAt,
      user: profile
        ? {
            id: profile.id,
            nickname: profile.nickname,
          }
        : undefined,
      attachments: item.attachments ?? [],
      videoInfo: item.videoInfo ?? null,
      likeCount: likeOverride?.likeCount ?? item.likeCount ?? 0,
      commentCount: item.commentCount ?? 0,
      likedByMe: likeOverride?.likedByMe ?? item.likedByMe ?? false,
    };
  });

  const findMyCommunityPostById = (postId: number) => {
    return myCoursePosts?.items?.find((p) => p.postId === postId);
  };

  const handleMyCommunityPostClick = (postId: number) => {
    const post = findMyCommunityPostById(postId);
    if (!post) return;
    setSelectedPost({ courseId: post.courseId, postId: post.postId });
  };

  const handleMyCommunityPostEdit = (
    post: { postId: number; courseId?: number; content: string },
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (!post.courseId) return;
    setEditingPost({
      courseId: post.courseId,
      postId: post.postId,
      content: post.content,
    });
  };

  const handleMyCommunityPostDelete = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const post = findMyCommunityPostById(postId);
    if (!post) return;
    setDeletePostTarget({ courseId: post.courseId, postId: post.postId });
  };

  const handleMyCommunityPostLike = (postId: number, isLiked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikingPost || isUnlikingPost) return;
    const post = findMyCommunityPostById(postId);
    if (!post) return;

    if (isLiked) {
      unlikePost({ courseId: post.courseId, postId: post.postId });
      return;
    }

    likePost({ courseId: post.courseId, postId: post.postId });
  };

  const handleDeleteQuestion = () => {
    if (!deleteTarget) return;

    deleteQuestion(
      {
        courseId: deleteTarget.courseId,
        questionId: deleteTarget.questionId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [GET_my_course_questions.name] });
          setDeleteTarget(null);
          if (
            selectedQuestion?.courseId === deleteTarget.courseId &&
            selectedQuestion?.questionId === deleteTarget.questionId
          ) {
            setSelectedQuestion(null);
          }

          toast.success('Question deleted.');
        },
        onError: (error: any) => {
          console.error('질문 삭제 실패:', error);
          toast.error('Failed to delete question.');
        },
      },
    );
  };

  const handleDeletePost = () => {
    if (!deletePostTarget) return;

    deletePost(
      {
        courseId: deletePostTarget.courseId,
        postId: deletePostTarget.postId,
      },
      {
        onSuccess: () => {
          setDeletePostTarget(null);
          toast.success('Post deleted successfully.');
        },
        onError: (error: any) => {
          console.error('커뮤니티 글 삭제 실패:', error);
          toast.error('Failed to delete post.');
        },
      },
    );
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">HISTORY</h2>
        <p className="text-muted-foreground mt-1">
          View your questions, community comments, and AI chatbot conversation history organized by course.
        </p>
      </div>

      <Tabs defaultValue="qa" className="space-y-6">
        <TabsList>
          <TabsTrigger value="qa">Q&amp;A</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="qa">
          <div className="space-y-4">
            <Input
              placeholder="Search questions..."
              value={searchQueryInput}
              onChange={(e) => setSearchQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setSearchQuery(searchQueryInput);
                }
              }}
            />
            <ScrollArea className="h-[calc(100vh-20rem)] rounded-lg">
              <div className="space-y-3 pr-4">
                {myCourseQuestions?.items?.map((item) => (
                  <article
                    key={item.questionId}
                    className="bg-background hover:bg-accent/50 cursor-pointer rounded-lg border p-4 transition-colors"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedQuestion({ courseId: item.courseId, questionId: item.questionId })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedQuestion({ courseId: item.courseId, questionId: item.questionId });
                      }
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <QuestionLabel status={item.status} />
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {dayjs(item.createdAt).format('MMM D, YYYY h:mm A')}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-foreground line-clamp-2 font-semibold">{item.title}</h3>
                    <p
                      className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: getDisplayContent(item.content) }}
                    />
                  </article>
                ))}

                {/* 더보기 버튼 */}
                {hasNextQuestions && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextQuestions()}
                      disabled={isFetchingNextQuestions}
                      className="w-full"
                    >
                      {isFetchingNextQuestions ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>

            {selectedQuestion && (
              <QuestionDetailDialog
                open={true}
                onOpenChange={(open) => {
                  if (!open) setSelectedQuestion(null);
                }}
                courseId={selectedQuestion.courseId}
                questionId={selectedQuestion.questionId}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="community">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-3 pr-4">
              <CommunityPostList
                posts={myCommunityPostsData}
                currentUserId={profile?.id}
                paging={{
                  hasMore: hasNextPosts,
                  onLoadMore: () => fetchNextPosts(),
                  isLoadingMore: isFetchingNextPosts,
                  currentPage: myCommunityPostsPagination?.currentPage,
                  totalPages: myCommunityPostsPagination?.totalPages,
                }}
                actions={{
                  onPostClick: handleMyCommunityPostClick,
                  onLike: handleMyCommunityPostLike,
                  onEdit: handleMyCommunityPostEdit,
                  onDelete: handleMyCommunityPostDelete,
                }}
              />
            </div>
          </ScrollArea>

          {selectedPost && (
            <CommunityDetailDialog
              courseId={selectedPost.courseId}
              postId={selectedPost.postId}
              open={true}
              onOpenChange={(open) => {
                if (!open) setSelectedPost(null);
              }}
            />
          )}
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

      {editingPost && (
        <CommunityUpdateDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingPost(null);
          }}
          courseId={editingPost.courseId}
          postId={editingPost.postId}
          initialContent={editingPost.content}
          onUpdated={() => {
            setEditingPost(null);
          }}
        />
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete
              <span className="text-foreground font-semibold">{deleteTarget?.title}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteQuestion}
              disabled={isDeleting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deletePostTarget)} onOpenChange={(open) => !open && setDeletePostTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete this post?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPost}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeletePost}
              disabled={isDeletingPost}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
