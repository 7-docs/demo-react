import type { FunctionComponent } from 'preact';
import type { JSX } from 'preact';

type Props = JSX.DOMAttributes<HTMLInputElement>;

export const InputButton: FunctionComponent<Props> = props => (
  <input
    class="px-2 py-1 border border-gray cursor-pointer bg-dark-gray text-off-white max-w-[120px] self-end hover:bg-darker-gray"
    {...props}
  />
);
