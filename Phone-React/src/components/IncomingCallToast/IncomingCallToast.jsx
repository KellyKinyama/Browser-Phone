import { createPortal } from 'react-dom';
import Avatar from '../Avatar';
import IconButton from '../IconButton';
import styles from './IncomingCallToast.module.scss';

/**
 * IncomingCallToast — floating ringing notification.
 *
 * Props:
 *   call: { id, callerName, callerNumber, avatarUrl, hasVideo }
 *   onAnswer(call, type)  — type: 'audio' | 'video'
 *   onReject(call)
 */
export default function IncomingCallToast({ call, onAnswer, onReject }) {
  if (!call) return null;
  const { callerName, callerNumber, avatarUrl, hasVideo } = call;

  const node = (
    <div className={styles.toast} role="alertdialog" aria-label="Incoming call">
      <div className={styles.pulse}>
        <Avatar src={avatarUrl} name={callerName || callerNumber} size="md" />
      </div>
      <div className={styles.info}>
        <div className={styles.label}>Incoming call</div>
        <div className={styles.name}>{callerName || callerNumber || 'Unknown caller'}</div>
        {callerName && callerNumber && (
          <div className={styles.label}>{callerNumber}</div>
        )}
      </div>
      <div className={styles.actions}>
        <IconButton
          icon="fa fa-phone"
          label="Answer"
          variant="success"
          onClick={() => onAnswer?.(call, 'audio')}
        />
        {hasVideo && (
          <IconButton
            icon="fa fa-video-camera"
            label="Answer with video"
            variant="brand"
            onClick={() => onAnswer?.(call, 'video')}
          />
        )}
        <IconButton
          icon="fa fa-times"
          label="Reject"
          variant="danger"
          onClick={() => onReject?.(call)}
        />
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
