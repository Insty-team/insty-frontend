"use client";

import { DropdownMenu } from "radix-ui";
import { ReactNode } from "react";

type DropdownItem = {
	label: string;
	onClick?: () => void;
	danger?: boolean;
};

type BaseDropdownProps = {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	trigger: ReactNode;
	items: DropdownItem[];
};

function BaseDropdown({
	isOpen,
	setIsOpen,
	trigger,
	items,
}: BaseDropdownProps) {
	return (
		<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

			<DropdownMenu.Content
				sideOffset={8}
				className="z-50 min-w-[160px] rounded-[8px] border bg-white"
				style={{ boxShadow: "0px 0px 10px 0px rgba(31, 31, 31, 0.15)" }}
			>
				{items.map(({ label, onClick, danger }, idx) => (
					<DropdownMenu.Item
						key={idx}
						onSelect={(e) => {
							e.preventDefault();
							onClick?.();
						}}
						className={`px-2.5 py-2 mx-2.5 my-2 text-sm cursor-pointer rounded-[8px] hover:bg-[#F0F0F0] hover:outline-none ${
							danger ? "text-red-500" : "text-gray-900"
						}`}
					>
						{label}
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

export default BaseDropdown;
