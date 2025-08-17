"use client";

interface PaginationInfo {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	perPage: number;
}

interface PaginationProps {
	pagination: PaginationInfo;
	onPageChange: (page: number) => void;
}

function Pagination({ pagination, onPageChange }: PaginationProps) {
	const { totalPages, currentPage } = pagination;

	const getPageNumbers = () => {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	};

	return (
		<div className="flex justify-center items-center gap-2 mt-4">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={`px-3 py-2 rounded-lg text-lg border ${
					currentPage === 1
						? "text-gray-400 cursor-not-allowed border-gray-200"
						: "text-black hover:bg-gray-100 border-gray-300"
				}`}
			>
				이전
			</button>

			{getPageNumbers().map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-4 py-2 rounded-lg text-lg cursor-pointer ${
						currentPage === page
							? "bg-primary-green-600 text-white"
							: "text-black hover:bg-gray-100"
					}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`px-3 py-2 rounded-lg text-lg border ${
					currentPage === totalPages
						? "text-gray-400 cursor-not-allowed border-gray-200"
						: "text-black hover:bg-gray-100 border-gray-300"
				}`}
			>
				다음
			</button>
		</div>
	);
}

export default Pagination;
