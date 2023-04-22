import { useState, useEffect, useRef } from 'preact/hooks';
import { tw } from 'twind/css';
import { verticalScrollbar } from '../lib/scrollbar.ts';
import { useConversation } from '../lib/useConversation.ts';
import { Input } from '../components/Input.tsx';
import { Output } from '../components/Output.tsx';
import { Sources } from '../components/Sources.tsx';
import { InputButton } from '../components/InputButton.tsx';
import { namespace, suggestions } from '../config.ts';
import { useStream } from '../lib/useStream.ts';

export default function Main() {
  const [conversation, dispatch] = useConversation();
  const [startStream, isStreaming, outputStream, metadata] = useStream();
  const [inputValue, setInputValue] = useState('');
  const scrollableElement = useRef<HTMLDivElement>(null);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const onSubmit = (event?: Event) => {
    if (event) event.preventDefault();
    if (inputValue.trim().length > 0) dispatch({ type: 'setInput', value: inputValue });
  };

  const onChange = (event: Event) => event.target instanceof HTMLInputElement && setInputValue(event.target.value);

  const toggleSuggestions = () => setSuggestionsVisible(!isSuggestionsVisible);

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream]);

  useEffect(() => {
    if (scrollableElement.current) {
      scrollableElement.current.scrollTop = scrollableElement.current.scrollHeight;
    }
  }, [conversation.input, outputStream, isSuggestionsVisible]);

  useEffect(() => {
    if (conversation.input.length > 0 && !isStreaming) {
      startStream(conversation.input, conversation);
      setInputValue('');
    }
  }, [conversation.input]);

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
          {conversation?.history.map((interaction, index, conversation) => (
            <>
              <Input>{interaction.input}</Input>
              <Output text={interaction.output} />
              {index === conversation.length - 1 ? <Sources metadata={interaction.metadata} /> : null}
            </>
          ))}

          {conversation.input ? <Input>{conversation.input}</Input> : null}

          <Output text={outputStream} />
        </div>

        <form
          class="flex flex-col gap-4 text-xl bg-dark-gray p-4 pt-6 border-gray border-t-1 sm:border sm:border-b-0"
          onSubmit={onSubmit}>
          {isSuggestionsVisible ? (
            <ul
              class="list-disc list-inside mb-2"
              onClick={event => {
                dispatch({ type: 'setInput', value: (event.target as HTMLElement).innerText });
                toggleSuggestions();
              }}>
              {suggestions.map(suggestion => (
                <li>
                  <button class="italic text-sm py-1 hover:underline">{suggestion}</button>
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
