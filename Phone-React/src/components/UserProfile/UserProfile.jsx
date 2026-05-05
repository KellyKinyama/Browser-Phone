import Avatar from '../Avatar';
import StatusDot from '../StatusDot';
import IconButton from '../IconButton';
import styles from './UserProfile.module.scss';

/**
 * UserProfile — header section showing avatar, name, presence and quick actions.
 *
 * Props:
 *   name, status ('online'|'busy'|'offline'|'failed'), presenceText, avatarUrl
 *   voicemailCount, onVoicemailClick
 *   onDial, onAddContact, onSettings
 */
export default function UserProfile({
  name = '',
  status = 'offline',
  presenceText,
  avatarUrl,
  voicemailCount = 0,
  onVoicemailClick,
  onDial,
  onAddContact,
  onSettings,
}) {
  return (
    <div className={styles.profile}>
      <Avatar src={avatarUrl} name={name} size="md" />

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <StatusDot status={status} size="sm" />
          <span className={styles.name}>{name || 'Unknown'}</span>
        </div>
        {presenceText && <div className={styles.presence}>{presenceText}</div>}
      </div>

      <div className={styles.actions}>
        {voicemailCount > 0 && (
          <div className={styles.voicemailBadge}>
            <IconButton icon="fa fa-envelope" label="Voicemail" onClick={onVoicemailClick} />
            <span className={styles.voicemailCount}>{voicemailCount}</span>
          </div>
        )}
        {onDial && <IconButton icon="fa fa-phone" label="Dial" onClick={onDial} />}
        {onAddContact && (
          <IconButton icon="fa fa-user-plus" label="Add contact" onClick={onAddContact} />
        )}
        {onSettings && <IconButton icon="fa fa-cogs" label="Settings" onClick={onSettings} />}
      </div>
    </div>
  );
}
