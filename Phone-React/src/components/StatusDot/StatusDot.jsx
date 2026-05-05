import styles from './StatusDot.module.scss';

const cx = (...c) => c.filter(Boolean).join(' ');

const LABELS = {
  online: 'Online',
  busy: 'Busy',
  failed: 'Connection failed',
  offline: 'Offline',
};

export default function StatusDot({ status = 'offline', size = 'md', title, className, ...rest }) {
  return (
    <span
      className={cx(styles.dot, styles[status], styles[size], className)}
      title={title || LABELS[status] || status}
      role="status"
      aria-label={title || LABELS[status] || status}
      {...rest}
    />
  );
}
