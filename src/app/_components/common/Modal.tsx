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
}: ModalProps) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200/70">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-[60%]">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-semibold">{title}</h2>
				</div>
				<div>{children}</div>
				<div className="flex gap-4 mt-8">
					<BaseButton title={onCloseTitle} fill={false} onClick={onClose} />
					<BaseButton
						title={actionsTitle}
						onClick={actions}
						disabled={disabled}
					/>
				</div>
			</div>
		</div>
	);
}

export default Modal;
