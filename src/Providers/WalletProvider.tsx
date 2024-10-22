import React, { createContext, useState, useEffect, useContext } from 'react';
import { TonConnect } from '@tonconnect/sdk';

type WalletInfo = {
  account: {
    address: string;
  };
} | null;



type WalletContextType = {
  wallet: WalletInfo;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [universalLink, setUniversalLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tonConnect, setTonConnect] = useState<TonConnect | null>(null);

  useEffect(() => {
    const connectWallet = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const tonConnectInstance = new TonConnect({
          manifestUrl: 'http://localhost:3000/tonconnect-manifest.json',
        });
        setTonConnect(tonConnectInstance);

        await tonConnectInstance.restoreConnection();
        const walletInfo = tonConnectInstance.wallet;

        if (walletInfo && walletInfo.account) {
          handleStatusChange(walletInfo);
        } else {
          const walletConnectionSource = {
            universalLink: 'https://app.tonkeeper.com/ton-connect',
            bridgeUrl: 'https://bridge.tonapi.io/bridge',
          };

          const link = await tonConnectInstance.connect(walletConnectionSource);
          setUniversalLink(link);
          setIsLoading(false);
        }

        tonConnectInstance.onStatusChange(handleStatusChange);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Ошибка подключения кошелька:', errorMessage);
        setError(`Ошибка подключения: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    connectWallet();

    const onFocus = () => {
      connectWallet();
    };

    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleStatusChange = (walletInfo: WalletInfo): void => {
    if (walletInfo && walletInfo.account) {
      setWallet(walletInfo);
      setIsConnected(true);

      const address = walletInfo.account.address;
      fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`)
        .then((response: Response) => response.json())
        .then((data): void => {
          const balanceInTON = (parseInt(data.result, 10) / 1e9).toFixed(2);
          setBalance(`${balanceInTON} TON`);
          setIsLoading(false);
        })
        .catch((error): void => {
          console.error('Ошибка при получении баланса:', error);
          setError('Ошибка при получении баланса');
          setIsLoading(false);
        });
    } else {
      setIsConnected(false);
      setIsLoading(false);
    }
  };

  const connectWallet = (): void => {
    if (universalLink) {
      window.open(universalLink, '_blank');
    }
  };

  const disconnectWallet = (): void => {
    if (tonConnect && isConnected) {
      try {
        tonConnect.disconnect();
        setWallet(null);
        setIsConnected(false);
        setBalance(null);
        setError(null);
        console.log('Кошелек успешно отключен.');
      } catch (error) {
        console.error('Ошибка при отключении кошелька:', error);
      }
    } else {
      console.log('Кошелек не подключен, отключать нечего.');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        balance,
        isConnected,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
