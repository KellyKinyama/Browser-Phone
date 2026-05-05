import { useCallback, useMemo, useState } from 'react';
import useLegacyPhone from '../../lib/useLegacyPhone';
import {
  dial, endCall, hold, unhold, mute, unmute,
  answerAudio, answerVideo, rejectCall,
} from '../../lib/sipClient';
import { saveSettings, hasRequiredCredentials } from '../../lib/phoneSettings';

import AppShell from '../AppShell';
import Sidebar from '../Sidebar';
import UserProfile from '../UserProfile';
import SearchBar from '../SearchBar';
import BuddyList from '../BuddyList';
import DialPad from '../DialPad';
import CallControls from '../CallControls';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import IncomingCallToast from '../IncomingCallToast';
import ThemeToggle from '../ThemeToggle';
import Loading from '../Loading';
import ErrorBanner from '../ErrorBanner';
import SettingsModal from '../SettingsModal';
import Button from '../Button';

import styles from './NativePhone.module.scss';

const ACTIVE_LINE = 0; // simple single-line model for now

/**
 * NativePhone — React-native UI on top of the legacy phone.js SIP stack.
 *
 * - Loads phone.js underneath (hidden) so SIP / IndexedDB still work.
 * - Listens to phone.js web hooks to update React state.
 * - Calls into ../lib/sipClient for actions.
 */
export default function NativePhone({ phoneOptions = {} }) {
  const [registered, setRegistered] = useState(false);
  const [incoming, setIncoming]     = useState(null);
  const [activeCall, setActiveCall] = useState(null); // { number, name, lineNum }
  const [muted, setMuted]           = useState(false);
  const [held, setHeld]             = useState(false);
  const [search, setSearch]         = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [regError, setRegError]   = useState(null);

  const credsOk = hasRequiredCredentials(phoneOptions);

  // Web hooks → React state. Memoized so the hook only sees them once.
  const webHooks = useMemo(() => ({
    web_hook_on_register: () => {
      setRegistered(true);
      setRegError(null);
    },
    web_hook_on_unregistered:       () => setRegistered(false),
    web_hook_on_registrationFailed: (response) => {
      setRegistered(false);
      const reason =
        response?.message?.reasonPhrase ||
        response?.reasonPhrase ||
        response?.cause ||
        response?.message ||
        'Registration failed';
      const code = response?.message?.statusCode || response?.statusCode || '';
      setRegError(code ? `${code} ${reason}` : String(reason));
      console.warn('[NativePhone] registration failed:', response);
    },
    web_hook_on_transportError: (transport) => {
      setRegistered(false);
      setRegError('Transport error — check WebSocket server / port / path and that wss:// is reachable.');
      console.warn('[NativePhone] transport error:', transport);
    },

    web_hook_on_invite: (session) => {
      try {
        const remote = session?.remoteIdentity;
        const number = remote?.uri?.user || 'Unknown';
        const name   = remote?.displayName || number;
        const hasVideo = !!session?.request?.body?.includes?.('m=video');
        setIncoming({ id: session?.id || Date.now(), lineNum: ACTIVE_LINE, callerName: name, callerNumber: number, hasVideo });
      } catch {
        setIncoming({ id: Date.now(), lineNum: ACTIVE_LINE, callerName: 'Incoming', callerNumber: '', hasVideo: false });
      }
    },

    web_hook_on_terminate: () => {
      setIncoming(null);
      setActiveCall(null);
      setMuted(false);
      setHeld(false);
    },

    web_hook_on_message: (message) => {
      try {
        const text = message?.request?.body || '';
        const from = message?.request?.from?.uri?.user || 'unknown';
        if (text) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), text, fromMe: false, senderName: from, time: new Date().toLocaleTimeString() },
          ]);
        }
      } catch (err) {
        console.warn('[NativePhone] failed to parse incoming message', err);
      }
    },
  }), []);

  const { status, error } = useLegacyPhone({ phoneOptions, webHooks, enabled: credsOk });

  // ---- Settings ---------------------------------------------------------
  const openSettings  = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const onSaveSettings = useCallback((values) => {
    saveSettings(values);
    // phone.js reads phoneOptions at boot; reload so it picks them up.
    window.location.reload();
  }, []);

  // ---- Actions ----------------------------------------------------------
  const onDialOut = useCallback((number, type = 'audio') => {
    if (!number) return;
    dial(type, number, number);
    setActiveCall({ number, name: number, lineNum: ACTIVE_LINE });
  }, []);

  const onAnswer = useCallback((call, type = 'audio') => {
    if (type === 'video') answerVideo(call.lineNum);
    else                  answerAudio(call.lineNum);
    setActiveCall({ number: call.callerNumber, name: call.callerName, lineNum: call.lineNum });
    setIncoming(null);
  }, []);

  const onReject = useCallback((call) => {
    rejectCall(call.lineNum);
    setIncoming(null);
  }, []);

  const onHangup = useCallback(() => {
    if (activeCall) endCall(activeCall.lineNum);
    setActiveCall(null);
    setMuted(false);
    setHeld(false);
  }, [activeCall]);

  const onMuteToggle = useCallback(() => {
    if (!activeCall) return;
    if (muted) unmute(activeCall.lineNum); else mute(activeCall.lineNum);
    setMuted((m) => !m);
  }, [activeCall, muted]);

  const onHoldToggle = useCallback(() => {
    if (!activeCall) return;
    if (held) unhold(activeCall.lineNum); else hold(activeCall.lineNum);
    setHeld((h) => !h);
  }, [activeCall, held]);

  const onSendMessage = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, fromMe: true, time: new Date().toLocaleTimeString() },
    ]);
    // TODO: bridge to sipClient.sendMessage when added.
  }, []);

  // ---- Render -----------------------------------------------------------
  return (
    <div className={styles.shell}>
      {!credsOk && (
        <div className={styles.placeholder}>
          <i className="fa fa-cogs" aria-hidden="true" />
          <h2 style={{ margin: 0 }}>SIP credentials required</h2>
          <p style={{ margin: 0, maxWidth: 360 }}>
            Enter your SIP account details to register and start making calls.
          </p>
          <Button variant="primary" onClick={openSettings}>Open settings</Button>
        </div>
      )}

      {credsOk && status === 'loading' && <Loading label="Connecting…" />}
      {credsOk && status === 'error'   && <ErrorBanner title="Failed to load SIP stack" message={error} />}

      {credsOk && status === 'ready' && (
        <AppShell
          sidebar={
            <Sidebar>
              <UserProfile
                name={phoneOptions.profileName || phoneOptions.SipUsername || 'Me'}
                status={registered ? 'online' : (regError ? 'failed' : 'offline')}
                presenceText={registered ? 'Registered' : (regError || 'Not registered — connecting…')}
                onSettings={openSettings}
                onAddContact={() => alert('Add contact (todo)')}
              />
              <SearchBar value={search} onChange={setSearch} onFilter={() => {}} />
              <BuddyList
                buddies={[]}
                selectedId={selectedId}
                onSelect={(b) => setSelectedId(b.id)}
                emptyText="Contacts will appear here once buddy sync is wired."
              />
            </Sidebar>
          }
          header={
            <div className={styles.headerBar}>
              <ThemeToggle />
            </div>
          }
          footer={
            activeCall ? (
              <CallControls
                muted={muted} onMuteToggle={onMuteToggle}
                held={held}   onHold={onHoldToggle}
                onHangup={onHangup}
              />
            ) : null
          }
        >
          {activeCall ? (
            <>
              <div className={styles.placeholder}>
                <i className="fa fa-phone" aria-hidden="true" />
                <div>On call with <strong>{activeCall.name}</strong></div>
              </div>
              <MessageList messages={messages} />
              <MessageInput onSend={onSendMessage} />
            </>
          ) : (
            <DialPad onCall={onDialOut} />
          )}
        </AppShell>
      )}

      <IncomingCallToast call={incoming} onAnswer={onAnswer} onReject={onReject} />

      <SettingsModal
        open={settingsOpen}
        onClose={closeSettings}
        initialValues={phoneOptions}
        onSave={onSaveSettings}
      />

      {/* Hidden mount point — phone.js queries #Phone via jQuery and renders
          its legacy DOM there. We hide it via CSS but keep it mounted so the
          SIP/IndexedDB/XMPP stack continues to work. */}
      <div id="Phone" aria-hidden="true" />
    </div>
  );
}
