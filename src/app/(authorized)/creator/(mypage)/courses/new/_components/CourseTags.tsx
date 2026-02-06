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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddTag = () => {
    if (!inputValue.trim()) {
      setErrorMessage('태그를 입력해주세요.');
      return;
    }
    if (tags.includes(inputValue.trim())) {
      return;
    }
    if (tags.length >= 12) {
      alert('You can add up to 12 tags.');
      return;
    }
    if (inputValue.length > 15) {
      alert('You can enter up to 15 characters.');
      return;
    }

    onTagsChange([...tags, inputValue.trim()]);
    setInputValue('');
    setErrorMessage(null);
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
      <Label className="text-base font-semibold">Tags</Label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value.trim() && errorMessage) {
                setErrorMessage(null);
              }
            }}
            onKeyDown={handleKeyPress}
            placeholder="e.g., React, JavaScript, frontend, web development, beginner"
            maxLength={15}
            className="pl-10"
          />
        </div>
        <Button type="button" variant="outline" size="icon-lg" onClick={handleAddTag}>
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

      <p className="text-muted-foreground text-xs">{tags.length} added • Press Enter to add a tag</p>
    </div>
  );
}
