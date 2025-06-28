import React from "react";

function Loading({
	width = 40,
	height = 40,
	className,
}: {
	width?: number;
	height?: number;
	className?: string;
}) {
	return (
		<svg
			className={`animate-spin ${className}`}
			width={width}
			height={height}
			viewBox="0 0 40 40"
		>
			<circle
				cx="20"
				cy="20"
				r="16"
				stroke="#e5e7eb"
				strokeWidth="4"
				fill="none"
			/>
			<path
				d="M36 20a16 16 0 0 1-16 16"
				stroke="#16a34a"
				strokeWidth="4"
				fill="none"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export default Loading;
