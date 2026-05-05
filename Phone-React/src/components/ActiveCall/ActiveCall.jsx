import Avatar from '../Avatar';
import useCallTimer from '../../lib/useCallTimer';
import styles from './ActiveCall.module.scss';

/**
 * ActiveCall — visual summary of the current call (no controls).
 *
 * Props:
 *   call: { name, number, startedAt, lineNum, avatarUrl }
 *   muted, held — boolean status badges
 */
export default function ActiveCall({ call, muted, held }) {
  const elapsed = useCallTimer(call?.startedAt);
  if (!call) return null;

  return (
    <div className={styles.wrap}>
      <Avatar src={call.avatarUrl} name={call.name || call.number} size="xl" />
      <div className={styles.name}>{call.name || call.number || 'Unknown'}</div>
      {call.name && call.number && call.name !== call.number && (
        <div className={styles.number}>{call.number}</div>
      )}
      <div className={styles.timer}>{elapsed}</div>

      <div className={styles.statusRow}>
        {Number.isFinite(call.lineNum) && <span className={styles.badge}>Line {call.lineNum}</span>}
        {muted && <span className={styles.badge}>Muted</span>}
        {held && <span className={styles.badge}>On hold</span>}
      </div>
    </div>
  );
}
