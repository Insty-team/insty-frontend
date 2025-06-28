"use client";

import { GoXCircleFill } from "react-icons/go";

type BaseTagProps = {
	title: string;
	closable?: boolean;
	onClick?: () => void;
};

function BaseTag({ title, closable = true, onClick }: BaseTagProps) {
	return (
		<div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#E5F9E0] text-color-[#479B5D]">
			<div className="text-lg font-semibold text-[#479B5D]">{title}</div>
			{closable && (
				<button className="cursor-pointer" onClick={onClick}>
					<GoXCircleFill color="#bcbcbc" size={18} />
				</button>
			)}
		</div>
	);
}

export default BaseTag;
