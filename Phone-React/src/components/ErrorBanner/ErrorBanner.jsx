import styles from './ErrorBanner.module.scss';

export default function ErrorBanner({ title = 'Something went wrong', message }) {
  return (
    <div className={styles.banner} role="alert">
      <h2 className={styles.title}>{title}</h2>
      {message && <pre className={styles.message}>{message}</pre>}
    </div>
  );
}
