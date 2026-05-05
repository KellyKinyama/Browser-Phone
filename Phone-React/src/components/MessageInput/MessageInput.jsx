import { useEffect, useRef, useState } from 'react';
import IconButton from '../IconButton';
import styles from './MessageInput.module.scss';

/**
 * MessageInput — auto-growing text composer.
 *
 * Props:
 *   onSend(text)        — called with trimmed text when user submits
 *   onAttach            — optional, shows paperclip button
 *   placeholder, disabled
 *   submitOnEnter       — true (default) sends on Enter; Shift+Enter = newline
 */
export default function MessageInput({
  onSend,
  onAttach,
  placeholder = 'Type a message…',
  disabled = false,
  submitOnEnter = true,
}) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  // Auto-grow up to CSS max-height.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setText('');
  };

  const onKeyDown = (e) => {
    if (submitOnEnter && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={styles.composer}>
      {onAttach && (
        <IconButton icon="fa fa-paperclip" label="Attach" onClick={onAttach} disabled={disabled} />
      )}
      <textarea
        ref={ref}
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
      <IconButton
        icon="fa fa-paper-plane"
        label="Send"
        variant="brand"
        onClick={send}
        disabled={disabled || !text.trim()}
      />
    </div>
  );
}
