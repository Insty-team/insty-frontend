"use client";

import { Select } from "radix-ui";
import { GoChevronDown } from "react-icons/go";

type BaseSelectProps = {
	options: string[];
	value?: string;
	onChange: (value: string) => void;
};

function BaseSelect({ options, value, onChange }: BaseSelectProps) {
	return (
		<Select.Root
			value={value}
			onValueChange={onChange}
			defaultValue={options[0]}
		>
			<Select.Trigger className="w-full inline-flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none">
				<Select.Value />
				<GoChevronDown size={20} />
			</Select.Trigger>

			<Select.Content
				position="popper"
				side="bottom"
				className="bg-white border border-gray-200 rounded-md shadow-lg min-w-[var(--radix-select-trigger-width)]"
			>
				<Select.Viewport>
					{options.map((option) => (
						<Select.Item
							key={option}
							value={option}
							className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 data-[state=checked]:bg-green-100 data-[state=checked]:text-green-700"
						>
							<Select.ItemText>{option}</Select.ItemText>
							<Select.ItemIndicator className="absolute right-2">
								{/* <CheckIcon /> */}
							</Select.ItemIndicator>
						</Select.Item>
					))}
				</Select.Viewport>
			</Select.Content>
		</Select.Root>
	);
}

export default BaseSelect;
