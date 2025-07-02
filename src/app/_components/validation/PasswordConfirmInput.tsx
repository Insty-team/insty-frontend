import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

import { PasswordConfirmInputProps } from "@/app/types";

export default function PasswordConfirmInput<TFieldValues>({
	label,
	name,
	confirmPasswordName,
	register,
	validation,
	error,
	placeholder = "비밀번호를 입력해주세요.",
}: PasswordConfirmInputProps<TFieldValues>) {
	const [confirmPassword, setConfirmPassword] = useState(false);

	const onChangeConfirmPassword = () => {
		setConfirmPassword(!confirmPassword);
	};

	return (
		<div className="w-full relative">
			<label className="block text-xl font-medium mb-1 text-black-300">
				{label}
			</label>
			<input
				type={confirmPassword ? "text" : "password"}
				placeholder={placeholder}
				className={`w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none ${
					error ? "border !border-secondary-red-300" : ""
				}`}
				{...register(name, {
					...validation,
					validate: (value: string) => {
						if (value !== confirmPasswordName) {
							return "비밀번호가 일치하지 않습니다.";
						}
					},
				})}
			/>
			<button
				type="button"
				className="absolute right-3 top-11.5 cursor-pointer"
				onClick={onChangeConfirmPassword}
			>
				<div className="text-gray-400 flex items-center">
					{confirmPassword ? (
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
