import { useState } from "react";

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
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

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
      newChecklist[idx] = { ...newChecklist[idx], content: value };
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
    arr[idx] = value;
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
    handleAddEnv,
    handleEnvChange,
    handleRemoveEnv,
    handleCoreChange,
    handleAddCore,
    handleRemoveCore,
  };
};
