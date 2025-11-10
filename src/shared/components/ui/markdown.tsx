import ReactMarkdown from 'react-markdown';

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {children}
          </a>
        ),
      }}
    >
      {children.replaceAll(/<br\s*\/?>/g, '\n')}
    </ReactMarkdown>
  );
}

export { Markdown };
