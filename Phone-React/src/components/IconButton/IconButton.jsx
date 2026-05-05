import styles from './IconButton.module.scss';

const cx = (...c) => c.filter(Boolean).join(' ');

/**
 * IconButton — circular icon-only button.
 *
 * Provide either a Font Awesome class via `icon` (e.g. "fa fa-phone")
 * or pass a custom node as `children`.
 */
export default function IconButton({
  icon,
  children,
  variant,
  size = 'md',
  type = 'button',
  className,
  label,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(styles.iconButton, styles[size], variant && styles[variant], className)}
      aria-label={label || rest.title}
      {...rest}
    >
      {icon ? <i className={icon} aria-hidden="true" /> : children}
    </button>
  );
}
