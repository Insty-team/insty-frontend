import { useState } from "react";
import Swal from "sweetalert2";

interface UseTagsProps {
	initialTags?: string[];
	maxTags?: number;
	maxTagLength?: number;
}

export const useTags = ({
	initialTags = [],
	maxTags = 6,
	maxTagLength = 10,
}: UseTagsProps = {}) => {
	const [tags, setTags] = useState<string[]>(initialTags);
	const [tagInput, setTagInput] = useState("");

	const handleAddTag = () => {
		const val = tagInput.trim();

		// 빈 값 체크
		if (!val) return;

		// 최대 태그 개수 체크
		if (tags.length >= maxTags) {
			Swal.fire({
				title: "태그 추가 실패",
				text: `태그는 최대 ${maxTags}개까지 추가할 수 있습니다.`,
				icon: "error",
			});
			return;
		}

		// 태그 길이 체크
		if (val.length > maxTagLength) {
			Swal.fire({
				title: "태그 추가 실패",
				text: `태그는 최대 ${maxTagLength}글자까지 입력할 수 있습니다.`,
				icon: "error",
			});
			return;
		}

		// 중복 체크
		if (tags.includes(val)) {
			Swal.fire({
				title: "태그 추가 실패",
				text: "이미 존재하는 태그입니다.",
				icon: "error",
			});
			return;
		}

		setTags([...tags, val]);
		setTagInput("");
	};

	const handleRemoveTag = (idx: number) => {
		setTags(tags.filter((_, i) => i !== idx));
	};

	const handleTagInputChange = (value: string) => {
		// 입력 중에도 길이 제한 적용
		if (value.length <= maxTagLength) {
			setTagInput(value);
		}
	};

	const handleTagKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	return {
		tags,
		setTags,
		tagInput,
		setTagInput,
		handleAddTag,
		handleRemoveTag,
		handleTagInputChange,
		handleTagKeyDown,
		maxTags,
		maxTagLength,
	};
};
