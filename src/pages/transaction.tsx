import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/router';
import { useWallet } from '@/Providers/WalletProvider';

const Transactions = () => {
  const { wallet, balance, isConnected, isLoading } = useWallet();
  const router = useRouter();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect((): void => {
    if (!isConnected && wallet === null) {
      const timer = setTimeout((): void => {
        router.push('/wallet');
      }, 500);

      return (): void => clearTimeout(timer);
    }
  }, [isConnected, wallet, router]);

  const handleTransaction = async (): Promise<void> => {
    setTransactionError(null);
    setSuccessMessage(null);

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setTransactionError('Введите корректное количество TON');
      return;
    }

    if (!recipient || recipient.length !== 48) {
      setTransactionError('Введите корректный адрес кошелька');
      return;
    }

    try {
      alert(`Тестовая транзакция была успешно отправлена! Реальной транзакции не было.
Количество: ${amount} TON
Адрес получателя: ${recipient}`);

      setSuccessMessage('Транзакция была успешно обработана!');
    } catch (error) {
      console.error('Ошибка обработки транзакции:', error);
      setTransactionError('Ошибка обработки транзакции');
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className='transactions'>
      <header className='transactions__header'>
        <button
          className='transactions__button transactions__button_back'
          onClick={handleBackClick}
        >
          Назад
        </button>
        <h1>Отправить транзакцию</h1>
        {balance ? (
          <div className='balance'>Баланс: {balance}</div>
        ) : (
          <div className='balance'>Баланс не доступен</div>
        )}
      </header>
      <div className='transactions__body'>
        <div className='transactions__block'>
          <label>Количество TON:</label>
          <input
            className='transactions__input'
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className='transactions__block'>
          <label>Адрес получателя:</label>
          <input
            className='transactions__input'
            type='text'
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <button
          className='transactions__button'
          onClick={handleTransaction}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : 'Отправить'}
        </button>
        {transactionError && <p className='error'>{transactionError}</p>}
        {successMessage && <p className='success'>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Transactions;
