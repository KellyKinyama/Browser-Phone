import Avatar from '../Avatar';
import StatusDot from '../StatusDot';
import styles from './BuddyItem.module.scss';

const cx = (...c) => c.filter(Boolean).join(' ');

/**
 * Buddy data shape (suggested):
 *   { id, name, avatarUrl, status, presenceText, lastMessage, lastTime,
 *     unreadCount, callState: 'idle' | 'active' | 'hold' }
 */
export default function BuddyItem({
  buddy,
  selected = false,
  onSelect,
  onContextMenu,
}) {
  if (!buddy) return null;
  const { name, avatarUrl, status, lastMessage, lastTime, unreadCount = 0, callState } = buddy;

  return (
    <div
      className={cx(
        styles.buddy,
        selected && styles.selected,
        callState === 'active' && styles.activeCall,
        callState === 'hold' && styles.onHold,
      )}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(buddy)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(buddy);
        }
      }}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(buddy, e);
        }
      }}
    >
      <div style={{ position: 'relative' }}>
        <Avatar src={avatarUrl} name={name} size="md" />
        {status && (
          <StatusDot
            status={status}
            size="sm"
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{name}</span>
          {lastTime && <span className={styles.time}>{lastTime}</span>}
        </div>
        <div className={styles.subtitle}>
          <span className={styles.preview}>{lastMessage || ''}</span>
          {unreadCount > 0 && <span className={styles.unread}>{unreadCount}</span>}
        </div>
      </div>
    </div>
  );
}
