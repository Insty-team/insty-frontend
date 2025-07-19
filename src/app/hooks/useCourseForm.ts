import { useEffect, useState } from "react";

import { useTags } from "./useTags";

export interface CourseData {
	title?: string;
	description?: string;
	targetAudience?: string;
	price?: number;
	installEnvChecklist?: { content: string; isSupported: boolean }[];
	keyPoints?: string[];
	tags?: string[];
}

export const useCourseForm = (initialData?: CourseData) => {
	const [title, setTitle] = useState(initialData?.title || "");
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [targetAudience, setTargetAudience] = useState(
		initialData?.targetAudience || "",
	);
	const [price, setPrice] = useState(initialData?.price || 0);
	const [installEnvChecklist, setInstallEnvChecklist] = useState<
		{ content: string; isSupported: boolean }[]
	>(
		initialData?.installEnvChecklist?.length
			? initialData.installEnvChecklist
			: [{ content: "", isSupported: true }],
	);
	const [keyPoints, setKeyPoints] = useState<string[]>(
		initialData?.keyPoints?.length ? initialData.keyPoints : [""],
	);

	const {
		tags,
		setTags,
		tagInput,
		setTagInput,
		handleAddTag,
		handleRemoveTag,
		handleTagInputChange,
		handleTagKeyDown,
	} = useTags({ initialTags: initialData?.tags || [] });

	// initialData가 변경될 때마다 상태 업데이트
	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title || "");
			setDescription(initialData.description || "");
			setTargetAudience(initialData.targetAudience || "");
			setPrice(initialData.price || 0);
			setInstallEnvChecklist(
				initialData.installEnvChecklist?.length
					? initialData.installEnvChecklist
					: [{ content: "", isSupported: true }],
			);
			setKeyPoints(
				initialData.keyPoints?.length ? initialData.keyPoints : [""],
			);
			setTags(initialData.tags || []);
		}
	}, [initialData, setTags]);

	const handleAddEnv = () => {
		setInstallEnvChecklist([
			...installEnvChecklist,
			{ content: "", isSupported: true },
		]);
	};

	const handleEnvChange = (
		idx: number,
		field: "content" | "support",
		value: string,
	) => {
		const newChecklist = [...installEnvChecklist];
		if (field === "content") {
			newChecklist[idx] = { ...newChecklist[idx], content: value.trim() };
		} else {
			newChecklist[idx] = {
				...newChecklist[idx],
				isSupported: value === "지원",
			};
		}
		setInstallEnvChecklist(newChecklist);
	};

	const handleRemoveEnv = (idx: number) => {
		setInstallEnvChecklist(installEnvChecklist.filter((_, i) => i !== idx));
	};

	const handleCoreChange = (idx: number, value: string) => {
		const arr = [...keyPoints];
		arr[idx] = value.trim();
		setKeyPoints(arr);
	};

	const handleAddCore = () => {
		setKeyPoints([...keyPoints, ""]);
	};

	const handleRemoveCore = (idx: number) => {
		setKeyPoints(keyPoints.filter((_, i) => i !== idx));
	};

	return {
		title,
		setTitle,
		description,
		setDescription,
		targetAudience,
		setTargetAudience,
		price,
		setPrice,
		installEnvChecklist,
		setInstallEnvChecklist,
		keyPoints,
		setKeyPoints,
		tags,
		setTags,
		tagInput,
		setTagInput,
		handleAddTag,
		handleRemoveTag,
		handleTagInputChange,
		handleTagKeyDown,
		handleAddEnv,
		handleEnvChange,
		handleRemoveEnv,
		handleCoreChange,
		handleAddCore,
		handleRemoveCore,
	};
};
