"use client";

// FIXME: 피그마에 버튼 둥글기가 다른 종류가 있어서 추후 확인 필요함
type BaseButtonProps = {
	title: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
};

function BaseButton({
	title,
	type = "button",
	disabled = false,
	onClick,
	className,
}: BaseButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`w-full py-3 rounded-xl bg-primary-green-400 hover:bg-primary-green-500 active:bg-primary-green-600 cursor-pointer text-white ${className}`}
		>
			{title}
		</button>
	);
}

export default BaseButton;
