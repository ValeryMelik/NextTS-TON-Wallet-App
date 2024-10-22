import Link from 'next/link';
import Head from 'next/head';
import styles from '@/styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>TON Wallet App</title>
        <meta
          name='description'
          content='Connect your TON wallet and perform transactions'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>TON Wallet</h1>
          <p className={styles.description}>
            Привяжите свой кошелек TonKeeper и выполняйте транзакции в TestNet
            сети.
          </p>
          <div className={styles.grid}>
            <Link href='/wallet' className={styles.card}>
              <h3>Кошелек &rarr;</h3>
              <p>Просмотреть баланс и адрес кошелька.</p>
            </Link>
            <Link href='/transaction' className={styles.card}>
              <h3>Транзакции &rarr;</h3>
              <p>Отправляйте TON другим пользователям.</p>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
