import { TextInputProps } from "@/app/types";

function TextInput<TFieldValues>({
	label,
	name,
	type = "text",
	placeholder = "",
	register,
	validation,
	error,
	checkDuplication,
	success,
	status,
}: TextInputProps<TFieldValues>) {
	return (
		<div className="w-full relative">
			<label className="block text-xl font-medium mb-1 text-black-300">
				{label}
			</label>
			<input
				type={type}
				placeholder={placeholder}
				className={`w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none ${
					error || status === "error"
						? "border !border-secondary-red-300"
						: "border !border-gray-200"
				}`}
				{...register(name, validation)}
			/>
			{checkDuplication && (
				<div className="absolute right-3 top-11 ">{checkDuplication}</div>
			)}
			<div className="min-h-[24px]">
				{error ? (
					<p className="mt-1 ml-2 text-secondary-red-300">{error.message}</p>
				) : (
					success && (
						<p
							className={`mt-1 ml-2 ${
								status === "success"
									? "text-primary-green-300"
									: status === "error"
										? "text-secondary-red-300"
										: ""
							}`}
						>
							{success}
						</p>
					)
				)}
			</div>
		</div>
	);
}

export default TextInput;
