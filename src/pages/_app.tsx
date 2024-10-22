import '@/styles/globals.scss';
import type { AppProps } from 'next/app';

import { WalletProvider } from '@/Providers/WalletProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
