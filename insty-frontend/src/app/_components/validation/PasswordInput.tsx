import Image from "next/image";
import { useState } from "react";

import { PasswordInputProps } from "@/app/types";

function PasswordInput<TFieldValues>({
	label,
	name,
	placeholder = "비밀번호를 입력해주세요.",
	register,
	validation,
	error,
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
				}`}
				{...register(name, validation)}
			/>
			<button
				type="button"
				className="absolute right-3 top-11 cursor-pointer"
				onClick={onChangeShowPassword}
			>
				<Image
					src={showPassword ? "/unshow.svg" : "/show.svg"}
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

export default PasswordInput;
