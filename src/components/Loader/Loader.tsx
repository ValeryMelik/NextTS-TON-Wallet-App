import styles from './Loader.module.scss';

const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.loader__item}></div>
    <div className={styles.loader__item}></div>
    <div className={styles.loader__item}></div>
  </div>
);

export default Loader;
