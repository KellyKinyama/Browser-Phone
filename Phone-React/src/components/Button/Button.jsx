import styles from './Button.module.scss';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  type = 'button',
  className,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        block && styles.block,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
