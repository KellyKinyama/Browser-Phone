import { useEffect, useRef } from 'react';
import Avatar from '../Avatar';
import styles from './MessageList.module.scss';

const cx = (...c) => c.filter(Boolean).join(' ');

/**
 * Message shape (suggested):
 *   { id, text, fromMe, time, senderName, senderAvatar }
 */
export default function MessageList({ messages = [], emptyText = 'No messages yet' }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive.
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  if (messages.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <div ref={containerRef} className={styles.list}>
      {messages.map((m) => (
        <div key={m.id} className={cx(styles.row, m.fromMe && styles.rowMine)}>
          {!m.fromMe && <Avatar src={m.senderAvatar} name={m.senderName} size="sm" />}
          <div>
            <div className={cx(styles.bubble, m.fromMe && styles.bubbleMine)}>
              {m.text}
            </div>
            {m.time && (
              <span className={cx(styles.meta, m.fromMe && styles.metaMine)}>{m.time}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
