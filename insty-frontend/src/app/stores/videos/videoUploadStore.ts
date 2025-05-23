import { create } from "zustand";
import { UploadformData } from "@/app/types";

interface VideoUploadState {
	data: UploadformData | null;
	setData: (data: UploadformData) => void;
	reset: () => void;
}

export const useVideoUploadStore = create<VideoUploadState>((set) => ({
	data: null,
	setData: (data) => set({ data }),
	reset: () => set({ data: null }),
}));
