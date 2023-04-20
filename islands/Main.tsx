import { useState, useEffect } from 'preact/hooks';
import { getDelta } from '@7-docs/edge';
import { Output } from '../components/Output.tsx';
import { embeddingModels, completionModels, namespace, suggestions } from '../config.ts';
import type { StateUpdater } from 'preact/hooks';
import type { MetaData } from '@7-docs/edge';

export default function Main() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [metadata, setMetadata] = useState<null | MetaData[]>();
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const toggleSuggestions = () => setSuggestionsVisible(!isSuggestionsVisible);

  const onSubmit = (event: Event) => {
    event.preventDefault();
  };

  const setInput = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement) setInputValue(event.target.innerText);
  };

  const getStateUpdater = (updater: StateUpdater<string>) => (event: Event) => {
    if (event.target instanceof HTMLInputElement) updater(event.target.value);
  };

  useEffect(() => {
    if (inputValue.trim().length < 1) return;

    setOutputText('');
    setMetadata(null);
    setIsLoading(true);

    const searchParams = new URLSearchParams();
    searchParams.set('query', encodeURIComponent(inputValue));
    searchParams.set('embedding_model', embeddingModels[0]);
    searchParams.set('completion_model', completionModels[0]);

    const url = '/api/completion?' + searchParams.toString();

    const source = new EventSource(url);

    const done = () => {
      source.close();
      setIsLoading(false);
    };

    source.addEventListener('message', event => {
      try {
        if (event.data.trim() === '[DONE]') {
          done();
        } else {
          const data = JSON.parse(event.data);
          const text = getDelta(data);
          if (text) setOutputText(outputText => outputText + text);
        }
      } catch (error) {
        console.log(event);
        console.error(error);
        done();
      }
    });

    source.addEventListener('metadata', event => {
      try {
        const data = JSON.parse(event.data);
        setMetadata(data);
      } catch (error) {
        console.log(event);
        console.error(error);
      }
    });

    source.addEventListener('error', error => {
      console.log(error);
      done();
    });

    return () => done();
  }, [inputValue]);

  return (
    <main class="flex flex-col p-2 gap-8 my-8">
      <header class="flex flex-row items-center justify-between">
        <h1 class="text-3xl">{namespace}</h1>
        <a href="https://github.com/7-docs/7-docs" class="text-xs italic hover:underline">
          Powered by 7-docs
        </a>
      </header>

      <form class="flex flex-col gap-4 text-xl sm:flex-row" onSubmit={onSubmit}>
        <input
          type="text"
          name="query"
          placeholder="Ask me something..."
          value={inputValue}
          onChange={getStateUpdater(setInputValue)}
          class="text-darker-gray flex flex-col flex-grow px-2 py-1 border-none"
        />
        <input
          type="submit"
          value="Send"
          class={
            (isLoading ? 'animate-pulse ' : '') +
            `px-2 py-1 border border-gray cursor-pointer bg-dark-gray text-off-white max-w-[120px] self-end hover:bg-darker-gray`
          }
        />
      </form>

      <div class="flex justify-between">
        <button
          type="button"
          class="bg-transparent appearance-none text-xs italic text-left cursor-pointer p-0 hover:underline"
          onClick={toggleSuggestions}>
          Need suggestions?
        </button>
      </div>

      {isSuggestionsVisible ? (
        <ul class="list-disc list-inside" onClick={setInput}>
          {suggestions.map(suggestion => (
            <li>
              <button class="hover:underline">{suggestion}</button>
            </li>
          ))}
        </ul>
      ) : null}

      <Output text={outputText} cursor={isLoading} />

      {metadata && metadata?.length > 0 ? (
        <div
          class={(isLoading ? 'opacity-0 ' : 'opacity-100 ') + 'transition-opacity duration-1000 flex flex-col gap-4'}>
          <p>The locations used to answer the question may contain more information:</p>
          <ul class="list-disc list-inside">
            {metadata.map(metadata => (
              <li>
                <a href={metadata.url} class="hover:underline">
                  {metadata.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </main>
  );
}
