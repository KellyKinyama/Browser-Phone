import styles from './Loading.module.scss';

export default function Loading({ label = 'Loading…' }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={`fa fa-circle-o-notch fa-spin ${styles.spinner}`} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
