import { useWallet } from '@/Providers/WalletProvider';
import Loader from '@/components/Loader';
import { useRouter } from 'next/router';

const Wallet = () => {
  const {
    wallet,
    balance,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className='wallet'>
      <header className='wallet__header'>
        <button
          className='wallet__button wallet__button_back'
          onClick={handleBackClick}
        >
          Назад
        </button>
        <h1>Привязать кошелек</h1>
        {error && <p className='error'>{error}</p>}
        {!isConnected ? (
          <button
            className='wallet__button'
            onClick={connectWallet}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : 'Подключить кошелёк'}
          </button>
        ) : (
          <button className='wallet__button' onClick={disconnectWallet}>
            Отключить кошелек
          </button>
        )}
        {balance && <div className='balance'>Баланс: {balance}</div>}
      </header>
      <div className='wallet__body'>
        {wallet && wallet.account ? (
          <p>Адрес кошелька: {wallet.account.address}</p>
        ) : (
          <p>Кошелек не подключен</p>
        )}
      </div>
    </div>
  );
};

export default Wallet;
