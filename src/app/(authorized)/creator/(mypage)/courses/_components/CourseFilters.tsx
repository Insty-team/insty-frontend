'use client';

import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Filter, Search, X } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'views' | 'comments' | 'title';
export type StatusFilter = 'all' | 'public' | 'private';

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  totalCount: number;
  filteredCount: number;
}

export function CourseFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount,
}: CourseFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'newest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'views', label: '조회수순' },
    { value: 'comments', label: '댓글수순' },
    { value: 'title', label: '제목순' },
  ];

  const statusOptions = [
    { value: 'all', label: '전체', count: totalCount },
    { value: 'public', label: 'Public', count: 0 }, // 실제 데이터에서 계산
    { value: 'private', label: 'Private', count: 0 }, // 실제 데이터에서 계산
  ];

  const clearFilters = () => {
    onSearchChange('');
    onSortChange('newest');
    onStatusFilterChange('all');
  };

  const hasActiveFilters = searchQuery || sortBy !== 'newest' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">강의 목록</h3>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            필터
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                !
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              초기화
            </Button>
          )}
        </div>
      </div>

      {/* 검색바 */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="강의 제목으로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 필터 옵션들 */}
      {showFilters && (
        <div className="bg-background space-y-4 rounded-lg border p-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* 정렬 옵션 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">정렬 기준</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 상태 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">상태</label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 활성 필터 표시 */}
          {hasActiveFilters && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">적용된 필터</label>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      검색: "{searchQuery}"
                      <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange('')} />
                    </Badge>
                  )}
                  {sortBy !== 'newest' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      정렬: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => onSortChange('newest')} />
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      상태: {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => onStatusFilterChange('all')} />
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
