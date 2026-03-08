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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddContent = () => {
    if (!inputValue.trim()) {
      setErrorMessage('핵심 내용을 입력해주세요.');
      return;
    }
    if (contents.includes(inputValue.trim())) {
      return;
    }
    if (contents.length >= 8) {
      alert('You can add up to 8 items.');
      return;
    }
    if (inputValue.length > 60) {
      alert('You can enter up to 60 characters.');
      return;
    }

    onContentsChange([...contents, inputValue.trim()]);
    setInputValue('');
    setErrorMessage(null);
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
      <Label className="text-base font-semibold">Key Points</Label>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.trim() && errorMessage) {
              setErrorMessage(null);
            }
          }}
          onKeyDown={handleKeyPress}
          placeholder="e.g., React fundamentals, component design, state management, routing"
          maxLength={60}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={handleAddContent}
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
                    <span className="bg-primary-green-800 rounded-full p-1"></span>
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

      <p className="text-muted-foreground text-xs">
        {contents.length} added • Press Enter to add an item
      </p>
    </div>
  );
}
