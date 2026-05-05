import { useEffect, useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import styles from './SettingsModal.module.scss';

const FIELDS = [
  { key: 'profileName',  label: 'Display name',     placeholder: 'Jane Doe', section: 'profile' },
  { key: 'SipUsername',  label: 'SIP username',     placeholder: '100',      section: 'sip', required: true },
  { key: 'SipPassword',  label: 'SIP password',     placeholder: '••••••••', section: 'sip', type: 'password', required: true },
  { key: 'SipDomain',    label: 'SIP domain',       placeholder: 'pbx.example.com', section: 'sip', required: true },
  { key: 'wssServer',    label: 'WebSocket server', placeholder: 'pbx.example.com', section: 'transport', required: true },
  { key: 'WebSocketPort',label: 'WebSocket port',   placeholder: '8089',     section: 'transport', type: 'number' },
  { key: 'ServerPath',   label: 'Server path',      placeholder: '/ws',      section: 'transport' },
];

const SECTIONS = [
  { key: 'profile',   title: 'Profile' },
  { key: 'sip',       title: 'SIP account' },
  { key: 'transport', title: 'Transport (WebSocket)' },
];

/**
 * SettingsModal — edit SIP credentials and persist to localStorage.
 *
 * Props:
 *   open, onClose
 *   initialValues — object of saved values
 *   onSave(values) — caller decides what to do (typically save + reload)
 */
export default function SettingsModal({ open, onClose, initialValues = {}, onSave }) {
  const [values, setValues] = useState(initialValues);

  // Reset form whenever the modal opens with new initial values.
  useEffect(() => {
    if (open) setValues(initialValues || {});
  }, [open, initialValues]);

  const update = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  const submit = (e) => {
    e?.preventDefault?.();
    // Coerce numeric fields.
    const cleaned = { ...values };
    if (cleaned.WebSocketPort) cleaned.WebSocketPort = Number(cleaned.WebSocketPort);
    onSave?.(cleaned);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Settings"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Save & reload</Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={submit}>
        <p className={styles.note}>
          Saving will reload the page so the SIP stack picks up new credentials.
          Values are stored in your browser's localStorage.
        </p>

        {SECTIONS.map((section) => (
          <div key={section.key} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            {FIELDS.filter((f) => f.section === section.key).map((f) => (
              <label key={f.key} className={styles.field}>
                <span className={styles.label}>
                  {f.label}{f.required && ' *'}
                </span>
                <input
                  className={styles.input}
                  type={f.type || 'text'}
                  value={values[f.key] ?? ''}
                  onChange={update(f.key)}
                  placeholder={f.placeholder}
                  autoComplete="off"
                  required={f.required}
                />
              </label>
            ))}
          </div>
        ))}
      </form>
    </Modal>
  );
}
