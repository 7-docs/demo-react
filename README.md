# 7-docs demo

Source of [7-docs-demo-react.deno.dev](https://7-docs-demo-react.deno.dev), built with:

- Deno + Deno Deploy
- [@7-docs/edge](https://www.npmjs.com/package/@7-docs/edge)
- [Aleph.js](https://alephjs.org)

The demo uses the Markdown content of the React documentation, ingested from the
[reactjs/react.dev](https://github.com/reactjs/react.dev/tree/main/src/content) repository to a Supabase vector database
using [7-docs](https://github.com/7-docs/7-docs).

## Function

Here's the handler for an edge function ([full source](./routes/api//completion.ts)):

```ts
import { load } from 'https://deno.land/std@0.183.0/dotenv/mod.ts';
import { Handlers } from 'https://deno.land/x/fresh@1.1.5/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0';
import { getCompletionHandler } from '@7-docs/edge';
import * as supabase from '@7-docs/edge/supabase';
import { namespace, prompt } from '../../config.ts';

const client = createClient(SUPABASE_URL, SUPABASE_API_KEY);
const query: QueryFn = (vector: number[]) => supabase.query({ client, namespace, vector });

export const handler: Handlers = {
  GET: getCompletionHandler({ OPENAI_API_KEY, query, prompt })
};
```

## UI

Here's a simple Preact form to use the function ([full source](./islands/Main.tsx)):

```tsx
import { useState, useEffect } from 'preact/hooks';
import { getDelta } from '@7-docs/edge';

export default function Main() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const onSubmit = (event: Event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('query', encodeURIComponent(input));
    const url = '/api/completion?' + searchParams.toString();

    const source = new EventSource(url);

    source.addEventListener('message', event => {
      try {
        if (event.data.trim() === '[DONE]') {
          source.close();
        } else {
          const data = JSON.parse(event.data);
          const text = getDelta(data);
          if (text) setOutput(outputText => outputText + text);
        }
      } catch (error) {
        console.log(event);
        console.error(error);
        source.close();
      }
    });

    source.addEventListener('error', error => {
      console.log(error);
      source.close();
    });

    return () => source.close();
  }, [input]);

  return (
    <main>
      <form onSubmit={onSubmit}>
        <input type="text" value={input} onChange={event => setInput(event.target.value)} />
        <input type="submit" value="Send" />
      </form>

      <div>{output}</div>
    </main>
  );
}
```
