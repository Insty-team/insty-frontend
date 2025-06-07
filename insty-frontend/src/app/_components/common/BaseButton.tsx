"use client";

import { UserType } from "@/app/types";

type BaseButtonProps = {
	title: string;
	buttonType?: "button" | "submit" | "reset";
	disabled?: boolean;
	onClick?: () => void;
	fill?: boolean;
	textSize?: string;
	className?: string;
	userType?: UserType;
	icon?: React.ReactNode;
	alignIcon?: "left" | "right";
};

function BaseButton({
	title,
	buttonType = "button",
	disabled = false,
	onClick,
	fill = true,
	textSize = "text-2xl",
	className,
	userType = "LEARNER",
	icon,
	alignIcon = "right",
}: BaseButtonProps) {
	const bgColorClass = fill
		? userType === "LEARNER"
			? "bg-primary-green-400 hover:bg-primary-green-500 active:bg-primary-green-600 text-white"
			: "bg-primary-purple-400 hover:bg-primary-purple-500 active:bg-primary-purple-600 text-white"
		: userType === "LEARNER"
			? "border border-primary-green-400 text-primary-green-400 hover:bg-primary-green-500 hover:text-white active:bg-primary-green-600 active:text-white"
			: "border border-primary-blur-400 text-primary-blue-400 hover:bg-primary-purple-500 hover:text-white active:bg-primary-purple-600 active:text-white";

	return (
		<button
			type={buttonType}
			onClick={onClick}
			disabled={disabled}
			className={`w-full py-3 rounded-4xl cursor-pointer ${bgColorClass} ${textSize} ${className}`}
		>
			{icon && alignIcon === "left" && icon}
			<span>{title}</span>
			{icon && alignIcon === "right" && icon}
		</button>
	);
}

export default BaseButton;
