import styles from './Avatar.module.scss';

const cx = (...c) => c.filter(Boolean).join(' ');

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ src, name, size = 'md', className, ...rest }) {
  const style = src ? { backgroundImage: `url('${src}')` } : undefined;
  return (
    <div
      className={cx(styles.avatar, styles[size], className)}
      style={style}
      role="img"
      aria-label={name || 'avatar'}
      {...rest}
    >
      {!src && <span className={styles.initials}>{getInitials(name)}</span>}
    </div>
  );
}
