import IconButton from '../IconButton';
import styles from './SearchBar.module.scss';

export default function SearchBar({
  value,
  onChange,
  onFilter,
  placeholder = 'Find someone…',
}) {
  return (
    <div className={styles.search}>
      <div className={styles.field}>
        <i className={`fa fa-search ${styles.icon}`} aria-hidden="true" />
        <input
          type="text"
          className={styles.input}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      {onFilter && (
        <IconButton icon="fa fa-sliders" label="Filter & sort" onClick={onFilter} />
      )}
    </div>
  );
}
