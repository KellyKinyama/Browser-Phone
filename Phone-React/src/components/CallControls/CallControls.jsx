import IconButton from '../IconButton';
import styles from './CallControls.module.scss';

const cx = (...c) => c.filter(Boolean).join(' ');

/**
 * CallControls — in-call action bar.
 *
 * Toggle props (boolean) reflect current state and visually highlight when on.
 * Action props are callbacks. Pass null/undefined to hide a button.
 */
export default function CallControls({
  muted = false,
  onMuteToggle,
  onHold,
  held = false,
  onTransfer,
  onConference,
  onKeypad,
  keypadOpen = false,
  onRecord,
  recording = false,
  onVideoToggle,
  videoOn,
  onHangup,
}) {
  return (
    <div className={styles.controls}>
      {onMuteToggle && (
        <IconButton
          icon={muted ? 'fa fa-microphone-slash' : 'fa fa-microphone'}
          label={muted ? 'Unmute' : 'Mute'}
          className={cx(muted && styles.active)}
          onClick={onMuteToggle}
        />
      )}
      {onHold && (
        <IconButton
          icon="fa fa-pause"
          label={held ? 'Resume' : 'Hold'}
          className={cx(held && styles.active)}
          onClick={onHold}
        />
      )}
      {onKeypad && (
        <IconButton
          icon="fa fa-th"
          label="Keypad"
          className={cx(keypadOpen && styles.active)}
          onClick={onKeypad}
        />
      )}
      {onTransfer && (
        <IconButton icon="fa fa-share" label="Transfer" onClick={onTransfer} />
      )}
      {onConference && (
        <IconButton icon="fa fa-users" label="Conference" onClick={onConference} />
      )}
      {onRecord && (
        <IconButton
          icon="fa fa-circle"
          label={recording ? 'Stop recording' : 'Record'}
          className={cx(recording && styles.active)}
          onClick={onRecord}
        />
      )}
      {onVideoToggle && (
        <IconButton
          icon={videoOn ? 'fa fa-video-camera' : 'fa fa-video-camera'}
          label={videoOn ? 'Stop video' : 'Start video'}
          className={cx(videoOn && styles.active)}
          onClick={onVideoToggle}
        />
      )}
      {onHangup && (
        <IconButton
          icon="fa fa-phone"
          label="Hang up"
          variant="danger"
          size="lg"
          onClick={onHangup}
        />
      )}
    </div>
  );
}
