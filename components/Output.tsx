import PreactMarkdown from 'preact-markdown';

const Code = (props: { inline?: boolean }) => {
  if (props.inline) return <code class="inline" {...props} />;
  return <code class="block" {...props} />;
};

export function Output(props: { text: string; cursor: boolean }) {
  return (
    <PreactMarkdown
      components={{
        code: Code
      }}>
      {props.text}
    </PreactMarkdown>
  );
}
