import { create } from "zustand";

interface QuestionDraftState {
	courseId: number;
	title: string;
	content: string;
	images: File[];
	setDraft: (draft: {
		courseId: number;
		title: string;
		content: string;
		images: File[];
	}) => void;
	clearDraft: () => void;
}

export const useQuestionDraftStore = create<QuestionDraftState>((set) => ({
	courseId: 0,
	title: "",
	content: "",
	images: [],
	setDraft: (draft) =>
		set(() => ({
			courseId: draft.courseId,
			title: draft.title,
			content: draft.content,
			images: draft.images,
		})),
	clearDraft: () =>
		set(() => ({
			courseId: 0,
			title: "",
			content: "",
			images: [],
		})),
}));
