import { useState } from 'react';
import IconButton from '../IconButton';
import styles from './DialPad.module.scss';

const KEYS = [
  { d: '1', l: '' },
  { d: '2', l: 'ABC' },
  { d: '3', l: 'DEF' },
  { d: '4', l: 'GHI' },
  { d: '5', l: 'JKL' },
  { d: '6', l: 'MNO' },
  { d: '7', l: 'PQRS' },
  { d: '8', l: 'TUV' },
  { d: '9', l: 'WXYZ' },
  { d: '*', l: '' },
  { d: '0', l: '+' },
  { d: '#', l: '' },
];

/**
 * DialPad — controlled or uncontrolled dialer.
 *
 * Props:
 *   value, onChange      — controlled mode
 *   onCall(number, type) — type: 'audio' | 'video'
 *   onKey(digit)         — fires on every key press (e.g. for DTMF)
 *   showVideo            — show the video-call button
 */
export default function DialPad({
  value,
  onChange,
  onCall,
  onKey,
  showVideo = true,
  placeholder = 'Enter number',
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState('');
  const number = isControlled ? value : internal;

  const update = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const press = (digit) => {
    update(number + digit);
    onKey?.(digit);
  };

  const backspace = () => update(number.slice(0, -1));

  const call = (type) => {
    if (number) onCall?.(number, type);
  };

  return (
    <div className={styles.dialpad}>
      <input
        type="text"
        className={styles.display}
        value={number}
        onChange={(e) => update(e.target.value.replace(/[^\d*#+]/g, ''))}
        placeholder={placeholder}
        aria-label="Phone number"
        inputMode="tel"
      />

      <div className={styles.grid}>
        {KEYS.map(({ d, l }) => (
          <button
            key={d}
            type="button"
            className={styles.key}
            onClick={() => press(d)}
            aria-label={`Key ${d}`}
          >
            <span className={styles.digit}>{d}</span>
            {l && <span className={styles.letters}>{l}</span>}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <IconButton icon="fa fa-backspace" label="Backspace" onClick={backspace} />
        <IconButton
          icon="fa fa-phone"
          label="Audio call"
          variant="success"
          size="lg"
          onClick={() => call('audio')}
          disabled={!number}
        />
        {showVideo && (
          <IconButton
            icon="fa fa-video-camera"
            label="Video call"
            variant="brand"
            onClick={() => call('video')}
            disabled={!number}
          />
        )}
      </div>
    </div>
  );
}
