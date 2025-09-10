import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Customize heading styles
          h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-medium mb-2">{children}</h3>,
          
          // Customize paragraph styles
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          
          // Customize list styles
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          
          // Customize code styles
          code: ({ children, ...props }) => {
            // Check if it's inline code by looking at the className
            const isInline = !props.className || !props.className.includes('language-');
            
            return isInline ? (
              <code className="bg-black/10 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-black/10 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3">
                {children}
              </code>
            );
          },
          
          // Customize blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-white/20 pl-4 mb-3 italic opacity-80">
              {children}
            </blockquote>
          ),
          
          // Customize table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border-collapse border border-white/20">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/20 px-3 py-2 bg-white/10 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-white/20 px-3 py-2">
              {children}
            </td>
          ),
          
          // Customize link styles
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-300 underline hover:text-blue-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Customize emphasis styles
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          
          // Customize horizontal rule
          hr: () => <hr className="border-white/20 my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};