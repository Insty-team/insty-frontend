"use client";

import { DropdownMenu } from "radix-ui";
import { ReactNode } from "react";

type DropdownItem = {
  label: string;
  onClick?: () => void;
  danger?: boolean;
};

type BaseDropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
};

function BaseDropdown({ trigger, items }: BaseDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={8}
        className="z-50 min-w-[160px] rounded-md border bg-white shadow-md p-1"
      >
        {items.map(({ label, onClick, danger }, idx) => (
          <DropdownMenu.Item
            key={idx}
            onSelect={(e) => {
              e.preventDefault();
              onClick?.();
            }}
            className={`px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100 ${
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