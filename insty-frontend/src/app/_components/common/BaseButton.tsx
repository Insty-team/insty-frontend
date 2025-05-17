"use client";

// FIXME: 피그마에 버튼 둥글기가 다른 종류가 있어서 추후 확인 필요함
type BaseButtonProps = {
	title: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	onClick?: () => void;
};

function BaseButton({
	title,
	onClick,
	type = "button",
	disabled = false,
}: BaseButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className="w-full py-3 rounded-xl bg-primary-blue-400 hover:bg-primary-blue-500 cursor-pointer text-white font-semibold"
		>
			{title}
		</button>
	);
}

export default BaseButton;
