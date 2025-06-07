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
					error ? "border-2 !border-secondary-red-300" : ""
				}`}
				{...register(name, validation)}
			/>
			{checkDuplication && (
				<div className="absolute right-3 top-10.5">{checkDuplication}</div>
			)}
			{error && (
				<p className="mt-1 ml-2 text-secondary-red-300">{error.message}</p>
			)}
		</div>
	);
}

export default TextInput;
