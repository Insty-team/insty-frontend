import ReactMarkdown from "react-markdown";

interface MarkdownProps {
	text: string;
}

function Markdown({ text }: MarkdownProps) {
	return (
		<ReactMarkdown
			components={{
				a: (props: { href?: string; children?: React.ReactNode }) => {
					const href = props.href;

					return (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary-blue-400 no-underline hover:underline cursor-pointer select-none px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-lg"
						>
							{props.children}
						</a>
					);
				},
			}}
		>
			{text.replace(/<br\s*\/?>/g, "\n\n")}
		</ReactMarkdown>
	);
}

export default Markdown;
