import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-body text-[#201b11] ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-[#201b11] pb-2.5 border-b border-[#d3c5ab] mt-3 mb-4 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-[#785a00] mt-7 mb-3 pb-1 border-b border-[#ebdcc8] tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold text-[#201b11] mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-[#4f4632] mt-4 mb-1 uppercase tracking-wider">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm text-[#201b11] leading-relaxed mb-3">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#ffc20e] bg-[#f8ecdb]/70 pl-4 py-2.5 my-4 rounded-r-lg text-xs sm:text-sm text-[#4f4632] italic leading-relaxed shadow-2xs">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-3 space-y-1.5 text-xs sm:text-sm text-[#201b11]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-3 space-y-1.5 text-xs sm:text-sm text-[#201b11]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs sm:text-sm text-[#201b11] leading-relaxed">
              {children}
            </li>
          ),
          pre: ({ children }) => (
            <pre className="bg-[#1e1b18] text-[#f8ecdb] p-3.5 sm:p-4 rounded-xl overflow-x-auto text-xs font-mono my-4 border border-[#433929] shadow-inner leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes('language-') || String(children).includes('\n');
            if (isBlock) {
              return <code>{children}</code>;
            }
            return (
              <code className="bg-[#ebdcc8]/90 text-[#6d5100] px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-mono font-semibold border border-[#d3c5ab]/60 mx-0.5">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-5 rounded-xl border border-[#d3c5ab] bg-[#ffffff] shadow-xs">
              <table className="w-full text-left text-xs border-collapse min-w-[580px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#f8ecdb] text-[#785a00] font-bold border-b border-[#d3c5ab]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#ebdcc8]/80 bg-[#ffffff]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#f8ecdb]/40 transition-colors odd:bg-[#ffffff] even:bg-[#fffdf9]">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-3 font-bold text-xs text-[#785a00] tracking-wide bg-[#f8ecdb]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 text-xs text-[#201b11] align-top leading-relaxed">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[#201b11]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#4f4632]">
              {children}
            </em>
          ),
          del: ({ children }) => (
            <del className="line-through text-[#817660]">
              {children}
            </del>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#785a00] underline font-semibold hover:text-[#ffc20e] transition-colors"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-6 border-t border-[#d3c5ab]" />
          ),
          input: (props) => {
            if (props.type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  disabled
                  checked={props.checked}
                  className="mr-2 rounded text-[#785a00] focus:ring-0 accent-[#785a00] inline-block align-middle cursor-default"
                />
              );
            }
            return <input {...props} />;
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
