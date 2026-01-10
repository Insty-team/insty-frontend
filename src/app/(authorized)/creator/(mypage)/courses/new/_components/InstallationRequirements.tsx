'use client';

import { InstallationRequirement } from '../types';

import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Check, Plus, X, XCircle } from 'lucide-react';

interface InstallationRequirementsProps {
  requirements: InstallationRequirement[];
  onRequirementsChange: (requirements: InstallationRequirement[]) => void;
}

export function InstallationRequirements({ requirements, onRequirementsChange }: InstallationRequirementsProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddRequirement = () => {
    if (!inputValue.trim()) return;
    if (requirements.some((req) => req.name === inputValue.trim())) {
      alert('이미 추가된 설치 환경입니다.');
      return;
    }
    if (requirements.length >= 10) {
      alert('최대 10개까지만 추가할 수 있습니다.');
      return;
    }

    const newRequirement: InstallationRequirement = {
      id: Date.now().toString(),
      name: inputValue.trim(),
      isSupported: true,
    };

    onRequirementsChange([...requirements, newRequirement]);
    setInputValue('');
  };

  const handleRemoveRequirement = (id: string) => {
    onRequirementsChange(requirements.filter((req) => req.id !== id));
  };

  const handleToggleSupport = (id: string) => {
    onRequirementsChange(requirements.map((req) => (req.id === id ? { ...req, isSupported: !req.isSupported } : req)));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  return (
    <div className="space-y-3">
      <Label>설치 환경 요구사항</Label>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="예: Node.js, Python, Docker 등"
          maxLength={50}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={handleAddRequirement}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {requirements.length > 0 && (
        <div className="space-y-2">
          {requirements.map((requirement) => (
            <Card key={requirement.id} className="py-3 pr-3 pl-4">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{requirement.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 체크박스 없이, 배지 클릭(또는 Enter/Space)로 지원/미지원 토글 */}
                    <div className="flex items-center">
                      <Checkbox
                        className="sr-only"
                        checked={requirement.isSupported}
                        onCheckedChange={() => handleToggleSupport(requirement.id)}
                        aria-label={`${requirement.name} 지원 여부`}
                      />
                      <Badge
                        variant={requirement.isSupported ? 'default' : 'secondary'}
                        className="flex cursor-pointer items-center gap-1 select-none"
                        role="button"
                        tabIndex={0}
                        aria-pressed={requirement.isSupported}
                        onClick={() => handleToggleSupport(requirement.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggleSupport(requirement.id);
                          }
                        }}
                      >
                        {requirement.isSupported ? (
                          <>
                            <Check className="h-3 w-3" />
                            지원
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            미지원
                          </>
                        )}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-lg"
                      onClick={() => handleRemoveRequirement(requirement.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-muted-foreground text-xs">{requirements.length}개 추가됨 • 배지 클릭으로 지원/미지원 토글</p>
    </div>
  );
}
