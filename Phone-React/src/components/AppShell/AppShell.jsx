import styles from './AppShell.module.scss';

/**
 * AppShell — top-level two-column layout.
 *
 * Slots:
 *   sidebar  — left rail (320px)  e.g. <Sidebar>...</Sidebar>
 *   header   — optional top bar inside the main column
 *   footer   — optional bottom bar (e.g. <CallControls />)
 *   children — main scrollable content
 */
export default function AppShell({ sidebar, header, footer, children }) {
  return (
    <div className={styles.shell}>
      {sidebar}
      <main className={styles.main}>
        {header}
        <div className={styles.content}>{children}</div>
        {footer}
      </main>
    </div>
  );
}
