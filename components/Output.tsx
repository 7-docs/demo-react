import PreactMarkdown from 'preact-markdown';
import { tw } from 'twind/css';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/languages/prism/typescript?alias=react:preact/compat&deps=preact@10.13.1';
import tsx from 'https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/languages/prism/tsx?alias=react:preact/compat&deps=preact@10.13.1';
import { vscDarkPlus } from 'https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/styles/prism?alias=react:preact/compat&deps=preact@10.13.1';
import { horizontalScrollbar } from '../lib/scrollbar.ts';
import type { ComponentChildren } from 'preact';

type Props = {
  inline?: boolean;
  className?: string;
  children: ComponentChildren;
};

SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('tsx', tsx);

const availableLanguages: Record<string, string> = {
  js: 'ts',
  ts: 'ts',
  javascript: 'ts',
  typescript: 'ts',
  jsx: 'tsx',
  tsx: 'tsx'
};

const getLanguage = (props: Props) => {
  const m = props.className?.match(/language-([A-Za-z]+)/);
  return m && m[1] in availableLanguages ? availableLanguages[m[1]] : 'text';
};

const Code = (props: Props) => {
  if (props.inline) return <code class="inline" {...props} />;

  const language = getLanguage(props);

  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      className={`${tw(horizontalScrollbar)} overflow-x-auto`}>
      {props.children}
    </SyntaxHighlighter>
  );
};

export function Output(props: { text: string }) {
  return (
    <PreactMarkdown
      components={{
        code: Code
      }}>
      {props.text}
    </PreactMarkdown>
  );
}
