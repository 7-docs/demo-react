import { useState, useEffect, useRef } from 'preact/hooks';
import { tw } from 'twind/css';
import { verticalScrollbar } from '../lib/scrollbar.ts';
import { useConversation } from '../lib/useConversation.ts';
import { Input } from '../components/Input.tsx';
import { Output } from '../components/Output.tsx';
import { InputButton } from '../components/InputButton.tsx';
import { namespace, suggestions } from '../config.ts';
import { useStream } from '../lib/useStream.ts';

export default function Main() {
  const [conversation, dispatch] = useConversation();
  const [startStream, isStreaming, outputStream, metadata] = useStream();
  const [inputValue, setInputValue] = useState('');
  const scrollableElement = useRef<HTMLDivElement>(null);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const updateInputValue = (value: string) => !isStreaming && setInputValue(value);

  const onSubmit = (event: Event) => event.preventDefault();

  const onChange = (event: Event) => event.target instanceof HTMLInputElement && updateInputValue(event.target.value);

  const toggleSuggestions = () => setSuggestionsVisible(!isSuggestionsVisible);

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      dispatch({ type: 'setInput', value: inputValue });
      setInputValue('');
      startStream(inputValue, conversation);
    }
  }, [inputValue, setInputValue]);

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream]);

  useEffect(() => {
    if (scrollableElement.current) {
      scrollableElement.current.scrollTop = scrollableElement.current.scrollHeight;
    }
  }, [inputValue, outputStream, isSuggestionsVisible]);

  return (
    <main class="h-screen">
      <div class="h-full relative flex flex-col">
        <header class="flex flex-row items-center justify-between py-4">
          <h1 class="text-3xl">{namespace}</h1>
          <a href="https://github.com/7-docs/7-docs" class="text-xs italic hover:underline">
            Powered by 7-docs
          </a>
        </header>

        <div
          class={`${tw(verticalScrollbar)} flex-grow-1 overflow-y-auto flex flex-col gap-2 pb-2`}
          ref={scrollableElement}>
          {conversation?.history.map(interaction => (
            <>
              <Input>{interaction.input}</Input>
              <Output text={interaction.output} />
              {interaction.metadata && interaction.metadata?.length > 0 ? (
                <div>
                  Sources:
                  {interaction.metadata.map(metadata => (
                    <a href={metadata.url} class="inline mx-1 hover:underline">
                      {metadata.title}
                    </a>
                  ))}
                </div>
              ) : null}
            </>
          ))}

          {conversation.input ? <Input>{conversation.input}</Input> : null}

          <Output text={outputStream} />
        </div>

        <form class="flex flex-col gap-4 text-xl bg-dark-gray p-4 pt-6" onSubmit={onSubmit}>
          {isSuggestionsVisible ? (
            <ul
              class="list-disc list-inside text-sm mb-2"
              onClick={event => {
                updateInputValue((event.target as HTMLElement).innerText);
                toggleSuggestions();
              }}>
              {suggestions.map(suggestion => (
                <li>
                  <button class="italic py-1 hover:underline">{suggestion}</button>
                </li>
              ))}
            </ul>
          ) : null}

          <input
            type="text"
            name="query"
            placeholder="Ask me something..."
            value={inputValue}
            onChange={onChange}
            class="text-darker-gray flex flex-col flex-grow px-2 py-1 border-none"
          />

          <div class="flex flex-row gap-4 justify-end">
            <button
              type="button"
              class="bg-transparent appearance-none text-xs italic text-left cursor-pointer p-0 hover:underline flex-grow-1"
              onClick={toggleSuggestions}>
              Need suggestions?
            </button>

            <InputButton type="reset" value="Reset" onClick={() => dispatch({ type: 'reset' })} />
            <InputButton type="submit" value="Send" />
          </div>
        </form>
      </div>
    </main>
  );
}
