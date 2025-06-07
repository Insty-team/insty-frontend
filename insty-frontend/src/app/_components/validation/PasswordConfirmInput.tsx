import { PasswordConfirmInputProps } from "@/app/types";
import Image from "next/image";
import { useState } from "react";

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
					error ? "border-2 !border-secondary-red-300" : ""
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
				className="absolute right-3 top-11 cursor-pointer"
				onClick={onChangeConfirmPassword}
			>
				<Image
					src={confirmPassword ? "/unshow.svg" : "/show.svg"}
					alt="비밀번호 표시 토글"
					width={24}
					height={24}
				/>
			</button>
			{error && (
				<p className="mt-1 ml-2 text-secondary-red-300">{error.message}</p>
			)}
		</div>
	);
}
