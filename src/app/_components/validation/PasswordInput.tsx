import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

import { PasswordInputProps } from "@/app/types";

function PasswordInput<TFieldValues>({
	label,
	name,
	placeholder = "비밀번호를 입력해주세요.",
	register,
	validation,
	error,
	disabled,
}: PasswordInputProps<TFieldValues>) {
	const [showPassword, setShowPassword] = useState(false);

	const onChangeShowPassword = () => {
		setShowPassword(!showPassword);
	};
	return (
		<div className="w-full relative">
			<label className="block text-xl font-medium mb-1 text-black-300">
				{label}
			</label>
			<input
				type={showPassword ? "text" : "password"}
				placeholder={placeholder}
				className={`w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none ${
					error ? "border !border-secondary-red-300" : ""
				} ${disabled ? "bg-gray-scale-200 cursor-not-allowed" : ""}`}
				{...register(name, validation)}
				disabled={disabled}
			/>
			<button
				type="button"
				className={`absolute right-3 top-11.5 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
				onClick={onChangeShowPassword}
				disabled={disabled}
			>
				<div className="text-gray-400 flex items-center">
					{showPassword ? (
						<GoEyeClosed className="size-5" />
					) : (
						<GoEye className="size-5" />
					)}
				</div>
			</button>
			<div className="min-h-[24px]">
				{error && (
					<p className="mt-1 ml-2 text-secondary-red-300">{error.message}</p>
				)}
			</div>
		</div>
	);
}

export default PasswordInput;
