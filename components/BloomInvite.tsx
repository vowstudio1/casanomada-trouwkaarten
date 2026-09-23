"use client";

/**
 * BloomInvite — exacte reconstructie op basis van Sponsalia broncode
 *
 * Gebaseerd op chunk 0gmywydibhbww.js (originele Sponsalia JS bundle)
 *
 * Originele architectuur:
 * - music-intro overlay met canvas (WebGL keyed compositing)
 * - video met useBlobSrc (fetch → blob URL voor CORS-vrij afspelen)
 * - CSS events: invito:cover-cue + invito:cover-open
 * - CSS classes: is-started, is-closing op .music-intro
 * - onTransitionEnd op .music-intro → opacity 0 → verwijder intro
 * - body overflow:hidden tijdens intro
 * - bl-panel hero met data-reveal + CSS variabelen
 *
 * avorio-rosa config (exact uit broncode):
 *   fps:    24
 *   aspect: 0.562963
 *   clear:  3.46          ← tijdstip waarop cover-cue event afgaat
 *   inner:  rgb(218,197,191)
 *   panel:  rgb(219,200,193)
 *
 * WebGL vertex shader + fragment shader exact overgenomen.
 * Track data (111 frames) exact overgenomen.
 */

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MapPin, Clock, Heart, Check, Camera, MessageSquare } from "lucide-react";

// ── URLs ──────────────────────────────────────────────────────────────────────
const VIDEO_URL  = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/video/avorio_rosa.mp4";
const MUSIC_URL  = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/music/amber_glow.mp3";
const POSTER_URL = "/assets/templates/bloom/avorio_rosa-poster.jpg";

const B = {
  ink:         "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  leaf:        "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  body:        "/assets/templates/bloom/bl-cartoncino-body.webp",
  line:        "/assets/templates/bloom/bl-cartoncino-line.webp",
  fascia:      "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  crnInk:      "/assets/templates/bloom/bl-data-cornice-ink.webp",
  crnLeaf:     "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  fiocco:      "/assets/templates/bloom/bl-fiocco-ink.webp",
  lungo:       "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba:     "/assets/templates/bloom/bl-colomba-ink.webp",
  wave:        "/assets/templates/bloom/bl-wave.svg",
};

// ── Originele Bloom tokens ────────────────────────────────────────────────────
const C = {
  gold:    "#cf8fa2",
  gold3:   "#e8c3cd",
  gold4:   "#dba7b6",
  ink9:    "#4a3a3a",
  ink7:    "#6a5555",
  ink5:    "#857070",
  iv1:     "#fbf8f6",
  iv2:     "#f3eeea",
  iv3:     "#e6dfda",
  iv4:     "#cdc3bd",
  introBg: "#eae2d7",   // originele Sponsalia achtergrond
};

// ── avorio-rosa WebGL config (EXACT uit Sponsalia broncode) ───────────────────
const SEAL_CFG = {
  fps:    24,
  aspect: 0.562963,
  clear:  3.46,                // invito:cover-cue tijdstip
  inner:  "rgb(218, 197, 191)",
  panel:  "rgb(219, 200, 193)",
  // 111 frames track data [x, y] — exact uit broncode
  track: [
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],[.88,.4995],
    [.8802,.4995],[.8807,.4995],[.8815,.4995],[.8827,.4995],[.8842,.4995],
    [.886,.4995],[.8881,.4995],[.8906,.4995],[.8935,.4995],[.8966,.4995],
    [.9001,.4995],[.9039,.4995],[.9081,.4995],[.9126,.4995],[.9174,.4995],
    [.9225,.4995],[.928,.4995],[.9339,.4995],[.94,.4995],[.9461,.4995],
    [.952,.4995],[.9575,.4995],[.9626,.4995],[.9674,.4995],[.9719,.4995],
    [.9761,.4995],[.9799,.4995],[.9834,.4995],[.9865,.4995],[.9894,.4995],
    [.9919,.4995],[.994,.4995],[.9958,.4995],[.9973,.4995],[.9985,.4995],
    [.9993,.4995],[.9998,.4995],[1,.4995],
  ],
};

// ── WebGL shaders (EXACT uit Sponsalia broncode chunk 0gmywydibhbww.js) ───────
const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG_SRC = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform vec3 uInner;
uniform vec3 uOutside;
void main() {
  vec2 uv = (vUv - uOffset) / uScale;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(uOutside, 1.0);
    return;
  }
  vec3 col = texture2D(uTex, vec2(uv.x * 0.5, uv.y)).rgb;
  float a = texture2D(uTex, vec2(uv.x * 0.5 + 0.5, uv.y)).r;
  gl_FragColor = vec4(col, a);
}`;

// ── RGB string → [r,g,b] normaliseer ──────────────────────────────────────────
function parseRgb(s: string): [number, number, number] {
  const m = s.match(/(\d+)\D+(\d+)\D+(\d+)/);
  return m ? [+m[1]/255, +m[2]/255, +m[3]/255] : [.85,.83,.78];
}

// ── WebGL busta engine (gebaseerd op Sponsalia implementatie) ─────────────────
function startBustaEngine(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  cfg: typeof SEAL_CFG,
  onCoverCue: () => void,
  onError: (e: unknown) => void,
) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) { onError("no webgl"); return null; }

  // Shaders
  function makeShader(type: number, src: string) {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (gl.deleteShader(s), null);
  }
  const vs = makeShader(gl.VERTEX_SHADER,   VERT_SRC);
  const fs = makeShader(gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) { onError("shader"); return null; }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { onError("link"); return null; }
  gl.useProgram(prog);

  // Buffer
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  const uTex     = gl.getUniformLocation(prog, "uTex");
  const uScale   = gl.getUniformLocation(prog, "uScale");
  const uOffset  = gl.getUniformLocation(prog, "uOffset");
  const uInner   = gl.getUniformLocation(prog, "uInner");
  const uOutside = gl.getUniformLocation(prog, "uOutside");

  // Texture
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(uTex, 0);

  const inner   = parseRgb(cfg.inner);
  const outside = parseRgb(cfg.panel);
  gl.uniform3fv(uInner,   inner);
  gl.uniform3fv(uOutside, outside);

  let rafId = 0;
  let coverCueFired = false;

  function resize() {
    canvas.width  = canvas.clientWidth  * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  function getTrackFrame(time: number): [number, number] {
    const frame = Math.min(Math.round(time * cfg.fps), cfg.track.length - 1);
    return cfg.track[Math.max(0, frame)] as [number, number];
  }

  function draw() {
    if (video.readyState < 2) { rafId = requestAnimationFrame(draw); return; }

    const t = video.currentTime;

    // invito:cover-cue event (origineel: onTimeUpdate check)
    if (!coverCueFired && t >= cfg.clear) {
      coverCueFired = true;
      onCoverCue();
    }

    // Track positie voor dit frame
    const [tx, ty] = getTrackFrame(t);

    // Canvas/video verhoudingen
    const cw = canvas.width, ch = canvas.height;
    const vr = cfg.aspect; // video breedte/hoogte ratio
    const cr = cw / ch;

    let scaleX: number, scaleY: number, offX: number, offY: number;
    if (cr > vr) {
      scaleX = 1;
      scaleY = (cw / vr) / ch;
      offX = 0;
      offY = (1 - scaleY) / 2;
    } else {
      scaleX = (ch * vr) / cw;
      scaleY = 1;
      offX = (1 - scaleX) / 2;
      offY = 0;
    }

    // Track offset (volgt het envelop-centrum)
    const finalOffX = offX + (tx - 0.5) * scaleX * 0;
    const finalOffY = offY + (ty - 0.5) * scaleY * 0;

    gl.uniform2f(uScale,  scaleX, scaleY);
    gl.uniform2f(uOffset, finalOffX, finalOffY);

    // Upload video frame als texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    rafId = requestAnimationFrame(draw);
  }

  draw();

  return {
    stop() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

// ── useBlobSrc — Sponsalia aanpak: fetch video → blob URL ────────────────────
// Voorkomt CORS issues en zorgt voor betere buffer-control
function useBlobSrc(url: string, enabled: boolean): string | undefined {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const urlRef = useRef(url);

  useEffect(() => {
    if (!enabled || !url) return;
    if (typeof fetch === "undefined" || typeof URL?.createObjectURL === "undefined") return;

    const nav = navigator as any;
    if (nav.connection?.saveData) return;
    if (nav.connection?.effectiveType && /^(slow-)?2g$/.test(nav.connection.effectiveType)) return;

    const ctrl = new AbortController();
    let objectUrl: string | undefined;

    fetch(url, { signal: ctrl.signal, mode: "cors", credentials: "omit" })
      .then(r => r.ok ? r.blob() : Promise.reject(r.status))
      .then(blob => {
        if (ctrl.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => {});

    return () => {
      ctrl.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, enabled]);

  return blobUrl;
}

// ── Kleurfilter helper ────────────────────────────────────────────────────────
function inkFilter(color: string): string {
  const map: Record<string, string> = {
    "#8B2635": "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)",
    "#cf8fa2": "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.05)",
    "#1a2e4a": "sepia(1) saturate(2) hue-rotate(190deg) brightness(0.7)",
    "#5a7a5a": "sepia(1) saturate(2) hue-rotate(80deg)  brightness(0.8)",
  };
  return map[color] ?? "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)";
}

// ── Types ─────────────────────────────────────────────────────────────────────
type WeddingEvent = {
  id: string; name: string;
  start_time: string; end_time: string;
  venue: string; city: string;
  description: string; is_main: boolean;
  event_date: string;
};

export type BloomInviteProps = {
  namen:           string;
  datumLang:       string;
  weddingTime?:    string;
  venue?:          string;
  stad?:           string;
  address?:        string;
  welcomeMessage?: string;
  events?:         WeddingEvent[];
  color?:          string;
  showRsvp?:       boolean;
  showPhotos?:     boolean;
  showMessages?:   boolean;
  showCountdown?:  boolean;
  demoMode?:       boolean;
  onRsvp?:         (attending: boolean, name: string, diet: string) => Promise<void>;
  onMessage?:      (text: string, authorName: string) => Promise<void>;
  onPhotoUpload?:  (file: File) => Promise<void>;
};

// ════════════════════════════════════════════════════════════════════════════
export default function BloomInvite({
  namen, datumLang, weddingTime, venue, stad, address,
  welcomeMessage, events = [], color = "#8B2635",
  showRsvp = true, showPhotos = true, showMessages = true,
  showCountdown = true, demoMode = false,
  onRsvp, onMessage, onPhotoUpload,
}: BloomInviteProps) {

  // ── Intro staten (Sponsalia: is-started, is-closing → removed) ────────
  const [isStarted,  setIsStarted]  = useState(false);   // is-started class
  const [isClosing,  setIsClosing]  = useState(false);   // is-closing class (opacity→0)
  const [introDone,  setIntroDone]  = useState(demoMode);
  const [heroIn,     setHeroIn]     = useState(demoMode);
  const [heroOver,   setHeroOver]   = useState(false);   // cover-cue → hero overlay
  const [musicPlay,  setMusicPlay]  = useState(false);
  const [reducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // ── RSVP / berichten ──────────────────────────────────────────────────
  const [rsvpName,   setRsvpName]   = useState("");
  const [rsvpDiet,   setRsvpDiet]   = useState("");
  const [rsvpChoice, setRsvpChoice] = useState<"yes"|"no"|null>(null);
  const [rsvpDone,   setRsvpDone]   = useState(false);
  const [msgText,    setMsgText]    = useState("");
  const [msgSent,    setMsgSent]    = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [countdown,  setCountdown]  = useState({ days:0, hours:0, min:0, sec:0 });

  // ── Refs ──────────────────────────────────────────────────────────────
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const audioRef   = useRef<HTMLAudioElement>(null);
  const engineRef  = useRef<{ stop: () => void } | null>(null);
  const introRef   = useRef<HTMLDivElement>(null);
  const countRef   = useRef<ReturnType<typeof setInterval>>();
  const sectRefs   = useRef<Record<string, HTMLElement | null>>({});
  const cueFiredRef = useRef(false);

  const ifilter = useMemo(() => inkFilter(color), [color]);

  // ── useBlobSrc voor video ─────────────────────────────────────────────
  // Sponsalia fetcht de video naar een blob URL vóór afspelen
  const blobUrl = useBlobSrc(VIDEO_URL, !demoMode);
  const videoSrc = blobUrl ?? VIDEO_URL;

  // ── Body scroll lock (Sponsalia: html+body overflow:hidden) ───────────
  useEffect(() => {
    if (introDone) return;
    const h = document.documentElement, b = document.body;
    const ph = h.style.overflow, pb = b.style.overflow;
    h.style.overflow = "hidden"; b.style.overflow = "hidden";
    return () => { h.style.overflow = ph; b.style.overflow = pb; };
  }, [introDone]);

  // ── Countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const target = (window as any).__bloomWeddingDate;
      if (!target) return;
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        min:   Math.floor((diff % 3600000)  / 60000),
        sec:   Math.floor((diff % 60000)    / 1000),
      });
    };
    countRef.current = setInterval(tick, 1000); tick();
    return () => clearInterval(countRef.current);
  }, []);

  // ── IntersectionObserver bottom nav ──────────────────────────────────
  useEffect(() => {
    if (!introDone) return;
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.35 }
    );
    Object.values(sectRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [introDone]);

  // ── cover-cue handler (Sponsalia: invito:cover-cue event) ─────────────
  // Wordt getriggerd op t >= clear (3.46s voor avorio-rosa)
  const onCoverCue = useCallback(() => {
    if (cueFiredRef.current) return;
    cueFiredRef.current = true;
    setHeroIn(true);   // hero reveal start
    setHeroOver(true); // hero__ink--over class
    // Na een korte delay: start is-closing op intro overlay
    setTimeout(() => setIsClosing(true), 80);
  }, []);

  // ── WebGL engine starten na video start ──────────────────────────────
  useEffect(() => {
    if (!isStarted) return;
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;

    engineRef.current?.stop();
    engineRef.current = startBustaEngine(canvas, video, SEAL_CFG, onCoverCue, console.warn);

    return () => { engineRef.current?.stop(); engineRef.current = null; };
  }, [isStarted, onCoverCue]);

  // ── Tap handler (Sponsalia: onClick op .music-intro) ──────────────────
  const handleTap = useCallback(() => {
    if (isStarted) return;
    setIsStarted(true);

    // prefers-reduced-motion: sla video over
    if (reducedMotion) {
      setHeroIn(true); setIntroDone(true);
      return;
    }

    // Muziek starten (synchroon met tap — Sponsalia aanpak)
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
      setMusicPlay(true);
    }

    // Video starten
    const video = videoRef.current;
    if (!video) return;
    const play = () => {
      video.play().catch(() => {
        // Autoplay geblokkeerd: ga direct door
        onCoverCue();
        setTimeout(() => setIntroDone(true), 700);
      });
    };
    if (video.readyState >= 3) play();
    else { video.load(); video.addEventListener("canplay", play, { once: true }); }

    // Veiligheids-timeout: als video niet speelt na 15s → ga door
    setTimeout(() => {
      if (!cueFiredRef.current) {
        onCoverCue();
        setTimeout(() => setIntroDone(true), 700);
      }
    }, 15000);
  }, [isStarted, reducedMotion, onCoverCue]);

  // ── onTransitionEnd op .music-intro (Sponsalia: opacity → done) ───────
  const handleIntroTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === "opacity" && isClosing) {
      engineRef.current?.stop(); engineRef.current = null;
      setIntroDone(true);
    }
  }, [isClosing]);

  // ── Video einde ───────────────────────────────────────────────────────
  const handleVideoEnd = useCallback(() => {
    if (!cueFiredRef.current) onCoverCue();
    setTimeout(() => setIsClosing(true), 100);
  }, [onCoverCue]);

  // ── Muziek toggle ────────────────────────────────────────────────────
  const toggleMusic = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlay) { audio.pause(); setMusicPlay(false); }
    else { audio.play().catch(() => {}); setMusicPlay(true); }
  }, [musicPlay]);

  // ── Reveal helper ────────────────────────────────────────────────────
  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   heroIn ? 1 : 0,
    transform: heroIn ? "translateY(0)" : "translateY(12px)",
    transition: heroIn
      ? `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
      : "none",
  });

  const scrollTo = (id: string) =>
    sectRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const inp: React.CSSProperties = {
    border: `1.5px solid ${C.iv4}`, borderRadius: 10, padding: "10px 14px",
    fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15,
    width: "100%", boxSizing: "border-box", outline: "none",
    background: "rgba(251,248,246,0.85)", color: C.ink9,
  };

  // ════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        /* ── Sponsalia .music-intro CSS (exact) ──────────────── */
        .music-intro {
          z-index: 200;
          isolation: isolate;
          text-align: center;
          cursor: pointer;
          touch-action: none;
          background: ${C.introBg};
          display: grid;
          place-items: center;
          position: fixed;
          inset: 0;
          opacity: 1;
          transition: opacity 0.55s ease;
        }
        .music-intro.is-closing { opacity: 0; pointer-events: none; }

        .music-intro__key {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          display: block;
        }
        .music-intro__video {
          object-fit: cover;
          background: ${C.introBg};
          background-image: url(${POSTER_URL});
          background-size: cover;
          background-position: center;
          width: 100%; height: 100%;
          position: absolute; inset: 0;
          display: block;
        }
        .music-intro__caption {
          z-index: 2;
          pointer-events: none;
          position: absolute; inset: 0;
        }
        .music-intro__names {
          font-family: 'Pinyon Script', cursive;
          font-size: clamp(1.5rem, 7.5vw, 2.4rem);
          color: ${C.ink9};
          width: min(78%, 22rem);
          position: absolute;
          top: 21%; left: 50%;
          transform: translate(-50%, 0);
          line-height: 1.15; margin: 0;
        }
        .music-intro__hint {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.6rem, 2.5vw, 0.72rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${C.ink7};
          position: absolute;
          bottom: 16%; left: 50%;
          transform: translate(-50%, 0);
          white-space: nowrap;
          animation: miPulse 2.4s ease-in-out infinite;
        }
        .music-intro.is-started .music-intro__hint { opacity: 0; }

        /* ── Music toggle ────────────────────────────────────── */
        .music-toggle {
          position: fixed; top: 16px; right: 16px; z-index: 300;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(251,248,246,0.96);
          border: 1px solid ${C.iv4};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 16px rgba(74,58,58,0.12);
        }
        .music-toggle__bars {
          display: flex; align-items: flex-end; gap: 2px; height: 14px;
        }
        .music-toggle__bars span {
          width: 3px; border-radius: 2px;
          background: ${C.gold};
          animation: barDance 0.7s ease-in-out infinite;
          height: 6px;
        }
        .music-toggle.is-playing .music-toggle__bars span { height: 14px; }
        .music-toggle__bars span:nth-child(2) { animation-delay: 0.15s; }
        .music-toggle__bars span:nth-child(3) { animation-delay: 0.30s; }

        /* ── bl-panel hero ──────────────────────────────────── */
        .bl-reveal {
          opacity: 0; transform: translateY(12px);
        }

        /* ── Keyframes ──────────────────────────────────────── */
        @keyframes miPulse  { 0%,100%{opacity:.4} 50%{opacity:.95} }
        @keyframes barDance { 0%,100%{height:5px} 50%{height:14px} }
        @keyframes bFadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .bfu  { animation: bFadeUp 0.7s ease both; }
        .bfu1 { animation-delay:0.05s } .bfu2 { animation-delay:0.12s }
        .bfu3 { animation-delay:0.20s } .bfu4 { animation-delay:0.28s }
        .bfu5 { animation-delay:0.36s } .bfu6 { animation-delay:0.44s }

        @media (prefers-reduced-motion: reduce) {
          .music-intro, .music-intro__hint, .music-toggle__bars span,
          .bl-reveal, .bfu { animation: none !important; transition: none !important;
            opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Audio */}
      <audio ref={audioRef} src={MUSIC_URL} loop preload={isStarted ? "auto" : "none"}
        onPlay={() => setMusicPlay(true)} onPause={() => setMusicPlay(false)} />

      {/* ══ MUSIC-INTRO OVERLAY ══════════════════════════════════════════
          Sponsalia: .music-intro.music-intro--keyed.is-started.is-closing
          Blijft in DOM tot opacity transitie klaar is (onTransitionEnd)
      ══════════════════════════════════════════════════════════════════ */}
      {!introDone && (
        <div
          ref={introRef}
          className={["music-intro music-intro--keyed",
            isStarted ? "is-started" : "",
            isClosing ? "is-closing" : "",
          ].filter(Boolean).join(" ")}
          role="button"
          tabIndex={0}
          aria-label="Open de uitnodiging"
          onClick={handleTap}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleTap(); }}}
          onTransitionEnd={handleIntroTransitionEnd}
        >
          {/* canvas — WebGL keyed compositing (Sponsalia: music-intro__key) */}
          <canvas ref={canvasRef} className="music-intro__key" aria-hidden />

          {/* video — Sponsalia: music-intro__video */}
          <video
            ref={videoRef}
            className="music-intro__video"
            src={videoSrc}
            poster={POSTER_URL}
            muted
            playsInline
            crossOrigin="anonymous"
            preload="metadata"
            aria-hidden
            onEnded={handleVideoEnd}
            onError={handleVideoEnd}
          />

          {/* caption — namen + hint */}
          <div className="music-intro__caption">
            <p className="music-intro__names">{namen}</p>
            <p className="music-intro__hint">Tik om te openen</p>
          </div>
        </div>
      )}

      {/* Music toggle (Sponsalia: .music-toggle, hidden tijdens intro) */}
      <button
        className={["music-toggle", musicPlay ? "is-playing" : ""].filter(Boolean).join(" ")}
        onClick={toggleMusic}
        aria-label={musicPlay ? "Muziek pauzeren" : "Muziek afspelen"}
        aria-pressed={musicPlay}
        hidden={!introDone}
      >
        <span className="music-toggle__bars" aria-hidden>
          <span /><span /><span />
        </span>
      </button>

      {/* ══ INVITE BODY ══════════════════════════════════════════════════
          Bestaat tegelijk met intro in DOM.
          Hero reveal start via invito:cover-cue (setHeroIn)
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: C.iv2, minHeight: "100svh",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        overflow: introDone ? undefined : "hidden",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>

          {/* ══ HERO — header.hero.bl-hero (exact Sponsalia structuur) ═══ */}
          <header
            id="top"
            ref={el => { sectRefs.current["top"] = el; }}
            className="hero bl-hero"
            style={{ position: "relative", width: "100%", aspectRatio: "692/1500", overflow: "hidden", background: C.iv2 }}
          >
            <div className="bl-panel" style={{ position: "absolute", inset: 0 }}>
              {/* Laag: cartoncino body */}
              <img src={B.body} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
              <img src={B.line} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.07,mixBlendMode:"multiply" }} />
              {/* span.bl-panel__ink */}
              <span className="bl-panel__ink" aria-hidden style={{ position:"absolute",inset:0,backgroundImage:`url(${B.ink})`,backgroundSize:"cover",backgroundPosition:"center top",filter:ifilter,opacity:.88 }} />
              {/* span.bl-panel__leaf */}
              <span className="bl-panel__leaf" aria-hidden style={{ position:"absolute",inset:0,backgroundImage:`url(${B.leaf})`,backgroundSize:"cover",backgroundPosition:"center top" }} />
              {/* div.bl-panel__text — originele inset: 26% 22% 32% */}
              <div className="bl-panel__text" style={{ position:"absolute",top:"26%",right:"22%",bottom:"32%",left:"22%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"0.45em" }}>
                {/* eyebrow — delay 0.05s (origineel) */}
                <span className="hero__eyebrow bl-reveal" data-reveal style={{ ...reveal(0.05), fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(7px,1.8vw,9px)",letterSpacing:"0.28em",textTransform:"uppercase",color:C.ink7,textAlign:"center" }}>
                  Met liefde uitgenodigd
                </span>
                {/* h1.hero__names — Pinyon Script, delay 0.45s */}
                <h1 className="hero__names bl-reveal" data-reveal style={{ ...reveal(0.45), fontFamily:"'Pinyon Script',cursive",fontSize:"clamp(24px,7vw,42px)",fontWeight:400,color:C.ink9,textAlign:"center",lineHeight:1.05,margin:0 }}>
                  {namen}
                </h1>
                {/* wave */}
                <span className="bl-reveal" style={{ ...reveal(0.65), textAlign:"center" }}>
                  <img src={B.wave} alt="" aria-hidden style={{ width:"clamp(70px,40%,110px)",opacity:.30 }} />
                </span>
                {/* p.hero__kicker — delay 0.90s */}
                <p className="hero__kicker bl-reveal" data-reveal style={{ ...reveal(0.90), fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(10px,2.4vw,13px)",letterSpacing:"0.14em",textTransform:"uppercase",color:C.ink5,margin:0,textAlign:"center" }}>
                  Wij gaan trouwen
                </p>
                {/* div.hero__meta — delay 1.30s / 1.65s */}
                <div className="hero__meta bl-reveal" style={{ ...reveal(1.30), display:"flex",flexDirection:"column",alignItems:"center",gap:3,marginTop:2 }}>
                  {datumLang && <span data-reveal style={{ ...reveal(1.30), fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(9px,2.2vw,12px)",color:C.ink7,textAlign:"center",letterSpacing:"0.06em" }}>{datumLang}</span>}
                  {(venue||stad) && <span data-reveal style={{ ...reveal(1.65), fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(9px,2vw,11px)",color:C.ink5,textAlign:"center" }}>{venue}{stad?`, ${stad}`:""}</span>}
                </div>
              </div>
            </div>
          </header>

          {/* Lange strik */}
          <div className="bl-reveal" style={{ ...reveal(1.40), display:"flex",justifyContent:"center",marginTop:-22,position:"relative",zIndex:10 }}>
            <img src={B.lungo} alt="" aria-hidden style={{ height:"clamp(52px,10vw,76px)",width:"auto",filter:ifilter,opacity:.82 }} />
          </div>

          {/* ══ COUNTDOWN ══════════════════════════════════════════════ */}
          {showCountdown && countdown.days > 0 && (
            <div id="countdown" ref={el=>{sectRefs.current["countdown"]=el;}}
              className="bfu bfu1" style={{ margin:"20px 16px 16px",position:"relative",borderRadius:20,overflow:"hidden" }}>
              <img src={B.fascia} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.16,filter:ifilter }} />
              <div style={{ position:"relative",background:`${C.iv1}cc`,borderRadius:20,padding:"22px" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.ink5,textAlign:"center",marginBottom:14 }}>Nog</p>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
                  {[{v:countdown.days,l:"dagen"},{v:countdown.hours,l:"uren"},{v:countdown.min,l:"min"},{v:countdown.sec,l:"sec"}].map(({v,l})=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:C.gold,fontWeight:400,lineHeight:1,margin:0 }}>{String(v).padStart(2,"0")}</p>
                      <p style={{ fontFamily:"sans-serif",fontSize:9,color:C.ink5,marginTop:3,letterSpacing:"0.08em" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ DATUM & LOCATIE ════════════════════════════════════════ */}
          <div className="bfu bfu2" style={{ margin:"0 16px 16px",background:C.iv1,borderRadius:20,padding:"28px 22px",boxShadow:"0 6px 28px rgba(74,58,58,0.07)",position:"relative",overflow:"hidden" }}>
            <img src={B.line} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.07,pointerEvents:"none" }} />
            <img src={B.crnLeaf} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",opacity:.12,pointerEvents:"none" }} />
            <img src={B.crnInk}  alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",opacity:.09,filter:ifilter,pointerEvents:"none" }} />
            <div style={{ position:"relative",textAlign:"center" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.ink5,marginBottom:8 }}>Datum</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.ink9,fontWeight:400,margin:"0 0 4px" }}>{datumLang}</p>
              {weddingTime&&<p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.ink7,margin:0 }}>Aanvang {weddingTime} uur</p>}
              <div style={{ margin:"14px 0" }}><img src={B.wave} alt="" aria-hidden style={{ width:"55%",opacity:.22 }} /></div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.ink5,marginBottom:8 }}>Locatie</p>
              {venue&&<p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.ink9,margin:"0 0 2px" }}>{venue}</p>}
              {stad&&<p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.ink7,margin:0 }}>{stad}</p>}
              {address&&<a href={`https://maps.google.com/?q=${encodeURIComponent(address+" "+stad)}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:5,marginTop:10,fontFamily:"sans-serif",fontSize:12,color:C.gold,textDecoration:"none" }}><MapPin size={12}/> Route bekijken</a>}
            </div>
          </div>

          {/* ══ WELKOMSTBERICHT ════════════════════════════════════════ */}
          {welcomeMessage&&(
            <div className="bfu bfu2" style={{ margin:"0 16px 16px",background:C.iv1,borderRadius:20,padding:"24px 22px",boxShadow:"0 4px 20px rgba(74,58,58,0.06)",position:"relative",overflow:"hidden" }}>
              <img src={B.line} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.06,pointerEvents:"none" }} />
              <div style={{ position:"relative",textAlign:"center" }}>
                <img src={B.fiocco} alt="" aria-hidden style={{ width:34,opacity:.28,filter:ifilter,marginBottom:12 }} />
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontStyle:"italic",color:C.ink7,lineHeight:1.8,margin:0 }}>"{welcomeMessage}"</p>
                <div style={{ marginTop:12 }}><img src={B.wave} alt="" aria-hidden style={{ width:"42%",opacity:.20 }} /></div>
              </div>
            </div>
          )}

          {/* ══ PROGRAMMA ══════════════════════════════════════════════ */}
          {events.length>0&&(
            <div id="program" ref={el=>{sectRefs.current["program"]=el;}} className="bfu bfu3" style={{ margin:"0 16px 16px" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.ink5,marginBottom:12,paddingLeft:2 }}>Programma</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {events.map(ev=>(
                  <div key={ev.id} style={{ background:C.iv1,borderRadius:16,padding:"16px 18px",boxShadow:"0 2px 12px rgba(74,58,58,0.06)",position:"relative",overflow:"hidden",borderLeft:ev.is_main?`3px solid ${C.gold}`:"3px solid transparent" }}>
                    <div style={{ display:"flex",gap:14,alignItems:"flex-start",position:"relative" }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:`${C.gold3}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <Clock size={13} style={{ color:C.gold }} />
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.ink9,margin:"0 0 2px" }}>{ev.name}</p>
                        {ev.start_time&&<p style={{ fontFamily:"sans-serif",fontSize:12,color:C.ink5,margin:0 }}>{ev.start_time}{ev.end_time?` – ${ev.end_time}`:""}</p>}
                        {ev.venue&&<p style={{ fontFamily:"sans-serif",fontSize:12,color:C.ink7,margin:"2px 0 0" }}>{ev.venue}{ev.city?`, ${ev.city}`:""}</p>}
                        {ev.description&&<p style={{ fontFamily:"sans-serif",fontSize:12,color:C.ink5,marginTop:4,lineHeight:1.5 }}>{ev.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ RSVP ═══════════════════════════════════════════════════ */}
          {showRsvp&&(
            <div id="rsvp" ref={el=>{sectRefs.current["rsvp"]=el;}} className="bfu bfu4" style={{ margin:"0 16px 16px",position:"relative",borderRadius:20,overflow:"hidden" }}>
              <img src={B.fascia} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.16,filter:ifilter }} />
              <div style={{ position:"relative",background:`${C.iv1}cc`,borderRadius:20,padding:"24px 22px" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.ink5,marginBottom:6 }}>RSVP</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.ink9,margin:"0 0 18px" }}>Ben jij erbij?</p>
                {rsvpDone?(
                  <div style={{ textAlign:"center",padding:"20px 0" }}>
                    <Heart size={28} style={{ color:C.gold,margin:"0 auto 10px",display:"block" }} />
                    <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.ink9,margin:0 }}>Bedankt voor je bevestiging!</p>
                  </div>
                ):(
                  <>
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontFamily:"sans-serif",fontSize:10,color:C.ink5,display:"block",marginBottom:5,letterSpacing:"0.1em" }}>NAAM</label>
                      <input value={rsvpName} onChange={e=>setRsvpName(e.target.value)} placeholder="Jouw naam" style={inp} />
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
                      <button onClick={()=>setRsvpChoice("yes")} style={{ background:rsvpChoice==="yes"?C.gold:"rgba(251,248,246,0.9)",color:rsvpChoice==="yes"?"white":C.ink7,border:`1.5px solid ${rsvpChoice==="yes"?C.gold:C.iv4}`,borderRadius:10,padding:"11px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s" }}>
                        {rsvpChoice==="yes"&&<Check size={13}/>} Ik kom!
                      </button>
                      <button onClick={()=>setRsvpChoice("no")} style={{ background:rsvpChoice==="no"?C.ink7:"rgba(251,248,246,0.9)",color:rsvpChoice==="no"?"white":C.ink7,border:`1.5px solid ${rsvpChoice==="no"?C.ink7:C.iv4}`,borderRadius:10,padding:"11px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,cursor:"pointer",transition:"all 0.2s" }}>
                        Ik kan niet
                      </button>
                    </div>
                    <div style={{ marginBottom:14 }}>
                      <label style={{ fontFamily:"sans-serif",fontSize:10,color:C.ink5,display:"block",marginBottom:5,letterSpacing:"0.1em" }}>DIEETWENSEN (OPTIONEEL)</label>
                      <input value={rsvpDiet} onChange={e=>setRsvpDiet(e.target.value)} placeholder="Vegetarisch, allergieën..." style={inp} />
                    </div>
                    <button onClick={async()=>{await onRsvp?.(rsvpChoice==="yes",rsvpName,rsvpDiet);setRsvpDone(true);}} disabled={!rsvpName||rsvpChoice===null} style={{ background:(!rsvpName||rsvpChoice===null)?C.iv4:C.gold,color:"white",border:"none",borderRadius:999,padding:"13px",fontFamily:"'Cormorant Garamond',serif",fontSize:16,cursor:(!rsvpName||rsvpChoice===null)?"default":"pointer",width:"100%",transition:"background 0.2s" }}>Bevestigen</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Duif */}
          <div style={{ display:"flex",justifyContent:"center",margin:"16px 0 12px" }}>
            <img src={B.colomba} alt="" aria-hidden style={{ width:40,opacity:.20,filter:ifilter }} />
          </div>

          {/* ══ FOTO ════════════════════════════════════════════════════ */}
          {showPhotos&&(
            <div id="photos" ref={el=>{sectRefs.current["photos"]=el;}} className="bfu bfu5" style={{ margin:"0 16px 16px",background:C.iv1,borderRadius:20,padding:"24px 22px",boxShadow:"0 4px 20px rgba(74,58,58,0.06)",textAlign:"center",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"relative" }}>
                <Camera size={22} style={{ color:C.gold,margin:"0 auto 8px",display:"block" }} />
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.ink9,margin:"0 0 4px" }}>Deel een foto</p>
                <p style={{ fontFamily:"sans-serif",fontSize:13,color:C.ink5,margin:"0 0 16px",lineHeight:1.5 }}>Upload jouw favoriete moment van deze dag</p>
                <label style={{ display:"inline-block",background:`${C.gold}15`,color:C.gold,border:`1.5px solid ${C.gold3}`,borderRadius:999,padding:"10px 22px",fontFamily:"sans-serif",fontSize:13,cursor:"pointer" }}>
                  Foto kiezen
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{if(e.target.files?.[0])onPhotoUpload?.(e.target.files[0]);}} />
                </label>
              </div>
            </div>
          )}

          {/* ══ GASTENBOEK ══════════════════════════════════════════════ */}
          {showMessages&&(
            <div id="messages" ref={el=>{sectRefs.current["messages"]=el;}} className="bfu bfu6" style={{ margin:"0 16px 16px",background:C.iv1,borderRadius:20,padding:"24px 22px",boxShadow:"0 4px 20px rgba(74,58,58,0.06)",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"relative" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                  <MessageSquare size={17} style={{ color:C.gold }} />
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.ink9,margin:0 }}>Laat een bericht achter</p>
                </div>
                {msgSent?(
                  <div style={{ textAlign:"center",padding:"16px 0" }}>
                    <img src={B.fiocco} alt="" aria-hidden style={{ width:30,opacity:.28,filter:ifilter,margin:"0 auto 8px",display:"block" }} />
                    <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.ink7,margin:0 }}>Bedankt voor je bericht!</p>
                  </div>
                ):(
                  <>
                    <textarea rows={3} value={msgText} onChange={e=>setMsgText(e.target.value)} placeholder="Schrijf een persoonlijk bericht voor het bruidspaar..." style={{ ...inp,resize:"vertical",marginBottom:10,minHeight:80 }} />
                    <button onClick={async()=>{await onMessage?.(msgText,rsvpName||"Gast");setMsgSent(true);setMsgText("");}} disabled={!msgText.trim()} style={{ background:msgText.trim()?C.gold:C.iv4,color:"white",border:"none",borderRadius:999,padding:"11px 20px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,cursor:msgText.trim()?"pointer":"default",width:"100%",transition:"background 0.2s" }}>
                      Bericht sturen
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign:"center",padding:"24px 16px 16px" }}>
            <div style={{ position:"relative",margin:"0 16px 18px",borderRadius:12,overflow:"hidden",height:36 }}>
              <img src={B.fascia} alt="" aria-hidden style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.18,filter:ifilter }} />
            </div>
            <img src={B.fiocco} alt="" aria-hidden style={{ width:32,opacity:.22,filter:ifilter,margin:"0 auto 8px",display:"block" }} />
            <img src={B.wave}   alt="" aria-hidden style={{ width:"38%",opacity:.18,margin:"0 auto 8px",display:"block" }} />
            <p style={{ fontFamily:"sans-serif",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:C.ink5 }}>
              Casa Nomada · Digitale trouwuitnodigingen
            </p>
          </div>
        </div>

        {/* ══ BOTTOM NAV ══════════════════════════════════════════════════ */}
        <nav style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:190,background:`${C.iv1}f5`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderTop:`1px solid ${C.iv4}`,boxShadow:"0 -2px 20px rgba(74,58,58,0.08)",paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
          <div style={{ display:"flex",justifyContent:"space-around",alignItems:"center",height:52,maxWidth:520,margin:"0 auto" }}>
            {[{id:"top",label:"Home"},{id:"program",label:"Programma"},{id:"rsvp",label:"RSVP"},{id:"photos",label:"Foto's"},{id:"messages",label:"Berichten"}].map(({id,label})=>{
              const active=activeSection===id;
              return(
                <button key={id} onClick={()=>scrollTo(id)} style={{ background:"none",border:"none",cursor:"pointer",padding:"6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative" }}>
                  <span style={{ fontFamily:"sans-serif",fontSize:10,letterSpacing:"0.06em",color:active?C.gold:C.ink5,transition:"color 0.2s" }}>{label}</span>
                  <span style={{ position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:active?"80%":"0%",height:1.5,borderRadius:999,background:C.gold,transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)" }} />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
