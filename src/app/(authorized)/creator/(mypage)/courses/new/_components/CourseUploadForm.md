# CourseUploadForm 로직 흐름 분석

## 개요

`CourseUploadForm`은 강사(Creator)가 새 강의를 업로드하는 **4단계 마법사(Wizard) 폼** 컴포넌트이다.  
영상 업로드 → AI 초안 생성 → 내용 수정 → 미리보기/게시의 순서로 진행된다.

---

## 단계 정의 (UploadStep)

```
'UPLOAD' → 'AI_GENERATING' → 'EDIT' → 'PREVIEW'
```

| 단계 | 설명 | 사용자 행동 |
|------|------|-------------|
| **UPLOAD** | 강의 영상 + 썸네일 업로드 | 파일 선택 후 "Continue" 클릭 |
| **AI_GENERATING** | AI가 영상을 분석해 초안 생성 (로딩) | 대기 |
| **EDIT** | AI 초안을 검토·수정 | 제목/대상/설명/요구사항/핵심내용/태그 편집 |
| **PREVIEW** | 최종 미리보기 후 게시 | "Publish Lecture" 클릭 |

---

## 상태(State) 목록

### 단계 제어
| 상태 | 타입 | 초기값 | 역할 |
|------|------|--------|------|
| `currentStep` | `UploadStep` | `'UPLOAD'` | 현재 단계 관리 |
| `isSubmitting` | `boolean` | `false` | 최종 제출 중 로딩 |

### 파일 관련
| 상태 | 타입 | 초기값 | 역할 |
|------|------|--------|------|
| `videoFile` | `File \| null` | `null` | 업로드할 영상 파일 |
| `thumbnailFile` | `File \| null` | `null` | 사용자가 직접 올린 썸네일 파일 |
| `videoUuid` | `string` | `''` | 서버에서 받은 영상 고유 ID |
| `isVideoReadyToProceed` | `boolean` | `false` | 영상 업로드 + AI 처리 + 썸네일 생성 완료 여부 |

### URL 관련
| 상태 | 타입 | 초기값 | 역할 |
|------|------|--------|------|
| `thumbnailUrl` | `string` | `''` | 서버 생성 썸네일 URL (Base64 or https) |
| `videoUrl` | `string` | `''` | 영상 프리뷰용 objectURL |
| `thumbnailPreviewUrl` | `string` | `''` | 사용자 업로드 썸네일의 objectURL |

### 업로드 진행률
| 상태 | 타입 | 초기값 | 역할 |
|------|------|--------|------|
| `thumbnailProgress` | `UploadProgress` | `{ status: 'IDLE', progress: 0 }` | 썸네일 업로드 진행 상태 |
| `videoProgress` | `UploadProgress` | `{ status: 'IDLE', progress: 0 }` | 영상 업로드 진행 상태 |

### 폼 데이터 (react-hook-form 외부)
| 상태 | 타입 | 초기값 | 역할 |
|------|------|--------|------|
| `installationRequirements` | `InstallationRequirement[]` | `[]` | 설치 환경 요구사항 목록 |
| `coreContents` | `string[]` | `[]` | 핵심 내용 목록 |
| `tags` | `string[]` | `[]` | 태그 목록 |
| `installationRequirementsError` | `string \| null` | `null` | 요구사항 유효성 에러 메시지 |

### react-hook-form 관리 필드
| 필드 | 유효성 검증 |
|------|-------------|
| `title` | 필수, 2~100자 |
| `targetAudience` | 필수, 2~100자 |
| `description` | 필수, 10~500자 |

---

## 핵심 뮤테이션(Mutation)

| 훅 | 용도 | 호출 시점 |
|----|------|-----------|
| `usePostVideoMetadataSuggestion(videoUuid)` | AI에게 영상 메타데이터 초안 요청 | Step 1 → Step 2 전환 시 |
| `usePostCourse()` | 최종 강의 데이터 서버 전송 | Step 4에서 "Publish" 클릭 시 |

---

## 상세 로직 흐름

### Step 1: UPLOAD (영상 업로드)

```
[사용자] 영상 파일 선택
    ↓
videoFile 세팅 → isVideoReadyToProceed = false, videoUuid 초기화
    ↓
FileUpload 컴포넌트가 업로드 + AI 처리 + 썸네일 생성 완료
    ↓
onReadyChange(true) → isVideoReadyToProceed = true
onVideoUuidChange(uuid) → videoUuid 세팅
onThumbnailUrlChange(url) → thumbnailUrl 세팅 (서버 생성 썸네일)
    ↓
[사용자] (선택) 직접 썸네일 업로드 → thumbnailFile 세팅
    ↓
[사용자] "Continue" 클릭 → handleVideoUploadComplete() 실행
```

**`handleVideoUploadComplete` 유효성 검증 순서:**

1. `videoFile` 존재 확인
2. `isVideoReadyToProceed === true` 확인
3. `thumbnailFile` 또는 `thumbnailUrl` 중 하나 존재 확인
4. `videoUuid` 존재 확인

모두 통과하면 → `currentStep = 'AI_GENERATING'`

---

### Step 2: AI_GENERATING (AI 초안 생성)

```
currentStep = 'AI_GENERATING' (로딩 UI 표시)
    ↓
videoMetadataSuggestionMutation.mutateAsync() 호출
    ↓
[성공 시]
  AI 응답 → 폼에 자동 채우기:
    - setValue('title', aiDraft.title)
    - setValue('targetAudience', aiDraft.target)
    - setValue('description', aiDraft.description)
    - setInstallationRequirements(aiDraft.installation_checklist)
    - setCoreContents(aiDraft.core_contents)
    - setTags(aiDraft.tags)
    ↓
[실패 시]
  console.error + alert 표시
    ↓
[finally]
  currentStep = 'EDIT'
```

---

### Step 3: EDIT (내용 수정)

```
AI 초안이 폼에 채워진 상태로 표시
    ↓
[사용자] 다음 항목을 자유롭게 수정:
  - 제목 (title) → react-hook-form register
  - 대상 (targetAudience) → react-hook-form register
  - 설명 (description) → react-hook-form register + 글자 수 카운터
  - 설치 요구사항 → InstallationRequirements 컴포넌트
  - 핵심 내용 → CoreContents 컴포넌트
  - 태그 → CourseTags 컴포넌트
    ↓
[사용자] "Preview" 클릭 → handlePreview()
  - installationRequirements.length === 0 → 에러 메시지 표시, 이동 차단
  - 통과 시 → currentStep = 'PREVIEW'
    ↓
[사용자] "Cancel" 클릭 → /creator/courses로 이동
```

**유효성 검증 (installationRequirements):**

- `useEffect`로 `installationRequirements.length > 0`이 되면 에러 메시지 자동 해제

---

### Step 4: PREVIEW (미리보기 + 게시)

```
CoursePreview 컴포넌트에 현재 폼 데이터 전달
  - thumbnailPreviewUrl || thumbnailUrl → 썸네일 이미지
  - videoUrl → 영상 프리뷰
    ↓
[사용자] "Back to Edit" → currentStep = 'EDIT'
    ↓
[사용자] "Publish Lecture" 클릭 → handleSubmit(onSubmit) 실행
```

**`onSubmit` 실행 흐름:**

```
1. installationRequirements.length === 0 → 에러 + EDIT 단계로 복귀
    ↓
2. isSubmitting = true
    ↓
3. 썸네일 파일 결정:
   - thumbnailFile 있으면 → 그대로 사용
   - thumbnailFile 없고 thumbnailUrl이 data: (Base64) → File로 변환
   - 그 외 (서버 URL) → null
    ↓
4. courseData 객체 구성:
   {
     keyPoints, isShow: true, price: 0,
     installEnvChecklist, targetAudience,
     videoUuid, title, tags, description,
     thumbnail, practiceFile: null
   }
    ↓
5. postCourseMutation.mutateAsync(courseData)
    ↓
6. [성공 시]
   - queryClient.invalidateQueries([GET_courses_my, GET_courses])
   - alert('성공') + router.push('/creator/courses')
    ↓
   [실패 시]
   - console.error + alert('실패')
    ↓
7. [finally] isSubmitting = false
```

---

## 유틸리티 함수

### `base64ToFile(base64String, filename)`

서버에서 생성된 Base64 썸네일(`data:image/...`)을 `File` 객체로 변환한다.

**변환 과정:**
1. `,` 기준으로 split → MIME 타입 추출
2. `atob()`으로 바이너리 디코딩
3. `Uint8Array`에 복사
4. `new File()`로 File 객체 생성

---

## 컴포넌트 의존 관계

```
CourseUploadForm
├── FileUpload (video)    ← 영상 업로드 + AI 처리 + UUID/썸네일 콜백
├── FileUpload (thumbnail) ← 썸네일 업로드 (선택)
├── InstallationRequirements ← 설치 요구사항 CRUD
├── CoreContents            ← 핵심 내용 CRUD
├── CourseTags              ← 태그 CRUD
└── CoursePreview           ← 최종 미리보기
```

---

## 데이터 흐름 요약 다이어그램

```
FileUpload ──(videoUuid, thumbnailUrl, readyState)──→ CourseUploadForm
                                                          │
                                                          ↓
                                              AI Metadata Suggestion API
                                                          │
                                                          ↓
                                                  폼 필드 자동 채우기
                                                          │
                                              사용자 수정 (EDIT 단계)
                                                          │
                                                          ↓
                                                  CoursePreview (확인)
                                                          │
                                                          ↓
                                                  POST /course API
                                                          │
                                                          ↓
                                              캐시 무효화 + 페이지 이동
```

---

## 사용된 외부 라이브러리

| 라이브러리 | 용도 |
|-----------|------|
| `react-hook-form` | 폼 상태 관리 (title, targetAudience, description) |
| `@tanstack/react-query` | 서버 상태 관리 (mutation, cache invalidation) |
| `next/navigation` | 라우팅 (`useRouter`) |
| `lucide-react` | 아이콘 (FileVideo, Sparkles, Edit3, CheckCircle2) |
| `shadcn/ui` | UI 컴포넌트 (Card, Button, Input, Label, Textarea, Spinner) |
