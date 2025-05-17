"use client";

import Image from "next/image";

// FIXME: 피그마에 버튼 둥글기가 다른 종류가 있어서 추후 확인 필요함
type IconButtonProps = {
	icon: string;
	iconWidth?: number;
	iconHeight?: number;
	align: "left" | "right";
	title: string;
	type?: "button" | "submit" | "reset";
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
};

function IconButton({
	icon,
	align = "left",
	iconWidth = 20,
	iconHeight = 20,
	title,
	type = "button",
	className = "",
	disabled = false,
	onClick,
}: IconButtonProps) {
	const isIconLeft = align === "left";

	return isIconLeft ? (
		<>
			<button
				type={type}
				disabled={disabled}
				onClick={onClick}
				className={className}
			>
				<Image src={icon} width={iconWidth} height={iconHeight} alt="button" />
				<span>{title}</span>
			</button>
		</>
	) : (
		<>
			<button
				type={type}
				disabled={disabled}
				onClick={onClick}
				className={className}
			>
				<span>{title}</span>
				<Image src={icon} width={20} height={20} alt="button" />
			</button>
		</>
	);
}

export default IconButton;
