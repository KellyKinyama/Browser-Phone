/**
 * sipClient — thin ES-module facade around the legacy phone.js globals.
 *
 * The legacy phone.js attaches its SIP functions directly to `window`
 * (DialByLine, endSession, holdSession, MuteSession, sendDTMF, ...).
 * This module wraps those calls so React components can import a clean
 * API instead of calling globals directly. When phone.js has not loaded
 * yet, the calls become safe no-ops that log a warning.
 *
 * Replace the internals of these functions when you migrate the SIP
 * stack to a native ES module — the public API can stay the same.
 */

function call(name, ...args) {
  const fn = typeof window !== 'undefined' ? window[name] : undefined;
  if (typeof fn !== 'function') {
    console.warn(`[sipClient] window.${name} is not available yet.`);
    return undefined;
  }
  try {
    return fn(...args);
  } catch (err) {
    console.error(`[sipClient] ${name} threw:`, err);
    return undefined;
  }
}

/** Place an outbound call. type: 'audio' | 'video' */
export function dial(type, number, callerId = number, extraHeaders) {
  return call('DialByLine', type, null, number, callerId, extraHeaders);
}

/** Answer an incoming audio call on the given line number. */
export const answerAudio = (lineNum) => call('AnswerAudioCall', lineNum);

/** Answer an incoming video call on the given line number. */
export const answerVideo = (lineNum) => call('AnswerVideoCall', lineNum);

/** Reject an incoming call. */
export const rejectCall = (lineNum) => call('RejectCall', lineNum);

/** Cancel an outbound call before it connects. */
export const cancelCall = (lineNum) => call('cancelSession', lineNum);

/** Terminate an established call. */
export const endCall = (lineNum) => call('endSession', lineNum);

/** Place call on hold. */
export const hold = (lineNum) => call('holdSession', lineNum);

/** Resume held call. */
export const unhold = (lineNum) => call('unholdSession', lineNum);

/** Mute the local microphone for this line. */
export const mute = (lineNum) => call('MuteSession', lineNum);

/** Unmute the local microphone for this line. */
export const unmute = (lineNum) => call('UnmuteSession', lineNum);

/** Send a DTMF digit string. */
export const sendDtmf = (lineNum, digit) => call('sendDTMF', lineNum, digit);

/** Returns true if the legacy phone.js has loaded its API onto window. */
export function isReady() {
  return typeof window !== 'undefined' && typeof window.DialByLine === 'function';
}
