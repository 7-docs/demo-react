import { Head } from '$fresh/runtime.ts';
import { AppProps } from '$fresh/src/server/types.ts';
import { namespace } from '../config.ts';

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <title>KB: {namespace} (powered by 7-docs)</title>
      </Head>
      <body class="bg-darker-gray text-off-white max-w-prose text-base mx-auto">
        <Component />
      </body>
    </html>
  );
}
