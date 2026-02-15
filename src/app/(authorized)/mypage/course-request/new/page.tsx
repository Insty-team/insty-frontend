'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useGetCommunityCourseRequestForm,
  usePostCommunityCourseRequest,
} from '@/shared/services/ai-community/ai-community.hook';
import { CourseFormField, CourseRequest, CourseRequestAnswer } from '@/shared/services/ai-community/ai-community.type';
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
      if (field.type === 'checkbox') {
        values[field.field_key] = [];
        // Other 옵션이 있으면 other 필드도 추가
        if (field.options.some((opt) => opt.label === 'Other' || opt.label === '기타')) {
          values[`${field.field_key}_other`] = '';
        }
      } else if (field.type === 'radio') {
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
      } else if (field.type === 'checkbox') {
        // Checkbox 타입: 다중 선택
        const selectedValues = (fieldValue as string[]) || [];
        const optionIds: number[] = [];
        let hasOther = false;
        let otherText = '';

        selectedValues.forEach((value: string) => {
          const selectedOption = field.options.find((opt) => opt.label === value);
          if (selectedOption) {
            if (selectedOption.label === 'Other' || selectedOption.label === '기타') {
              hasOther = true;
              const otherValue = data[`${field.field_key}_other`] as string;
              if (otherValue) {
                otherText = otherValue;
              }
            } else {
              optionIds.push(selectedOption.id);
            }
          }
        });

        if (hasOther && otherText) {
          answers.push({
            field_id: field.id,
            answer_text: otherText,
            answer_option_ids: optionIds.length > 0 ? optionIds : null,
          });
        } else if (optionIds.length > 0) {
          answers.push({
            field_id: field.id,
            answer_text: null,
            answer_option_ids: optionIds,
          });
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
        toast.success('강의 요청이 제출되었습니다!');
        router.push('/mypage/course-request');
      },
      onError: (error) => {
        console.error('강의 요청 제출 실패:', error);
        toast.error('강의 요청 제출에 실패했습니다. 다시 시도해주세요.');
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
              required: field.is_required ? `${field.label}을(를) 선택해주세요` : false,
            }}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label}</FormLabel>
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
                required: '기타 내용을 입력해주세요',
              }}
              render={({ field: otherField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="기타 내용을 입력하세요"
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

    if (field.type === 'checkbox') {
      const hasOtherOption = field.options.some((opt) => opt.label === 'Other' || opt.label === '기타');
      const fieldValue = form.watch(field.field_key) as string[];

      return (
        <div key={field.id}>
          <FormField
            control={form.control}
            name={field.field_key}
            rules={{
              required: field.is_required ? `${field.label}을(를) 최소 1개 이상 선택해주세요` : false,
              validate: (value) => {
                if (field.is_required && (!value || (Array.isArray(value) && value.length === 0))) {
                  return `${field.label}을(를) 최소 1개 이상 선택해주세요`;
                }
                return true;
              },
            }}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    {field.options
                      .sort((a, b) => a.order_no - b.order_no)
                      .map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field.field_key}-${option.id}`}
                            checked={(formField.value as string[])?.includes(option.label)}
                            onCheckedChange={(checked) => {
                              const currentValue = (formField.value as string[]) || [];
                              if (checked) {
                                formField.onChange([...currentValue, option.label]);
                              } else {
                                formField.onChange(currentValue.filter((v: string) => v !== option.label));
                              }
                            }}
                          />
                          <label
                            htmlFor={`${field.field_key}-${option.id}`}
                            className="cursor-pointer text-sm leading-none font-normal"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasOtherOption && fieldValue && (fieldValue.includes('Other') || fieldValue.includes('기타')) && (
            <FormField
              control={form.control}
              name={`${field.field_key}_other`}
              rules={{
                required: '기타 내용을 입력해주세요',
              }}
              render={({ field: otherField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="기타 내용을 입력하세요"
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
            required: field.is_required ? `${field.label}을(를) 입력해주세요` : false,
          }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
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
            required: field.is_required ? `${field.label}을(를) 입력해주세요` : false,
          }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
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
          <h2 className="text-2xl font-bold">강의 요청하기</h2>
          <p className="text-muted-foreground mt-1">원하는 강의를 요청하세요</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">폼 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData?.form || sortedFields.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">강의 요청하기</h2>
          <p className="text-muted-foreground mt-1">원하는 강의를 요청하세요</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">폼 데이터가 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">강의 요청하기</h2>
        <p className="text-muted-foreground mt-1">원하는 강의를 요청하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>강의 요청 작성</CardTitle>
          <CardDescription>
            어떤 강의를 듣고 싶으신가요? 여러분의 요청을 크리에이터들이 확인하고 강의를 제작할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: '요청 제목을 입력해주세요' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>요청 제목</FormLabel>
                    <FormControl>
                      <Input placeholder="강의 요청 제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: '요청 상세 내용을 입력해주세요' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>요청 상세 내용</FormLabel>
                    <FormControl>
                      <Textarea placeholder="강의 요청에 대한 상세 내용을 작성해주세요" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 동적으로 생성되는 폼 필드들 */}
              {sortedFields.map((field) => renderField(field))}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? '제출 중...' : '요청 제출'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
