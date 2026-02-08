'use client';

import { useState } from 'react';

import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CourseMyResponse } from '@/shared/services/course/course.type';
import { Table } from '@tanstack/react-table';
import { Search } from 'lucide-react';

export type SortOption = 'LATEST' | 'VIEW_COUNT';
export type StatusFilter = 'all' | 'public' | 'private';

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  table: Table<CourseMyResponse>;
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
}: CourseFiltersProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'LATEST', label: 'Latest' },
    { value: 'VIEW_COUNT', label: 'Most Viewed' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Contents List</h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Sort Options */}
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

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search by contents title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
