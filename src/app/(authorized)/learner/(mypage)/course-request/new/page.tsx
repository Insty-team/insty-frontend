'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useGetCommunityCourseRequestForm,
  usePostCommunityCourseRequest,
} from '@/shared/services/ai-community/ai-community.hook';
import { GET_community_course_requests } from '@/shared/services/ai-community/ai-community.service';
import { CourseFormField, CourseRequest, CourseRequestAnswer } from '@/shared/services/ai-community/ai-community.type';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// 동적으로 생성될 폼 데이터 타입
type CourseRequestFormData = {
  title: string;
  description: string;
  [key: string]: string | string[]; // field_key를 키로 사용 (other 필드 포함)
};

export default function LearnerCourseRequestNewPage() {
  const router = useRouter();
  const { data: formData, isLoading, error } = useGetCommunityCourseRequestForm();
  const { mutate: submitCourseRequest, isPending } = usePostCommunityCourseRequest();
  const queryClient = useQueryClient();

  // 폼 필드를 order_no 순서로 정렬
  const sortedFields = useMemo(() => {
    if (!formData?.form) return [];
    return [...formData.form].sort((a, b) => a.order_no - b.order_no);
  }, [formData]);

  // 기본값 동적 생성
  const defaultValues = useMemo(() => {
    const values: CourseRequestFormData = {
      title: '',
      description: '',
    };

    sortedFields.forEach((field) => {
      if (field.type === 'radio') {
        values[field.field_key] = '';
        // Other 옵션이 있으면 other 필드도 추가
        if (field.options.some((opt) => opt.label === 'Other' || opt.label === '기타')) {
          values[`${field.field_key}_other`] = '';
        }
      } else if (field.type === 'input_text' || field.type === 'text_area') {
        values[field.field_key] = '';
      }
    });

    return values;
  }, [sortedFields]);

  const form = useForm<CourseRequestFormData>({
    defaultValues,
  });

  // 기본값이 변경되면 폼 리셋
  useEffect(() => {
    if (sortedFields.length > 0) {
      form.reset(defaultValues);
    }
  }, [defaultValues, sortedFields.length, form]);

  const onSubmit = (data: CourseRequestFormData) => {
    if (!formData?.form) return;

    const answers: CourseRequestAnswer[] = [];

    sortedFields.forEach((field: CourseFormField) => {
      const fieldValue = data[field.field_key];

      if (field.type === 'radio') {
        // Radio 타입: 단일 선택
        const selectedOption = field.options.find((opt) => opt.label === fieldValue);
        if (selectedOption) {
          // "Other" 옵션인 경우 텍스트 입력 값 확인
          if (selectedOption.label === 'Other' || selectedOption.label === '기타') {
            const otherValue = data[`${field.field_key}_other`] as string;
            if (otherValue) {
              answers.push({
                field_id: field.id,
                answer_text: otherValue,
                answer_option_ids: null,
              });
            }
          } else {
            answers.push({
              field_id: field.id,
              answer_text: null,
              answer_option_ids: [selectedOption.id],
            });
          }
        }
      } else if (field.type === 'input_text' || field.type === 'text_area') {
        // Input text 또는 Textarea 타입: 텍스트 입력
        const textValue = fieldValue as string;
        if (textValue && textValue.trim()) {
          answers.push({
            field_id: field.id,
            answer_text: textValue,
            answer_option_ids: null,
          });
        }
      }
    });

    const courseRequest: CourseRequest = {
      title: data.title,
      description: data.description,
      answers,
    };

    submitCourseRequest(courseRequest, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_community_course_requests.name] });
        toast.success('Content request submitted successfully!');
        router.push('/learner/course-request');
      },
      onError: (error) => {
        console.error('Failed to submit content request:', error);
        toast.error('Failed to submit content request. Please try again.');
      },
    });
  };

  // 동적으로 필드 렌더링
  const renderField = (field: CourseFormField) => {
    if (field.type === 'radio') {
      const hasOtherOption = field.options.some((opt) => opt.label === 'Other' || opt.label === '기타');
      const fieldValue = form.watch(field.field_key) as string;

      return (
        <div key={field.id}>
          <FormField
            control={form.control}
            name={field.field_key}
            rules={{
              required: field.is_required ? `Please select ${field.label.slice(0, field.label.length - 1)}.` : false,
            }}
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
          {hasOtherOption && (fieldValue === 'Other' || fieldValue === '기타') && (
            <FormField
              control={form.control}
              name={`${field.field_key}_other`}
              rules={{
                required: 'Please enter details for Other',
              }}
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
          rules={{
            required: field.is_required ? `Please enter ${field.label.slice(0, field.label.length - 1)}.` : false,
          }}
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
          rules={{
            required: field.is_required ? `Please enter ${field.label.slice(0, field.label.length - 1)}.` : false,
          }}
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Request Content</h2>
          <p className="text-muted-foreground mt-1">Submit a request for the content you want</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load form data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData?.form || sortedFields.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Request Content</h2>
          <p className="text-muted-foreground mt-1">Submit a request for the content you want</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No form data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Request Content</h2>
        <p className="text-muted-foreground mt-1">Submit a request for the content you want</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Request Form</CardTitle>
          <CardDescription>
            What content would you like to learn? Creators will review your request and produce content for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: 'Please enter a request title.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Request Title <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your content request title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: 'Please enter request details.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Request Details <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your content request in detail" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 동적으로 생성되는 폼 필드들 */}
              {sortedFields.map((field) => renderField(field))}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className='cursor-pointer'>
                  {isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
