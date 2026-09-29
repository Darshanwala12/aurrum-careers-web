import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNarration } from '../avatar/useNarration.js';
import { scrollToId } from '../animations/useSmoothScroll.js';
import { useAiCharacter } from './useAiCharacter.js';
import { useLiveAvatar } from './useLiveAvatar.js';
import { SUGGESTED_PROMPTS, OPENING_LINE, knowledge } from './knowledge.js';
import { personas } from '../data/scenes.js';
import DoodleWorld from './components/DoodleWorld.jsx';
import ThoughtDoodles from './components/ThoughtDoodles.jsx';
import VoiceControlPanel from './VoiceControlPanel.jsx';
import { getVoiceSettings } from './voiceAdapter.js';
import { characterState } from '../avatar/character/config.js';
import './aurrum-ai-character.css';

const CharacterCanvas = lazy(() => import('../avatar/character/CharacterCanvas.jsx'));

const webglOK = (() => {
  try { const c = document.createElement('canvas'); return Boolean(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
})();

const HIGHLIGHT_CLASS = 'aurrum-ai-character-highlight';
const PERSONA_TOPIC = { working: 'professional', unsure: 'counselling' };

function useIsCompact() {
  const q = '(max-width: 899px)';
  const [compact, setCompact] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mql = window.matchMedia(q);
    const on = () => setCompact(mql.matches);
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, []);
  return compact;
}

export default function AiCharacter({ scene, overrideText, onOverrideConsumed, muted, onToggleMute, captionsOn, paused, reducedMotion, floating = false }) {
  const ai = useAiCharacter({ muted });
  const live = useLiveAvatar(ai, { muted });
  const viewportCompact = useIsCompact();
  const compact = floating || viewportCompact;

  const [expanded, setExpanded] = useState(false);
  const [avatarMode, setAvatarMode] = useState('half'); // 'half' | 'full'
  const [draft, setDraft] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(getVoiceSettings);
  const [avatar3d, setAvatar3d] = useState('loading');
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const logRef = useRef(null);

  const [dismissedFor, setDismissedFor] = useState(null);
  useEffect(() => {
    if (!expanded && ai.status === 'idle' && ai.current && scene?.id) setDismissedFor(scene.id);
  }, [scene?.id, expanded, ai.status, ai.current]);

  useEffect(() => { setDismissedFor(null); }, [ai.current]);

  const pending = ai.status === 'thinking' || ai.status === 'listening';
  const showAnswer = Boolean(ai.current) && dismissedFor !== scene?.id && !pending;
  const inConversation = showAnswer || pending;
  const narration = useNarration(!inConversation && !paused && !live.isLive ? (scene?.text || '') : '', { muted });

  const caption = showAnswer ? ai.spoken : pending ? ''
    : live.isLive ? 'Elena is listening. Just start talking, or type a question below.'
    : narration.displayed;
  const speaking = showAnswer ? ai.speaking : narration.speaking;
  const state = inConversation ? ai.characterState : (scene?.state || 'idle');
  const character = characterState({ status: inConversation ? ai.status : 'idle', response: showAnswer ? ai.current : undefined, state, speaking: speaking && !paused });

  const section = showAnswer ? ai.current?.section : null;
  useEffect(() => {
    if (!section || ai.status !== 'speaking') return;
    const el = document.getElementById(section);
    if (!el) return;
    el.classList.add(HIGHLIGHT_CLASS);
    return () => el.classList.remove(HIGHLIGHT_CLASS);
  }, [section, ai.status]);

  useEffect(() => {
    if (!ai.current?.section) return;
    scrollToId(ai.current.section);
  }, [ai.current]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [ai.history.length, showHistory]);

  useEffect(() => {
    if (!overrideText) return;
    const persona = personas.find((p) => p.reply === overrideText);
    const topic = persona && (PERSONA_TOPIC[persona.id] ?? persona.id);
    const entry = knowledge.find((k) => k.id === topic) ?? {};
    ai.say({ ...entry, id: topic ?? 'persona', answer: overrideText, section: null });
    onOverrideConsumed?.();
  }, [overrideText]);

  useEffect(() => { if (paused) { ai.stop(); live.interrupt(); } }, [paused]);
  useEffect(() => { if (compact && !expanded && live.isLive) live.end(); }, [compact, expanded, live.isLive]);

  useEffect(() => {
    if (!expanded) return;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    if (!live.ask(draft)) ai.ask(draft);
    setDraft('');
  };
  const askPrompt = (q) => { if (!live.ask(q)) ai.ask(q); };
  const stopTalking = () => (live.isLive ? live.interrupt() : ai.stop());
  const showMe = () => {
    if (!section) return;
    setExpanded(false);
    scrollToId(section);
  };

  const followups = showAnswer && ai.current?.followups?.length ? ai.current.followups : SUGGESTED_PROMPTS;
  const busy = ai.status === 'speaking' || ai.status === 'thinking';

  const figure = () => (
    <div className={`aurrum-ai-character__stage aurrum-ai-character__stage--${ai.status} ${avatarMode === 'half' ? 'is-half-body' : 'is-full-body'}`}>
      <div className={`aurrum-ai-character__avatar ${webglOK && avatar3d !== 'failed' ? 'is-3d' : ''} ${avatar3d === 'ready' ? 'is-ready' : ''} ${live.isLive ? 'is-live' : ''}`}>
        {live.status !== 'unavailable' && (
          <video
            ref={live.videoRef}
            className={`aurrum-ai-character__video ${live.isLive ? 'is-live' : ''}`}
            autoPlay
            playsInline
            aria-label="Live video of Elena, your Aurrum career advisor"
          />
        )}
        {!live.isLive && webglOK && avatar3d !== 'failed' && (
          <Suspense fallback={<span role="status">Preparing Elena…</span>}><CharacterCanvas
            character={character}
            halfBody={avatarMode === 'half'}
            reducedMotion={reducedMotion}
            paused={paused}
            onReady={() => setAvatar3d('ready')}
            onError={(err) => { console.warn('[Elena 3D] falling back to illustration:', err); setAvatar3d('failed'); }}
          /></Suspense>
        )}
        {!live.isLive && (!webglOK || avatar3d === 'failed') && (
          <div className="aurrum-ai-character__fallback">
            <span role="status">3D preview unavailable. Elena is still available in chat.</span>
          </div>
        )}
        <svg className="aurrum-ai-character__accent" viewBox="0 0 60 30" aria-hidden="true">
          <path pathLength="1" d="M4 22 Q 16 4, 30 16 T 56 8" />
        </svg>
      </div>
      <ThoughtDoodles status={ai.status} interim={ai.interim} />
      {showAnswer && (
        <DoodleWorld world={ai.current.world} note={ai.current.note} active={ai.status === 'speaking'} />
      )}
    </div>
  );

  const full = (
    <>
      {figure()}

      {captionsOn && (
        <p className="aurrum-ai-character__caption" aria-live="polite">
          {caption}
          {speaking && !paused && <span className="aurrum-ai-character__cursor" aria-hidden="true">▍</span>}
        </p>
      )}
      {!showAnswer && !pending && voiceSettings.greetingName && <p className="aurrum-ai-character__greeting">Hello, {voiceSettings.greetingName}. I’m Zenz. Ready when you are.</p>}

      {live.status !== 'unavailable' && (
        <div className="aurrum-ai-character__live" role="group" aria-label="Live conversation">
          {live.isLive ? (
            <>
              <span className="aurrum-ai-character__live-dot" aria-hidden="true" /> Live
              <button type="button" className="aurrum-ai-character__live-btn" onClick={live.toggleMic} aria-pressed={live.micMuted}>
                {live.micMuted ? 'Unmute mic' : 'Mute mic'}
              </button>
              <button type="button" className="aurrum-ai-character__live-btn" onClick={live.end}>End</button>
            </>
          ) : (
            <button
              type="button"
              className="aurrum-ai-character__live-start"
              onClick={live.start}
              disabled={live.status === 'connecting'}
            >
              {live.status === 'connecting' ? 'Connecting to Elena…' : '● Talk live with Elena'}
            </button>
          )}
          {live.status === 'error' && <span className="aurrum-ai-character__live-err" role="alert">{live.error}</span>}
        </div>
      )}

      <div className="aurrum-ai-character__composer">
        <form className="aurrum-ai-character__voice" onSubmit={submit}>
          <label htmlFor="aurrum-ai-input" className="aurrum-ai-character__sr">Type your question for Zenz</label>
          <input
            id="aurrum-ai-input"
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask Zenz anything…"
            autoComplete="off"
          />
          <button type="submit" className="aurrum-ai-character__send" disabled={!draft.trim()} aria-label="Ask">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </form>
        <div className="aurrum-ai-character__controls" role="group" aria-label="Conversation controls">
          <button type="button" className="aurrum-ai-character__icon" onClick={onToggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute' : 'Mute'} title={muted ? 'Unmute' : 'Mute'}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4Z" />
              {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7" />}
            </svg>
          </button>
          <button type="button" className="aurrum-ai-character__icon" onClick={stopTalking} disabled={!busy && !live.isLive} aria-label="Stop speaking" title="Stop">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" /></svg>
          </button>
          <button type="button" className="aurrum-ai-character__icon" onClick={ai.replay} disabled={!ai.current || busy || live.isLive} aria-label="Replay answer" title="Replay">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" /></svg>
          </button>
          <button type="button" className="aurrum-ai-character__icon" onClick={() => setVoiceOpen((v) => !v)} aria-pressed={voiceOpen} aria-label="Zenz voice controls" title="Voice controls">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7v4M16 7v4M5 10v2M19 10v2M8 21h8" /></svg>
          </button>
          <button
            type="button"
            className="aurrum-ai-character__icon"
            onClick={() => setShowHistory((v) => !v)}
            disabled={ai.history.length === 0}
            aria-pressed={showHistory}
            aria-label="Conversation history"
            title="History"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9" /></svg>
          </button>
        </div>
      </div>

      {voiceOpen && <VoiceControlPanel onClose={() => setVoiceOpen(false)} onSettingsChange={setVoiceSettings} />}

      <div className="aurrum-ai-character__prompts" role="list" aria-label="Suggested questions">
        {section && (
          <button type="button" role="listitem" className="aurrum-ai-character__prompt aurrum-ai-character__prompt--accent" onClick={showMe}>
            Show me on the page ↓
          </button>
        )}
        {followups.slice(0, section ? 3 : 4).map((q) => (
          <button key={q} type="button" role="listitem" className="aurrum-ai-character__prompt" onClick={() => askPrompt(q)}>
            {q}
          </button>
        ))}
      </div>

      {showHistory && ai.history.length > 0 && (
        <div className="aurrum-ai-character__history" role="dialog" aria-label="Conversation history">
          <div className="aurrum-ai-character__history-head">
            <span>Conversation</span>
            <button type="button" className="aurrum-ai-character__icon" onClick={() => setShowHistory(false)} aria-label="Close history">✕</button>
          </div>
          <ol ref={logRef} aria-label="Conversation transcript">
            <li className="is-assistant">{OPENING_LINE}</li>
            {ai.history.map((m, i) => (
              <li key={i} className={m.role === 'user' ? 'is-user' : 'is-assistant'}>
                <span className="aurrum-ai-character__sr">{m.role === 'user' ? 'You: ' : 'Elena: '}</span>
                {m.text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );

  // Floating chatbot launcher + modern floating modal panel
  return (
    <>
      {!expanded && createPortal(
        <button
          ref={launcherRef}
          type="button"
          className="aurrum-ai-character__launcher"
          onClick={() => setExpanded(true)}
          aria-label="Ask Zenz, your Aurrum career companion"
          aria-expanded={expanded}
        >
          <div className="aurrum-ai-character__bar-avatar">
            <Suspense fallback={<span>Elena</span>}>
              <CharacterCanvas character={character} halfBody reducedMotion={reducedMotion} paused={paused} />
            </Suspense>
          </div>
          <span className="aurrum-ai-character__launcher-label">Ask Zenz</span>
          {busy && <span className="aurrum-ai-character__launcher-dot" aria-hidden="true" />}
        </button>,
        document.body
      )}

      {expanded && createPortal(
        <div className="aurrum-ai-character aurrum-ai-character--modal" role="dialog" aria-modal="true" aria-label="Conversation with Zenz">
          <div className="aurrum-ai-character__sheet-head">
            <div className="aurrum-ai-character__sheet-head-avatar">
              <span aria-hidden="true" className="character-monogram">Z</span>
            </div>
            <div className="aurrum-ai-character__sheet-head-text">
              <strong>Zenz AI Companion</strong>
              <span role="status">{ai.status === 'thinking' ? 'Thinking…' : ai.status === 'listening' ? 'Listening…' : 'Aurrum Career Advisor'}</span>
            </div>

            {/* Mode switch button: Full Body vs Half Body */}
            <button
              type="button"
              className="aurrum-ai-character__mode-toggle"
              onClick={() => setAvatarMode(m => m === 'half' ? 'full' : 'half')}
              title={`Switch to ${avatarMode === 'half' ? 'Full Body' : 'Half Body'} 3D Mode`}
            >
              {avatarMode === 'half' ? '👤 Full' : '🧘 Half'}
            </button>

            <button type="button" className="aurrum-ai-character__close" onClick={() => setExpanded(false)} aria-label="Close conversation">✕</button>
          </div>
          {full}
        </div>,
        document.body
      )}
    </>
  );
}
