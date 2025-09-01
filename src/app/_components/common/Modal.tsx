import BaseButton from "./BaseButton";

interface ModalProps {
	open: boolean;
	title: string;
	children: React.ReactNode;
	onCloseTitle: string;
	onClose: () => void;
	actionsTitle: string;
	actions: () => void;
	disabled?: boolean;
	isActionDisabled?: boolean;
}

function Modal({
	open,
	onClose,
	title,
	children,
	onCloseTitle,
	actionsTitle,
	actions,
	disabled,
	isActionDisabled,
}: ModalProps) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200/70 p-4">
			<div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-4xl max-h-[90vh] flex flex-col">
				<div className="flex justify-between items-center p-6 border-b">
					<h2 className="text-2xl font-semibold">{title}</h2>
				</div>
				<div className="flex-1 overflow-y-auto p-6">{children}</div>
				<div className="flex gap-4 p-6 border-t bg-gray-50">
					<BaseButton title={onCloseTitle} fill={false} onClick={onClose} />
					<BaseButton
						title={actionsTitle}
						onClick={actions}
						disabled={disabled || isActionDisabled}
					/>
				</div>
			</div>
		</div>
	);
}

export default Modal;
