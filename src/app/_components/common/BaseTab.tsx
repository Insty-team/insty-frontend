"use client";
import { usePathname, useRouter } from "next/navigation";

export type BaseTabItem = {
	label: string;
	path: string;
};

interface BaseTabProps {
	items: BaseTabItem[];
}

function BaseTab({ items }: BaseTabProps) {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<div className="flex gap-2 mb-10 mt-4">
			{items.map((tab) => {
				const isActive = pathname === tab.path;
				return (
					<button
						key={tab.path}
						onClick={
							tab.label === "수익 확인하기"
								? () => {}
								: () => router.push(tab.path)
						}
						className={`
  						px-6 py-3
              ${tab.label === "수익 확인하기" ? "cursor-not-allowed text-gray-scale-300" : "cursor-pointer"}
              outline-none transition-colors duration-200
              ${
								tab.label === "수익 확인하기"
									? ""
									: isActive
										? "text-primary-green-600 font-bold border-b !border-primary-green-600"
										: "border-transparent hover:text-primary-green-400"
							}
            `}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}

export default BaseTab;
