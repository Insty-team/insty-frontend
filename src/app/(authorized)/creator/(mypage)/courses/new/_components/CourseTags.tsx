'use client';

import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Hash, Plus, X } from 'lucide-react';

interface CourseTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function CourseTags({ tags, onTagsChange }: CourseTagsProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (!inputValue.trim() || tags.includes(inputValue.trim())) return;
    if (tags.length >= 12) {
      alert('최대 12개까지만 추가할 수 있습니다.');
      return;
    }
    if (inputValue.length > 15) {
      alert('최대 15자까지 입력할 수 있습니다.');
      return;
    }

    onTagsChange([...tags, inputValue.trim()]);
    setInputValue('');
  };

  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">태그</Label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="예: React, JavaScript, 프론트엔드, 웹개발, 초보자 등"
            maxLength={15}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={handleAddTag}
          disabled={!inputValue.trim() || tags.includes(inputValue.trim())}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`bg-primary-green-100 text-primary-green-800 border-primary-green-300 cursor-pointer rounded-full transition-opacity hover:opacity-80`}
                onClick={() => handleRemoveTag(index)}
              >
                <Hash className="mr-0.5 h-3 w-3" />
                {tag}
                <X className="ml-4 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="text-muted-foreground text-xs">{tags.length}개 추가됨 • Enter 키로 태그를 추가하세요</p>
    </div>
  );
}
