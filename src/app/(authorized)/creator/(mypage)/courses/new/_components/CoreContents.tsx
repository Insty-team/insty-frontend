'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { BookOpen, Plus, X } from 'lucide-react';

interface CoreContentsProps {
  contents: string[];
  onContentsChange: (contents: string[]) => void;
}

export function CoreContents({ contents, onContentsChange }: CoreContentsProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddContent = () => {
    if (!inputValue.trim() || contents.includes(inputValue.trim())) return;
    if (contents.length >= 8) {
      alert('최대 8개까지만 추가할 수 있습니다.');
      return;
    }
    if (inputValue.length > 60) {
      alert('최대 60자까지 입력할 수 있습니다.');
      return;
    }

    onContentsChange([...contents, inputValue.trim()]);
    setInputValue('');
  };

  const handleRemoveContent = (index: number) => {
    onContentsChange(contents.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddContent();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">핵심 내용</Label>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="예: React 기초, 컴포넌트 설계, 상태 관리, 라우팅 등"
          maxLength={60}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={handleAddContent}
          disabled={!inputValue.trim() || contents.includes(inputValue.trim())}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {contents.length > 0 && (
        <div className="grid gap-3">
          {contents.map((content, index) => (
            <Card key={index} className="border-l-primary-green-600 rounded-sm border-l-4 py-2">
              <CardContent className="pr-2 pl-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-primary-green-600 h-5 w-5" />
                    <span className="font-medium">{content}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon-lg" onClick={() => handleRemoveContent(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-muted-foreground text-xs">{contents.length}개 추가됨 • Enter 키로 항목을 추가하세요</p>
    </div>
  );
}
