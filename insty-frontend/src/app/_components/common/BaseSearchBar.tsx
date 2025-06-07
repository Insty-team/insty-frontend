"use client";

import Image from "next/image";
import { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from "react";

type BaseSearchBarProps = {
	placeholder?: string;
	size?: "md" | "lg";
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
	onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
	className?: string;
	icon?: ReactNode;
};

function BaseSearchBar({
	placeholder,
	size = "md",
	value,
	onChange,
	onKeyDown,
	onFocus,
	onBlur,
	className = "",
}: BaseSearchBarProps) {
	const heightClass = size === "lg" ? "h-[77px]" : "h-[50px]";

	return (
		<div
			className={`flex items-center px-4 rounded-[50px] bg-gray-100 gap-3 w-full ${heightClass} ${className}`}
		>
			<Image
				src="/magnifyingglass.svg"
				alt="magnifyingglass"
				width={20}
				height={20}
			/>
			<input
				type="text"
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				onFocus={onFocus}
				onBlur={onBlur}
				placeholder={placeholder}
				className="w-full bg-transparent outline-none text-sm text-black-100"
			/>
		</div>
	);
}

export default BaseSearchBar;
