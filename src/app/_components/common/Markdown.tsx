import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
	text: string;
}

function Markdown({ text }: MarkdownProps) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]} // GFM 지원
			rehypePlugins={[rehypeRaw]} // <br/> 태그 적용
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
				h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
				h2: (props) => (
					<h2 className="text-2xl font-semibold my-3" {...props} />
				),
				h3: (props) => <h3 className="text-xl font-medium my-2" {...props} />,
				li: (props) => (
					<li className="list-disc ml-6 text-gray-800" {...props} />
				),
			}}
		>
			{text.replace(/<br\s*\/?>/g, "\n\n")}
		</ReactMarkdown>
	);
}

export default Markdown;
