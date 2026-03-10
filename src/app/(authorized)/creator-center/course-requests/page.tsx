'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useGetCommunityCreatorRecommendationForm,
  useGetCommunityCreatorRecommendationFormLast,
  usePostCommunityCourseRequestRecommendationWithBase,
  usePostCommunityCourseRequestRecommendationWithoutBase,
} from '@/shared/services/ai-community/ai-community.hook';
import {
  GET_community_course_request_availability,
  GET_community_course_request_final_result,
  PATCH_community_course_request_recommendation_status,
} from '@/shared/services/ai-community/ai-community.service';
import {
  CourseRequestAnswer,
  CourseRequestRecommendationItem,
  CourseRequestStatusUpdateRequest,
  CreatorRecommendationFormField,
} from '@/shared/services/ai-community/ai-community.type';
import { useGetCoursesMy } from '@/shared/services/course/course.hook';
import { CheckCircle2, FileText, Loader2, Sparkles, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type FormData = {
  [key: string]: string | string[];
};

// ────────────────────────────────────────────
// Recommendation list (shared by both paths)
// ────────────────────────────────────────────
function RecommendationList({ recommendations }: { recommendations: CourseRequestRecommendationItem[] }) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<number, 'ACCEPTED' | 'DECLINED'>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [acceptModalItem, setAcceptModalItem] = useState<CourseRequestRecommendationItem | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [availabilityAlert, setAvailabilityAlert] = useState<string | null>(null);

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ requestId, data }: { requestId: number; data: CourseRequestStatusUpdateRequest }) =>
      PATCH_community_course_request_recommendation_status(requestId, data),
  });

  const {
    mutate: fetchFinalResult,
    data: finalResultResponse,
    isPending: isLoadingFinalResult,
    reset: resetFinalResult,
  } = useMutation({
    mutationFn: (requestId: number) => GET_community_course_request_final_result(requestId),
  });

  const finalResult = finalResultResponse?.data;

  const { mutate: checkAvailability, isPending: isCheckingAvailability } = useMutation({
    mutationFn: (requestId: number) => GET_community_course_request_availability(requestId),
  });

  useEffect(() => {
    setCheckedItems({});
    setAvailabilityAlert(null);
    resetFinalResult();
    if (acceptModalItem) {
      fetchFinalResult(acceptModalItem.request_id);
    }
  }, [acceptModalItem, fetchFinalResult, resetFinalResult]);

  const handleDecline = (requestId: number) => {
    setPendingId(requestId);
    updateStatus(
      { requestId, data: { action_status: 'DECLINED' } },
      {
        onSuccess: () => {
          setStatuses((prev) => ({ ...prev, [requestId]: 'DECLINED' }));
          toast.success('Request declined.');
        },
        onError: () => toast.error('Failed to update status. Please try again.'),
        onSettled: () => setPendingId(null),
      },
    );
  };

  const handleAccept = (_requestId: number, item: CourseRequestRecommendationItem) => {
    setAcceptModalItem(item);
  };

  // Extract checklist items from results[].task === 'checklist'
  const checklistItems: string[] = useMemo(() => {
    if (!finalResult) return [];
    const results = (finalResult as Record<string, unknown>)?.results;
    if (!Array.isArray(results)) return [];
    return (results as Array<Record<string, unknown>>)
      .filter((r) => r.task === 'checklist')
      .map((r) => {
        const output = r.output as Record<string, unknown> | undefined;
        return String(output?.item ?? JSON.stringify(output));
      });
  }, [finalResult]);

  const allChecked = checklistItems.length > 0 && checklistItems.every((_, idx) => !!checkedItems[idx]);

  const handleUpload = () => {
    if (!acceptModalItem) return;
    checkAvailability(acceptModalItem.request_id, {
      onSuccess: (res) => {
        const { available, status } = res.data;
        if (status === 'ACCEPTED') {
          setAvailabilityAlert('Someone is already creating this content.');
        } else if (status === 'COMPLETED') {
          setAvailabilityAlert('This content has already been completed by someone.');
        } else if (available) {
          const item = acceptModalItem;
          updateStatus(
            { requestId: item.request_id, data: { action_status: 'ACCEPTED' } },
            {
              onSuccess: () => {
                setStatuses((prev) => ({ ...prev, [item.request_id]: 'ACCEPTED' }));
                setAcceptModalItem(null);
                router.push(`/creator/courses/new?rec=${encodeURIComponent(JSON.stringify(item))}`);
              },
              onError: () => toast.error('Failed to update status. Please try again.'),
            },
          );
        } else {
          setAvailabilityAlert('This content is no longer available for upload.');
        }
      },
      onError: () => toast.error('Failed to check availability. Please try again.'),
    });
  };

  return (
    <>
      <div className="space-y-4">
        {recommendations.map((item) => {
          const status = statuses[item.request_id];
          const isLoading = pendingId === item.request_id;

          return (
            <Card key={item.request_id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {status === 'ACCEPTED' && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Accepted
                        </Badge>
                      )}
                      {status === 'DECLINED' && (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" /> Declined
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{item.description}</p>
                    {item.reason && (
                      <p className="text-muted-foreground border-l-2 pl-3 text-xs italic">{item.reason}</p>
                    )}
                  </div>
                  {!status && (
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" onClick={() => handleAccept(item.request_id, item)} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(item.request_id)}
                        disabled={isLoading}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Accept modal: final result */}
      <Dialog open={!!acceptModalItem} onOpenChange={(open) => { if (!open) setAcceptModalItem(null); }}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{acceptModalItem?.title}</DialogTitle>
            <DialogDescription>{acceptModalItem?.description}</DialogDescription>
          </DialogHeader>

          {isLoadingFinalResult ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : finalResult ? (
            <div className="max-h-[60vh] space-y-3 overflow-y-auto py-2 pr-1">
              {(() => {
                const results = ((finalResult as Record<string, unknown>)?.results as Array<Record<string, unknown>>) ?? [];
                const completedResults = results.filter((r) => r.status === 'COMPLETED');
                let checklistIdx = 0;

                return completedResults.map((r, idx) => {
                  const task = String(r.task);
                  const output = (r.output ?? {}) as Record<string, unknown>;

                  /* ── Checklist ── */
                  if (task === 'checklist') {
                    const ci = checklistIdx++;
                    return (
                      <label
                        key={idx}
                        htmlFor={`chk-${ci}`}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                      >
                        <Checkbox
                          id={`chk-${ci}`}
                          checked={!!checkedItems[ci]}
                          onCheckedChange={(checked) => setCheckedItems((prev) => ({ ...prev, [ci]: !!checked }))}
                          className="mt-0.5 h-5 w-5"
                        />
                        <span className="text-base leading-snug">{String(output.item ?? '')}</span>
                      </label>
                    );
                  }

                  /* ── Summary ── */
                  if (task === 'summary') {
                    return (
                      <div key={idx} className="rounded-lg border p-5 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Summary</p>
                        <p className="text-lg font-semibold">{String(output.summary_title ?? '')}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{String(output.summary_purpose ?? '')}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {output.summary_recommendation_level != null && (
                            <Badge variant="secondary" className="text-sm px-3 py-1">{String(output.summary_recommendation_level)}</Badge>
                          )}
                          {output.estimated_duration_minutes != null && (
                            <Badge variant="outline" className="text-sm px-3 py-1">⏱ {String(output.estimated_duration_minutes)} min</Badge>
                          )}
                        </div>
                      </div>
                    );
                  }

                  /* ── Section Plan ── */
                  if (task === 'section_plan') {
                    return (
                      <div key={idx} className="rounded-lg border p-5 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Section Plan</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="shrink-0 text-sm px-3 py-1">Step {String(output.step_number ?? idx + 1)}</Badge>
                          <p className="font-semibold text-base">{String(output.section_title ?? '')}</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{String(output.section_objective ?? '')}</p>
                        {output.estimated_duration_minutes != null && (
                          <p className="text-sm text-muted-foreground">⏱ {String(output.estimated_duration_minutes)} min</p>
                        )}
                      </div>
                    );
                  }

                  /* ── Script ── */
                  if (task === 'script') {
                    const sections = [
                      { label: 'Intro', key: 'intro' },
                      { label: 'Main', key: 'main' },
                      { label: 'Outro', key: 'outro' },
                      { label: 'Call to Action', key: 'call_to_action' },
                    ].filter(({ key }) => output[key] != null);
                    return (
                      <div key={idx} className="rounded-lg border p-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Script</p>
                        {sections.map(({ label, key }) => (
                          <div key={key} className="space-y-1.5">
                            <p className="text-sm font-semibold">{label}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{String(output[key])}</p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  /* ── References ── */
                  if (task === 'references') {
                    const refs = (output.references as Array<Record<string, unknown>>) ?? [];
                    return (
                      <div key={idx} className="rounded-lg border p-5 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">References</p>
                        {refs.map((ref, i) => (
                          <div key={i} className="space-y-1">
                            <a
                              href={String(ref.url ?? '#')}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              {String(ref.title ?? ref.url)}
                            </a>
                            {ref.description != null && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{String(ref.description)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  /* ── Fallback ── */
                  return (
                    <div key={idx} className="rounded-lg border p-5 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {task.replace(/_/g, ' ')}
                      </p>
                      <div className="space-y-1.5">
                        {Object.entries(output).map(([k, v]) => (
                          <div key={k} className="text-sm">
                            <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}: </span>
                            <span>{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}

              {checklistItems.length > 0 && (
                <p className="text-muted-foreground text-xs px-1">✓ Check all items above to enable upload.</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground py-2 text-sm">No results available.</p>
          )}

          {availabilityAlert && (
            <div className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">{availabilityAlert}</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptModalItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!allChecked || isCheckingAvailability}>
              {isCheckingAvailability && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ────────────────────────────────────────────
// Creator recommendation form (no-uploads path)
// ────────────────────────────────────────────
function CreatorRecommendationForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (answers: CourseRequestAnswer[]) => void;
  isSubmitting: boolean;
}) {
  const { data: formData, isLoading } = useGetCommunityCreatorRecommendationForm();

  const sortedFields = useMemo(() => {
    if (!formData?.form) return [];
    return [...formData.form].sort((a, b) => a.order_no - b.order_no);
  }, [formData]);

  const defaultValues = useMemo(() => {
    const values: FormData = {};
    sortedFields.forEach((field) => {
      if (field.type === 'radio') {
        values[field.field_key] = '';
        if (field.options.some((opt) => opt.label === 'Other' || opt.label === '기타')) {
          values[`${field.field_key}_other`] = '';
        }
      } else if (field.type === 'input_text' || field.type === 'text_area') {
        values[field.field_key] = '';
      }
    });
    return values;
  }, [sortedFields]);

  const form = useForm<FormData>({ defaultValues });

  useEffect(() => {
    if (sortedFields.length > 0) form.reset(defaultValues);
  }, [defaultValues, sortedFields.length, form]);

  const handleSubmit = (data: FormData) => {
    const answers: CourseRequestAnswer[] = [];

    sortedFields.forEach((field: CreatorRecommendationFormField) => {
      const value = data[field.field_key];

      if (field.type === 'radio') {
        const selected = field.options.find((opt) => opt.label === value);
        if (selected) {
          if (selected.label === 'Other' || selected.label === '기타') {
            const other = data[`${field.field_key}_other`] as string;
            if (other) answers.push({ field_id: field.id, answer_text: other, answer_option_ids: null });
          } else {
            answers.push({ field_id: field.id, answer_text: null, answer_option_ids: [selected.id] });
          }
        }
      } else if (field.type === 'input_text' || field.type === 'text_area') {
        const text = value as string;
        if (text?.trim()) answers.push({ field_id: field.id, answer_text: text, answer_option_ids: null });
      }
    });

    onSubmit(answers);
  };

  const renderField = (field: CreatorRecommendationFormField) => {
    if (field.type === 'radio') {
      const hasOther = field.options.some((opt) => opt.label === 'Other' || opt.label === '기타');
      const fieldValue = form.watch(field.field_key) as string;

      return (
        <div key={field.id} className="space-y-2">
          <FormField
            control={form.control}
            name={field.field_key}
            rules={{ required: field.is_required ? `Please select ${field.label}` : false }}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  {field.label}
                  {field.is_required && <span className="text-destructive ml-0.5">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={formField.onChange} value={(formField.value as string) || ''}>
                    <div className="flex flex-col gap-3">
                      {field.options
                        .sort((a, b) => a.order_no - b.order_no)
                        .map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.label} id={`${field.field_key}-${option.id}`} />
                            <label
                              htmlFor={`${field.field_key}-${option.id}`}
                              className="cursor-pointer text-sm leading-none font-normal"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasOther && (fieldValue === 'Other' || fieldValue === '기타') && (
            <FormField
              control={form.control}
              name={`${field.field_key}_other`}
              rules={{ required: 'Please enter details for Other' }}
              render={({ field: otherField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter details for Other"
                      {...otherField}
                      value={(otherField.value as string) || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      );
    }

    if (field.type === 'input_text') {
      return (
        <FormField
          key={field.id}
          control={form.control}
          name={field.field_key}
          rules={{ required: field.is_required ? `Please enter ${field.label}` : false }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.is_required && <span className="text-destructive ml-0.5">*</span>}
              </FormLabel>
              <FormControl>
                <Input placeholder={field.label} {...formField} value={(formField.value as string) || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (field.type === 'text_area') {
      return (
        <FormField
          key={field.id}
          control={form.control}
          name={field.field_key}
          rules={{ required: field.is_required ? `Please enter ${field.label}` : false }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.is_required && <span className="text-destructive ml-0.5">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea placeholder={field.label} rows={4} {...formField} value={(formField.value as string) || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell Us About Your Interests</CardTitle>
        <CardDescription>
          Answer a few questions so we can recommend content requests that match your expertise.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {sortedFields.map((field) => renderField(field))}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────
export default function CreatorCourseRequestsPage() {
  const { data: myCoursesData, isLoading: isLoadingCourses } = useGetCoursesMy({ page: 1, pageSize: 1 });
  const hasUploads = (myCoursesData?.items?.length ?? 0) > 0;

  const [recommendations, setRecommendations] = useState<CourseRequestRecommendationItem[]>([]);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [hasTriggeredFromLast, setHasTriggeredFromLast] = useState(false);

  const { mutate: fetchWithBase, isPending: isLoadingWithBase } =
    usePostCommunityCourseRequestRecommendationWithBase();
  const { mutate: fetchWithoutBase, isPending: isLoadingWithoutBase } =
    usePostCommunityCourseRequestRecommendationWithoutBase();

  const { data: formLastData, isLoading: isLoadingFormLast } = useGetCommunityCreatorRecommendationFormLast();

  // Auto-trigger for creators who already have uploads
  useEffect(() => {
    if (!isLoadingCourses && hasUploads && !hasTriggered) {
      setHasTriggered(true);
      fetchWithBase(undefined, {
        onSuccess: (res) => setRecommendations(res.data.recommendations),
        onError: () => toast.error('Failed to fetch recommendations. Please try again.'),
      });
    }
  }, [isLoadingCourses, hasUploads, hasTriggered, fetchWithBase]);

  // Auto-trigger for creators without uploads who have saved form history
  useEffect(() => {
    if (
      !isLoadingCourses &&
      !hasUploads &&
      !isLoadingFormLast &&
      formLastData?.exists &&
      formLastData.form &&
      !hasTriggeredFromLast &&
      recommendations.length === 0
    ) {
      setHasTriggeredFromLast(true);
      fetchWithoutBase(
        { answers: formLastData.form.answers as CourseRequestAnswer[] },
        {
          onSuccess: (res) => setRecommendations(res.data.recommendations),
          onError: () => toast.error('Failed to fetch recommendations. Please try again.'),
        },
      );
    }
  }, [isLoadingCourses, hasUploads, isLoadingFormLast, formLastData, hasTriggeredFromLast, fetchWithoutBase, recommendations.length]);

  const handleFormSubmit = (answers: CourseRequestAnswer[]) => {
    fetchWithoutBase(
      { answers },
      {
        onSuccess: (res) => setRecommendations(res.data.recommendations),
        onError: () => toast.error('Failed to fetch recommendations. Please try again.'),
      },
    );
  };

  // Loading: checking upload status or (for no-uploads path) checking form history
  if (isLoadingCourses || (!hasUploads && isLoadingFormLast)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Request Recommendations</h2>
        <p className="text-muted-foreground mt-1">
          Discover content requests from learners that match your expertise.
        </p>
      </div>

      {/* ── Has uploads: auto-fetch with-base */}
      {hasUploads && (
        <>
          {isLoadingWithBase && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Finding recommendations based on your content...</p>
            </div>
          )}
          {!isLoadingWithBase && recommendations.length === 0 && hasTriggered && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">No matching content requests found.</p>
              </CardContent>
            </Card>
          )}
          {recommendations.length > 0 && <RecommendationList recommendations={recommendations} />}
        </>
      )}

      {/* ── No uploads: form/last check → form → results */}
      {!hasUploads && (
        <>
          {isLoadingWithoutBase || (formLastData?.exists && !hasTriggeredFromLast) ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Finding recommendations...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <Card className="bg-muted/40">
                <CardContent className="py-4">
                  <p className="text-muted-foreground text-sm">
                    Recommendations based on your answers. Accept the ones you'd like to create content for.
                  </p>
                </CardContent>
              </Card>
              <RecommendationList recommendations={recommendations} />
            </>
          ) : (
            <CreatorRecommendationForm onSubmit={handleFormSubmit} isSubmitting={isLoadingWithoutBase} />
          )}
        </>
      )}
    </div>
  );
}
