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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddRequirement = () => {
    if (!inputValue.trim()) {
      setErrorMessage('설치 환경을 입력해주세요.');
      return;
    }
    setErrorMessage(null);
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
    setErrorMessage(null);
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
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.trim() && errorMessage) {
              setErrorMessage(null);
            }
          }}
          onKeyPress={handleKeyPress}
          placeholder="예: Node.js, Python, Docker 등"
          maxLength={50}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon-lg" onClick={handleAddRequirement}>
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
                    <Label>
                      <Checkbox
                        checked={requirement.isSupported}
                        onCheckedChange={() => handleToggleSupport(requirement.id)}
                      />
                      <Badge
                        variant={requirement.isSupported ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
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
                    </Label>
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

      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs">{requirements.length}개 추가됨 • 체크박스로 지원/미지원 여부 선택</p>
        {errorMessage && <p className="text-destructive text-xs">{errorMessage}</p>}
      </div>
    </div>
  );
}
