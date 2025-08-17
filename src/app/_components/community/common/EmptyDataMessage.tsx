import { IoAlertCircleOutline } from "react-icons/io5";

interface EmptyDataMessageProps {
	message: string;
}

export default function EmptyDataMessage({ message }: EmptyDataMessageProps) {
	return (
		<div className="flex items-center justify-center w-full bg-gray-100/50 rounded-md p-10 gap-2 text-xl">
			<IoAlertCircleOutline size={32} className="text-gray-500" />
			<p className="text-gray-500">{message}</p>
		</div>
	);
}
