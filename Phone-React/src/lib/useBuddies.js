import { useEffect, useState } from 'react';

const POLL_MS = 2000;

function readRawBuddies() {
  if (typeof window === 'undefined') return [];
  const profileUserID = window.localStorage.getItem('profileUserID');
  if (!profileUserID) return [];
  try {
    const raw = window.localStorage.getItem(`${profileUserID}-Buddies`);
    if (!raw) return [];
    const json = JSON.parse(raw);
    return Array.isArray(json?.DataCollection) ? json.DataCollection : [];
  } catch {
    return [];
  }
}

function normalizeBuddy(item) {
  // phone.js uses different id fields per type.
  const id = item.uID || item.cID || item.gID || item.ExtensionNumber || item.DisplayName;
  return {
    id,
    name: item.DisplayName || item.ExtensionNumber || 'Unknown',
    extension: item.ExtensionNumber || '',
    type: item.Type,
    avatarUrl: undefined, // phone.js stores pictures separately; can be wired later
    status: 'offline',    // presence tracking is a separate subscription
    lastMessage: '',
    lastTime: '',
    raw: item,
  };
}

/**
 * useBuddies — reads phone.js's buddy list from localStorage and surfaces it
 * as a normalized array. Polls every few seconds so React stays in sync as
 * phone.js mutates the underlying JSON via IndexedDB / localStorage.
 */
export default function useBuddies({ enabled = true } = {}) {
  const [buddies, setBuddies] = useState([]);

  useEffect(() => {
    if (!enabled) return undefined;

    let lastSerialized = '';
    const refresh = () => {
      const items = readRawBuddies();
      // Cheap change-detect to avoid pointless re-renders.
      const serialized = JSON.stringify(items.map((i) => i.uID || i.cID || i.gID));
      if (serialized === lastSerialized) return;
      lastSerialized = serialized;
      setBuddies(items.map(normalizeBuddy));
    };

    refresh();
    const intervalId = setInterval(refresh, POLL_MS);
    const onStorage = (e) => {
      if (!e.key || e.key.endsWith('-Buddies')) refresh();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', onStorage);
    };
  }, [enabled]);

  return buddies;
}
