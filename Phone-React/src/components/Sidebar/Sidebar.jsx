import styles from './Sidebar.module.scss';

/**
 * Sidebar — generic left-rail container. Compose with UserProfile, SearchBar,
 * BuddyList children (or anything else).
 */
export default function Sidebar({ children, className }) {
  return <aside className={`${styles.sidebar} ${className || ''}`}>{children}</aside>;
}
