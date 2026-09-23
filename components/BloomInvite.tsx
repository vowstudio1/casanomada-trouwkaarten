"use client";

/**
 * BloomInvite — exacte reconstructie op basis van Sponsalia broncode
 *
 * Gebaseerd op:
 *  - chunk 0gmywydibhbww.js  (music-intro, WebGL engine, busta logica)
 *  - 35ozw36qxkrc0.css       (Bloom module CSS, cartoncino, cornice, decoraties)
 *  - 2yefap4x7aw-3.css       (music-intro, bottomnav, music-toggle, data-reveal)
 *
 * Nieuwe verbeteringen (v2, na analyse Dekking_tab.json):
 *  ✓ CSS variabelen op <html> voor busta animatie (--busta-scale, --busta-dy, etc.)
 *  ✓ html.has-busta-fiocco + html.has-busta-panel klassen
 *  ✓ .invito wrapper met exacte Sponsalia structuur
 *  ✓ Cartoncino mask-border (webkit-mask-box-image) voor count/dress/foot secties
 *  ✓ bl-fascia-righe-ink mask voor sectie achtergronden
 *  ✓ Decoratieve fiocco + colomba boven secties via CSS ::before
 *  ✓ travel__details cornice met data-cornice-ink/leaf
 *  ✓ Golfende lijn als SVG data-URI (exact Sponsalia wave mask)
 *  ✓ Scrollable bottomnav met animated underline
 */

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MapPin, Clock, Heart, Check, Camera, MessageSquare } from "lucide-react";

// ── URLs ───────────────────────────────────────────────────────────────────────
const VIDEO_URL  = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/video/avorio_rosa.mp4";
const MUSIC_URL  = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/music/amber_glow.mp3";
const POSTER_URL = "/assets/templates/bloom/avorio_rosa-poster.jpg";

const B = {
  ink:     "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  leaf:    "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  body:    "/assets/templates/bloom/bl-cartoncino-body.webp",
  line:    "/assets/templates/bloom/bl-cartoncino-line.webp",
  fascia:  "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  crnInk:  "/assets/templates/bloom/bl-data-cornice-ink.webp",
  crnLeaf: "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  fiocco:  "/assets/templates/bloom/bl-fiocco-ink.webp",
  lungo:   "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba: "/assets/templates/bloom/bl-colomba-ink.webp",
  wave:    "/assets/templates/bloom/bl-wave.svg",
};

// ── Originele Bloom CSS tokens (exact uit 35ozw36qxkrc0.css) ─────────────────
const C = {
  // Bloom gold (roze-goud)
  gold:    "#cf8fa2",   // --c-gold-500 (= --t-accent)
  gold4:   "#dba7b6",   // --c-gold-400
  gold3:   "#e8c3cd",   // --c-gold-300
  // Bloom ink (donker roze-bruin)
  ink9:    "#4a3a3a",   // --c-ink-900
  ink7:    "#6a5555",   // --c-ink-700
  ink5:    "#857070",   // --c-ink-500
  // Bloom ivory
  iv0:     "#fffbf9",   // basis ivoor (color-mix resultaat)
  iv1:     "#fbf8f6",   // --c-ivory-100
  iv2:     "#f3eeea",   // --c-ivory-200
  iv3:     "#e6dfda",   // --c-ivory-300
  iv4:     "#cdc3bd",   // --c-ivory-400
  // Muziek intro achtergrond (Sponsalia origineel)
  introBg: "#eae2d7",
  // Busta kleuren voor avorio-rosa (uit Sponsalia busta config)
  bustaInner: "rgb(218, 197, 191)",
  bustaPanel: "rgb(219, 200, 193)",
};

// ── avorio-rosa WebGL config (EXACT uit Sponsalia broncode 0gmywydibhbww.js) ──
const SEAL_CFG = {
  fps:    24,
  aspect: 0.562963,
  clear:  3.46,                  // invito:cover-cue tijdstip
  inner:  "rgb(218, 197, 191)",
  panel:  "rgb(219, 200, 193)",
  anchorPage: true,
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
  ] as [number, number][],
};

// ── WebGL shaders (EXACT uit Sponsalia broncode) ───────────────────────────────
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

// ── RGB string → [r,g,b] normaliseer (Sponsalia k() functie) ─────────────────
function parseRgb(s: string): [number, number, number] {
  const m = s.match(/(\d+)\D+(\d+)\D+(\d+)/);
  return m ? [+m[1]/255, +m[2]/255, +m[3]/255] : [.85,.83,.78];
}

// ── WebGL scale functie (Sponsalia origineel) ─────────────────────────────────
function calcScale(
  videoAspect: number,
  cw: number, ch: number,
  svh: number,
  alignBottom = false,
) {
  if (!(cw > 0) || !(ch > 0) || !(svh > 0)) {
    return { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
  }
  const u = Math.min(ch, svh);
  if (cw <= 600 && svh > cw || videoAspect > cw / u) {
    const t = cw / videoAspect / u;
    return { scaleX: 1, scaleY: t, offsetX: 0, offsetY: alignBottom && t > 1 ? 1 - t : (1 - t) / 2 };
  }
  const t = videoAspect * u / cw;
  return { scaleX: t, scaleY: 1, offsetX: (1 - t) / 2, offsetY: 0 };
}

// ── Sponsalia CSS klassen op <html> voor busta animatie ───────────────────────
const HAS_BUSTA_FIOCCO = "has-busta-fiocco";
const HAS_BUSTA_PANEL  = "has-busta-panel";

// ── WebGL busta engine (exact Sponsalia implementatie) ────────────────────────
function startBustaEngine(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  cfg: typeof SEAL_CFG,
  onCueClear: () => void,
  onError: (e: unknown) => void,
) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
  if (!gl) { onError("no webgl"); return null; }

  function makeShader(type: number, src: string) {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (gl.deleteShader(s), null);
  }
  const vs = makeShader(gl.VERTEX_SHADER, VERT_SRC);
  const fs = makeShader(gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) { onError("shader"); return null; }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { onError("link"); return null; }
  gl.useProgram(prog);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uScale  = gl.getUniformLocation(prog, "uScale");
  const uOffset = gl.getUniformLocation(prog, "uOffset");
  const uInner  = gl.getUniformLocation(prog, "uInner");
  const uOutside= gl.getUniformLocation(prog, "uOutside");

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0);
  gl.uniform3fv(uInner,   parseRgb(cfg.inner));
  gl.uniform3fv(uOutside, parseRgb(cfg.panel ?? cfg.inner));

  // Sponsalia: CSS variabelen op <html> element
  const root = document.documentElement;
  root.classList.add(HAS_BUSTA_FIOCCO);
  root.style.setProperty("--busta-inner", cfg.inner);
  if (cfg.panel) {
    root.classList.add(HAS_BUSTA_PANEL);
    root.style.setProperty("--busta-panel", cfg.panel);
  }

  // Viewport hoogte tracking (Sponsalia: busta-vh, busta-origin-y, busta-cover-h)
  let maxVh = 0;
  const updateVh = () => {
    const vh = document.documentElement.clientHeight || window.innerHeight || 0;
    root.style.setProperty("--busta-vh", `${vh}px`);
    root.style.setProperty("--busta-origin-y", `${(vh / 2).toFixed(2)}px`);
    maxVh = Math.max(maxVh, vh, window.innerHeight || 0);
    root.style.setProperty("--busta-cover-h", `${maxVh}px`);
  };
  updateVh();
  window.addEventListener("resize", updateVh);

  let rafId = 0, frameIdx = 0, hasLivePixels = false;
  let gw = 0, gh = 0, lastTime = -1;
  const pixBuf = new Uint8Array(4);
  let stuckTimer = performance.now();

  const frame = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nw = Math.round(canvas.clientWidth * dpr);
    const nh = Math.round(canvas.clientHeight * dpr);
    if (nw !== gw || nh !== gh) {
      gw = nw; gh = nh;
      canvas.width = nw; canvas.height = nh;
      gl.viewport(0, 0, nw, nh);
    }

    // Video frame upload
    if (video.readyState >= 2 && video.videoWidth > 0 && !video.ended &&
        video.currentTime + 1e-4 >= lastTime) {
      lastTime = video.currentTime;
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      } catch (e) { onError(e); return; }
    }

    const cw = canvas.clientWidth || 1, ch = canvas.clientHeight || 1;
    const svh = window.innerHeight || ch;
    const u = Math.min(ch, svh);
    const sc = calcScale(cfg.aspect, cw, ch, svh);
    const f = u / ch;

    gl.uniform2f(uScale,  sc.scaleX, sc.scaleY * f);
    gl.uniform2f(uOffset, sc.offsetX, sc.offsetY * f);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Sponsalia: check of pixels zichtbaar zijn voordat busta animatie start
    if (!hasLivePixels && gw > 0 && gh > 0) {
      const px = Math.min(gw - 1, Math.max(0, Math.round((sc.offsetX + sc.scaleX / 2) * gw)));
      const py = gh - 1 - Math.min(gh - 1, Math.max(0, Math.round((sc.offsetY * f + sc.scaleY * f / 2) * gh)));
      gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixBuf);
      if (pixBuf[3] > 8) {
        hasLivePixels = true;
        onCueClear();
      }
      if (!hasLivePixels && performance.now() - stuckTimer > 4000) {
        onCueClear(); // veiligheid: sowieso doorgaan na 4s
      }
    }

    // Sponsalia: busta-scale + busta-dy uit track data
    if (cfg.anchorPage && hasLivePixels) {
      const idx = video.ended
        ? cfg.track.length - 1
        : Math.max(frameIdx, Math.min(cfg.track.length - 1, Math.round(video.currentTime * cfg.fps)));
      frameIdx = idx;
      const [tx, ty] = cfg.track[idx];
      root.style.setProperty("--busta-scale", String(tx));
      root.style.setProperty("--busta-dy", `${((ty - 0.5) * u).toFixed(2)}px`);
    }

    rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);

  return {
    stop() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateVh);
      // Reset Sponsalia HTML klassen
      root.classList.remove(HAS_BUSTA_FIOCCO, HAS_BUSTA_PANEL);
      root.style.removeProperty("--busta-scale");
      root.style.removeProperty("--busta-dy");
      root.style.removeProperty("--busta-vh");
      root.style.removeProperty("--busta-origin-y");
      root.style.removeProperty("--busta-cover-h");
      root.style.removeProperty("--busta-inner");
      root.style.removeProperty("--busta-panel");
      try {
        gl.deleteTexture(tex);
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      } catch (_) {}
    },
  };
}

// ── useBlobSrc — Sponsalia fetch → blob URL (CORS-vrij) ──────────────────────
function useBlobSrc(url: string, enabled: boolean): string | undefined {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!enabled || !url) return;
    if (typeof fetch === "undefined" || typeof URL?.createObjectURL === "undefined") return;

    const nav = navigator as any;
    if (nav.connection?.saveData) return;
    if (nav.connection?.effectiveType && /^(slow-)?2g$/.test(nav.connection.effectiveType)) return;

    const ctrl = new AbortController();
    let objectUrl: string | undefined;
    const isMounted = { current: true };

    fetch(url, { signal: ctrl.signal, mode: "cors", credentials: "omit" })
      .then(r => r.ok ? r.blob() : Promise.reject(r.status))
      .then(blob => {
        if (!ctrl.signal.aborted && isMounted.current) {
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        }
      })
      .catch(() => {});

    return () => {
      isMounted.current = false;
      ctrl.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, enabled]);

  return blobUrl;
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

// ════════════════════════════════════════════════════════════════════════════════
export default function BloomInvite({
  namen, datumLang, weddingTime, venue, stad, address,
  welcomeMessage, events = [], color = "#cf8fa2",
  showRsvp = true, showPhotos = true, showMessages = true,
  showCountdown = true, demoMode = false,
  onRsvp, onMessage, onPhotoUpload,
}: BloomInviteProps) {

  // ── Intro staten ──────────────────────────────────────────────────────────
  const [isStarted,  setIsStarted]  = useState(false);
  const [isClosing,  setIsClosing]  = useState(false);
  const [isLive,     setIsLive]     = useState(false);     // canvas rendert actief
  const [introDone,  setIntroDone]  = useState(demoMode);
  const [heroIn,     setHeroIn]     = useState(demoMode);
  const [musicPlay,  setMusicPlay]  = useState(false);
  const [reducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // ── RSVP / berichten ──────────────────────────────────────────────────────
  const [rsvpName,   setRsvpName]   = useState("");
  const [rsvpDiet,   setRsvpDiet]   = useState("");
  const [rsvpChoice, setRsvpChoice] = useState<"yes"|"no"|null>(null);
  const [rsvpDone,   setRsvpDone]   = useState(false);
  const [msgText,    setMsgText]    = useState("");
  const [msgSent,    setMsgSent]    = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [countdown,  setCountdown]  = useState({ days:0, hours:0, min:0, sec:0 });

  // ── Refs ───────────────────────────────────────────────────────────────────
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const audioRef    = useRef<HTMLAudioElement>(null);
  const engineRef   = useRef<{ stop: () => void } | null>(null);
  const introRef    = useRef<HTMLDivElement>(null);
  const countRef    = useRef<ReturnType<typeof setInterval>>();
  const sectRefs    = useRef<Record<string, HTMLElement | null>>({});
  const cueFiredRef = useRef(false);
  const videoLoaded = useRef(false);

  // ── useBlobSrc voor video ─────────────────────────────────────────────────
  const blobUrl  = useBlobSrc(VIDEO_URL, !demoMode);
  const videoSrc = blobUrl ?? VIDEO_URL;

  // ── Body scroll lock (Sponsalia: html+body overflow:hidden) ───────────────
  useEffect(() => {
    if (introDone) return;
    const h = document.documentElement, b = document.body;
    const ph = h.style.overflow, pb = b.style.overflow;
    h.style.overflow = "hidden"; b.style.overflow = "hidden";
    return () => { h.style.overflow = ph; b.style.overflow = pb; };
  }, [introDone]);

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const getDate = () => {
      const el = document.querySelector("[data-wedding-date]") as HTMLElement | null;
      if (el) return new Date(el.dataset.weddingDate!);
      return (window as any).__bloomWeddingDate ? new Date((window as any).__bloomWeddingDate) : null;
    };
    const tick = () => {
      const t = getDate();
      if (!t) return;
      const diff = t.getTime() - Date.now();
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

  // ── IntersectionObserver bottom nav ───────────────────────────────────────
  useEffect(() => {
    if (!introDone) return;
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.35 }
    );
    Object.values(sectRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [introDone]);

  // ── cover-cue handler (Sponsalia: invito:cover-cue) ───────────────────────
  const onCoverCue = useCallback(() => {
    if (cueFiredRef.current) return;
    cueFiredRef.current = true;
    setHeroIn(true);
    setTimeout(() => setIsClosing(true), 80);
  }, []);

  // ── WebGL engine starten ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isStarted) return;
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;

    setIsLive(true);
    engineRef.current?.stop();
    engineRef.current = startBustaEngine(canvas, video, SEAL_CFG, onCoverCue, console.warn);

    return () => { engineRef.current?.stop(); engineRef.current = null; };
  }, [isStarted, onCoverCue]);

  // ── Tap handler ────────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    if (isStarted) return;
    setIsStarted(true);

    if (reducedMotion) {
      setHeroIn(true); setIntroDone(true);
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
      setMusicPlay(true);
    }

    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        onCoverCue();
        setTimeout(() => setIntroDone(true), 900);
      });
    };

    if (videoLoaded.current || video.readyState >= 3) {
      tryPlay();
    } else {
      video.load();
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    // Veiligheids-timeout
    setTimeout(() => {
      if (!cueFiredRef.current) {
        onCoverCue();
        setTimeout(() => setIntroDone(true), 900);
      }
    }, 15000);
  }, [isStarted, reducedMotion, onCoverCue]);

  // ── onTransitionEnd (Sponsalia: opacity → introDone) ──────────────────────
  const handleIntroTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === "opacity" && isClosing) {
      engineRef.current?.stop(); engineRef.current = null;
      setIntroDone(true);
    }
  }, [isClosing]);

  // ── Video events ───────────────────────────────────────────────────────────
  const handleVideoEnd = useCallback(() => {
    if (!cueFiredRef.current) onCoverCue();
    setTimeout(() => setIsClosing(true), 150);
  }, [onCoverCue]);

  // ── Muziek toggle ──────────────────────────────────────────────────────────
  const toggleMusic = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlay) { audio.pause(); setMusicPlay(false); }
    else { audio.play().catch(() => {}); setMusicPlay(true); }
  }, [musicPlay]);

  // ── Reveal animatie ────────────────────────────────────────────────────────
  const reveal = useCallback((delay: number): React.CSSProperties => ({
    opacity:   heroIn ? 1 : 0,
    transform: heroIn ? "none" : "translateY(26px)",
    transition: heroIn
      ? `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s`
      : "none",
    willChange: "opacity, transform",
  }), [heroIn]);

  const scrollTo = (id: string) =>
    sectRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  // ── Input stijl ───────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    border: 0,
    borderBottom: `1px solid ${C.iv4}`,
    borderRadius: 0,
    padding: "0.85em 0",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    background: "transparent",
    color: C.ink9,
    transition: "border-color 0.2s ease",
  };

  // ── Sectie stijl (cartoncino look — Sponsalia .count, .dress, .foot) ──────
  // Sponsalia gebruikt mask-border (webkit-mask-box-image) voor de cartoncino randen
  // We kunnen dit niet via inline CSS doen maar geven het via een CSS class
  const sectionWrap: React.CSSProperties = {
    position: "relative",
    isolation: "isolate",
    background: C.iv0,
    color: C.ink9,
    paddingBlock: "clamp(5.5rem, 22vw, 11rem)",
    paddingInline: "8.7%",
  };

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── GLOBALE CSS (exact Sponsalia structuur) ────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');

        /* ── Sponsalia invito base ─────────────────────────────── */
        .invito {
          -webkit-text-size-adjust: 100%;
          scroll-behavior: smooth;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1rem, .96rem + .35vw, 1.18rem);
          line-height: 1.5;
          color: ${C.ink9};
          background: ${C.iv0};
          -webkit-font-smoothing: antialiased;
          overflow-x: clip;
        }
        .invito *, .invito :before, .invito :after { box-sizing: border-box; }
        .invito * { margin: 0; padding: 0; }
        .invito img, .invito svg { max-width: 100%; display: block; }

        /* ── Music intro (exact Sponsalia 2yefap4x7aw-3.css) ───── */
        .music-intro {
          z-index: 200;
          isolation: isolate;
          text-align: center;
          padding: var(--edge, 1.25rem);
          color: #3f3a33;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: none;
          transition: opacity var(--cover-dissolve, .9s) cubic-bezier(0.16,1,0.3,1);
          background: ${C.introBg};
          place-items: center;
          display: grid;
          position: fixed;
          inset: 0;
        }
        .music-intro.is-closing { opacity: 0; pointer-events: none; }

        .music-intro--keyed { background-color: ${C.bustaPanel}; }
        .music-intro--keyed.is-live { background-color: transparent; }
        .music-intro--keyed .music-intro__video { opacity: 0; }

        .music-intro__key {
          width: 100%; height: 100%;
          display: block;
          position: absolute; inset: 0;
        }
        .music-intro__video {
          object-fit: cover;
          background: ${C.introBg};
          width: 100%; height: 100%;
          position: absolute; inset: 0;
        }
        .music-intro__caption {
          z-index: 1;
          pointer-events: none;
          position: absolute; inset: 0;
          transition: opacity .9s cubic-bezier(0.16,1,0.3,1) 1.5s;
        }
        .music-intro.is-started .music-intro__caption { opacity: 0; }

        .music-intro__names {
          text-align: center;
          width: min(78%, 22rem);
          font-family: 'Pinyon Script', cursive;
          color: #3f3a33;
          overflow-wrap: break-word;
          margin: 0;
          font-size: clamp(1.5rem, 7.5vw, 2.4rem);
          font-weight: 400;
          line-height: 1.05;
          position: absolute;
          top: 21%; left: 50%;
          transform: translate(-50%);
        }
        .music-intro__hint {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: clamp(0.72rem, 2.5vw, 0.85rem);
          color: #6f665a;
          margin: 0;
          animation: 2.4s ease-in-out infinite music-hint;
          position: absolute;
          bottom: 16%; left: 50%;
          transform: translate(-50%);
          white-space: nowrap;
        }
        .music-intro.is-started .music-intro__hint { opacity: 0; }

        @keyframes music-hint {
          0%, 100% { opacity: .5; }
          50% { opacity: 1; }
        }

        /* ── Music toggle (exact Sponsalia) ────────────────────── */
        .music-toggle {
          left: clamp(1.25rem, .5rem + 4vw, 6rem);
          bottom: calc(env(safe-area-inset-bottom,0px) + 5.25rem);
          z-index: 95;
          background: ${C.iv1};
          width: 3rem; height: 3rem;
          color: ${C.gold};
          border: 1px solid ${C.iv4};
          box-shadow: 0 1px 2px rgba(34,13,15,.04), 0 8px 30px -12px rgba(34,13,15,.18);
          cursor: pointer;
          transition: transform .2s cubic-bezier(0.16,1,0.3,1), color .2s cubic-bezier(0.16,1,0.3,1);
          border-radius: 50%;
          place-items: center;
          padding: 0;
          display: grid;
          position: fixed;
        }
        .music-toggle[hidden] { display: none; }
        .music-toggle:hover { transform: scale(1.06); }
        .music-toggle:not(.is-playing) {
          animation: music-pulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        .music-toggle__bars {
          align-items: flex-end;
          gap: 2px; height: .9rem; display: flex;
        }
        .music-toggle__bars > span {
          background: currentColor;
          border-radius: 1px; width: 3px;
        }
        .music-toggle__bars > span:first-child  { height: 45%; }
        .music-toggle__bars > span:nth-child(2) { height: 90%; }
        .music-toggle__bars > span:nth-child(3) { height: 60%; }
        .music-toggle.is-playing .music-toggle__bars > span {
          animation: music-bar .9s ease-in-out infinite;
        }
        .music-toggle.is-playing .music-toggle__bars > span:nth-child(2) { animation-delay: .15s; }
        .music-toggle.is-playing .music-toggle__bars > span:nth-child(3) { animation-delay: .3s; }

        @keyframes music-bar   { 0%,100%{height:30%} 50%{height:100%} }
        @keyframes music-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }

        /* ── Bloom module root (exact 35ozw36qxkrc0.css) ──────── */
        .bl-root {
          --c-wine-900: color-mix(in oklab, ${C.gold} 24%, #2b1a20);
          --c-gold-500: ${C.gold};
          --c-gold-400: ${C.gold4};
          --c-gold-300: ${C.gold3};
          --c-ink-900: ${C.ink9};
          --c-ink-700: ${C.ink7};
          --c-ink-500: ${C.ink5};
          --c-ivory-50: ${C.iv0};
          --c-ivory-100: ${C.iv1};
          --c-ivory-200: ${C.iv2};
          --c-ivory-300: ${C.iv3};
          --c-ivory-400: ${C.iv4};
          --art-ink: ${C.gold};
          --bl-art: no-repeat center / cover;
          --font-display: "Cormorant Garamond", Georgia, serif;
          --font-serif: "Cormorant Garamond", Georgia, serif;
          --font-script: "Pinyon Script", "Segoe Script", cursive;
          --bl-mano: "Pinyon Script", "Segoe Script", cursive;
          background: ${C.iv0};
          position: relative;
        }

        /* ── bl-hero (exact Sponsalia) ──────────────────────────── */
        .bl-hero {
          isolation: isolate;
          min-height: calc(100 * var(--svh, 1svh));
          padding: clamp(1.5rem, calc(6 * var(--svh, 1svh)), 4rem) clamp(1rem, 5vw, 3rem);
          background: ${C.iv0};
          color: ${C.ink9};
          place-items: center;
          display: grid;
          position: relative;
        }
        .bl-hero:after { content: none; }

        /* ── bl-panel (exact Sponsalia) ──────────────────────────── */
        .bl-panel {
          position: absolute; inset: 0;
          container-type: size;
        }
        .bl-panel__ink, .bl-panel__leaf {
          pointer-events: none;
          position: absolute; inset: 0;
        }
        .bl-panel__ink {
          background-color: ${C.gold};
          -webkit-mask: var(--bl-art);
          mask: var(--bl-art);
          -webkit-mask-image: url(${B.ink});
          mask-image: url(${B.ink});
        }
        .bl-panel__leaf {
          background: var(--bl-art);
          background-image: url(${B.leaf});
        }
        .bl-panel__text {
          text-align: center;
          overflow-wrap: anywhere;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: .45em;
          display: flex;
          position: absolute;
          inset: 26% 22% 32%;
          container-type: size;
        }
        /* Fontsizes via container queries (exact Sponsalia) */
        .bl-panel__text .hero__names {
          font-family: var(--font-script);
          font-weight: 400;
          font-size: calc(min(20cqi, 100cqi / var(--name-ch, 8) * 1.28));
          color: ${C.ink9};
          margin: 0;
          line-height: 1.02;
          justify-items: center;
          width: 100%;
        }
        .bl-panel__text .hero__eyebrow {
          max-inline-size: 76%;
          font-family: var(--font-serif);
          color: ${C.ink9};
          letter-spacing: .16em;
          text-transform: uppercase;
          font-size: calc(4.8cqi);
          margin-inline: auto;
          margin: 0;
          line-height: 1.5;
        }
        .bl-panel__text .hero__meta {
          max-inline-size: 88%;
          font-family: var(--font-serif);
          color: ${C.ink9};
          letter-spacing: .12em;
          text-transform: uppercase;
          font-size: calc(4.6cqi);
          flex-direction: column;
          align-items: center;
          gap: .5em;
          margin-inline: auto;
          display: flex;
        }
        .bl-panel__text .hero__kicker {
          font-family: var(--font-serif);
          color: ${C.ink9};
          font-size: calc(5.6cqi);
          margin: 0;
        }

        /* ── data-reveal animatie (exact Sponsalia 2yefap4x7aw-3.css) ── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(var(--reveal-shift, 26px));
          transition: opacity var(--dur-3, .9s) cubic-bezier(0.16,1,0.3,1),
                      transform var(--dur-3, .9s) cubic-bezier(0.16,1,0.3,1);
          transition-delay: var(--reveal-delay, 0s);
          will-change: opacity, transform;
        }
        [data-reveal].is-in {
          opacity: 1;
          transform: none;
        }
        .bl-hero [data-reveal] {
          transition-duration: var(--hero-reveal-dur, .55s);
          transition-timing-function: cubic-bezier(0.16,1,0.3,1);
          transition-delay: 0s;
          transform: none;
        }

        /* ── .bl-lungo — lange strik ────────────────────────────── */
        .bl-lungo {
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        /* ── Bloom sections (count/dress/foot stijl) ────────────── */
        /* Sponsalia gebruikt mask-border voor cartoncino randen */
        .bl-section {
          isolation: isolate;
          background: ${C.iv0};
          color: ${C.ink9};
          padding-block: clamp(5.5rem, 22vw, 11rem);
          padding-inline: 8.7%;
          position: relative;
        }
        /* Fascia achtergrond (striped ink mask) */
        .bl-section:before {
          content: "";
          z-index: -3;
          pointer-events: none;
          background-color: color-mix(in oklab, ${C.gold} 42%, ${C.iv0});
          position: absolute; inset: 0;
          -webkit-mask: url(${B.fascia}) 50%/116% 100% repeat-x;
          mask: url(${B.fascia}) 50%/116% 100% repeat-x;
        }
        /* Cartoncino-body: .count>.wrap:before */
        .bl-section__wrap {
          z-index: 1;
          width: 100%;
          max-width: none;
          padding-block: clamp(4rem, 12vw, 6rem);
          padding-inline: clamp(3rem, 11vw, 5rem);
          position: relative;
        }
        /* webkit-mask-box-image voor cartoncino look */
        .bl-section__wrap:before {
          content: "";
          z-index: -2;
          pointer-events: none;
          background-color: ${C.iv0};
          position: absolute; inset: 0;
          -webkit-mask-box-image: url(${B.body}) 459 150 fill / clamp(90px,28.2vw,380px) clamp(28px,9.2vw,120px);
          mask-border: url(${B.body}) 459 150 fill / clamp(90px,28.2vw,380px) clamp(28px,9.2vw,120px);
        }
        .bl-section__wrap:after {
          content: "";
          z-index: -1;
          pointer-events: none;
          background-color: color-mix(in oklab, ${C.gold} 88%, ${C.iv0});
          position: absolute; inset: 0;
          -webkit-mask-box-image: url(${B.line}) 459 150 fill / clamp(90px,28.2vw,380px) clamp(28px,9.2vw,120px);
          mask-border: url(${B.line}) 459 150 fill / clamp(90px,28.2vw,380px) clamp(28px,9.2vw,120px);
        }

        /* ── Sindex (sectie titel) ────────────────────────────────── */
        .bl-sindex {
          text-align: center;
          justify-items: center;
          gap: 0.5rem;
          grid-template-columns: 1fr;
          display: grid;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .bl-sindex__num {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 0.84rem;
          text-transform: uppercase;
          letter-spacing: .34em;
          color: ${C.gold};
          order: 0;
        }
        .bl-sindex__title {
          font-family: var(--bl-mano, 'Pinyon Script', cursive);
          font-size: calc(2rem * 1.25);
          color: ${C.ink9};
          font-weight: 400;
          letter-spacing: .01em;
          line-height: 1.15;
          order: 1;
        }
        /* Golvende lijn (Sponsalia SVG data-URI mask) */
        .bl-sindex__rule {
          block-size: 6px;
          inline-size: 150px;
          background: ${C.gold};
          order: 2;
          margin-block-start: 0.5rem;
          -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 6' preserveAspectRatio='none'%3E%3Cpath d='M2 4 C 40 1 80 5 120 3 C 160 1 195 4 218 2' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 50%/100% 100% no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 6' preserveAspectRatio='none'%3E%3Cpath d='M2 4 C 40 1 80 5 120 3 C 160 1 195 4 218 2' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 50%/100% 100% no-repeat;
        }

        /* ── Travel details cornice (exact Sponsalia) ────────────── */
        .bl-travel-details {
          padding-block: calc(clamp(2.5rem, 11vw, 4.5rem));
          place-items: center;
          display: grid;
          position: relative;
          text-align: center;
        }
        .bl-travel-details:before, .bl-travel-details:after {
          content: "";
          inline-size: min(100%, 34rem);
          aspect-ratio: 1400 / 963;
          pointer-events: none;
          z-index: 0;
          position: absolute;
          inset-block-start: 50%;
          inset-inline-start: 50%;
          translate: -50% -50%;
        }
        .bl-travel-details:before {
          background-color: ${C.gold};
          -webkit-mask: var(--bl-art);
          mask: var(--bl-art);
          -webkit-mask-image: url(${B.crnInk});
          mask-image: url(${B.crnInk});
          -webkit-mask-size: contain;
          mask-size: contain;
        }
        .bl-travel-details:after {
          background: 50%/contain no-repeat;
          background-image: url(${B.crnLeaf});
        }
        .bl-travel-details__inner {
          position: relative;
          z-index: 1;
        }

        /* ── Gift sectie (lange strik decoratie) ─────────────────── */
        .bl-gift {
          position: relative;
          overflow: hidden;
        }
        .bl-gift:after {
          content: "";
          inline-size: clamp(4rem, 17vw, 7.5rem);
          aspect-ratio: 201 / 900;
          z-index: 0;
          pointer-events: none;
          background-color: ${C.gold};
          -webkit-mask-image: url(${B.lungo});
          mask-image: url(${B.lungo});
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          position: absolute;
          inset-block-start: clamp(2rem, 8vw, 4rem);
          inset-inline-end: clamp(.25rem, 2vw, 1.5rem);
        }

        /* ── #program sindex (fiocco embleem) ───────────────────── */
        .bl-program-sindex:before {
          content: "";
          inline-size: calc(clamp(7rem, 36vw, 12rem));
          aspect-ratio: 571 / 457;
          background: 50%/contain no-repeat;
          background-color: ${C.gold};
          -webkit-mask: var(--bl-art);
          mask: var(--bl-art);
          -webkit-mask-image: url(${B.fiocco});
          mask-image: url(${B.fiocco});
          -webkit-mask-size: contain;
          mask-size: contain;
          order: -1;
          margin-block-end: -0.5rem;
        }

        /* ── #rsvp sindex (colomba embleem) ─────────────────────── */
        .bl-rsvp-sindex:before {
          content: "";
          inline-size: calc(clamp(6rem, 30vw, 10rem));
          aspect-ratio: 596 / 731;
          background: 50%/contain no-repeat;
          background-color: ${C.gold};
          -webkit-mask: var(--bl-art);
          mask: var(--bl-art);
          -webkit-mask-image: url(${B.colomba});
          mask-image: url(${B.colomba});
          -webkit-mask-size: contain;
          mask-size: contain;
          order: -1;
          margin-block-end: -0.5rem;
        }

        /* ── Bottom nav (exact Sponsalia) ────────────────────────── */
        .bottomnav {
          z-index: 90;
          padding-bottom: env(safe-area-inset-bottom, 0px);
          background: ${C.iv1};
          border-top: 1px solid ${C.iv4};
          box-shadow: 0 -1px 2px rgba(34,13,15,.04), 0 -8px 30px -12px rgba(34,13,15,.18);
          transition: transform .5s cubic-bezier(0.16,1,0.3,1),
                      opacity .5s cubic-bezier(0.16,1,0.3,1);
          justify-content: center;
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
        }
        .bottomnav__inner {
          width: 100%;
          max-width: 520px;
          justify-content: space-around;
          align-items: center;
          gap: clamp(.25rem, 2vw, 1.5rem);
          padding-inline: min(clamp(1.25rem,.5rem + 4vw,6rem), 3.5vw);
          flex-wrap: nowrap;
          display: flex;
        }
        .bottomnav a {
          min-width: 0;
          min-height: 44px;
          padding-block: .5rem;
          font-family: 'Cormorant Garamond', Georgia, serif;
          letter-spacing: .07em;
          text-transform: uppercase;
          text-align: center;
          color: ${C.ink5};
          transition: color .2s cubic-bezier(0.16,1,0.3,1);
          flex: auto;
          justify-content: center;
          align-items: center;
          font-size: clamp(.6rem,.42rem + 1.1vw,.82rem);
          line-height: 1.1;
          display: flex;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          position: relative;
        }
        .bottomnav a > span {
          transition: background-size .5s cubic-bezier(0.16,1,0.3,1);
          background-image: linear-gradient(currentColor, currentColor);
          background-position: 50% 100%;
          background-repeat: no-repeat;
          background-size: 0% 1.5px;
          padding-bottom: 2px;
        }
        .bottomnav a.is-active { color: ${C.gold}; }
        .bottomnav a.is-active > span { background-size: 100% 1.5px; }

        /* ── has-busta-fiocco CSS (exact Sponsalia) ─────────────── */
        html.has-busta-fiocco,
        html.has-busta-fiocco body {
          background: var(--busta-inner, ${C.bustaInner});
        }
        html.has-busta-fiocco .invito {
          translate: 0 var(--busta-dy, 0px);
          scale: var(--busta-scale, 1);
          transform-origin: 50% var(--busta-origin-y, 50%);
          will-change: translate, scale;
          overflow: visible;
        }
        html.has-busta-fiocco .invito > .music-intro {
          height: var(--busta-vh, calc(100 * var(--svh, 1svh)));
          translate: 0 calc(-1 * var(--busta-dy, 0px));
          scale: calc(1 / var(--busta-scale, 1));
          transform-origin: 50% var(--busta-origin-y, 50%);
          top: 0;
        }
        html.has-busta-fiocco .invito > .music-intro > .music-intro__key {
          height: var(--busta-cover-h, 100%);
        }
        html.has-busta-panel,
        html.has-busta-panel body {
          background: var(--busta-panel, ${C.bustaPanel});
        }
        html.has-busta-panel .invito {
          box-shadow: 0 10px 24px rgba(74,58,58,.3), 0 2px 6px rgba(74,58,58,.22);
        }

        /* ── Reducedmotion ───────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .music-intro { transition: none; }
          .music-intro__hint, .music-toggle__bars > span { animation: none !important; }
          [data-reveal] { transition: none !important; opacity: 1 !important; transform: none !important; }
          html.has-busta-fiocco .invito { translate: none; scale: 1; }
          html.has-busta-panel .invito { box-shadow: none; }
        }
      `}</style>

      {/* Audio */}
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        loop
        preload={isStarted ? "auto" : "none"}
        onPlay={() => setMusicPlay(true)}
        onPause={() => setMusicPlay(false)}
      />

      {/* ══ MAIN .invito wrapper ══════════════════════════════════════════════ */}
      <div className="invito bl-root">

        {/* ══ MUSIC-INTRO OVERLAY ══════════════════════════════════════════════
            Sponsalia: .music-intro.music-intro--keyed.is-started.is-closing
            Blijft in DOM tot opacity transitie voltooid is
        ══════════════════════════════════════════════════════════════════════ */}
        {!introDone && (
          <div
            ref={introRef}
            className={[
              "music-intro music-intro--keyed",
              isLive    ? "is-live"    : "",
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
            {/* canvas — WebGL keyed compositing */}
            <canvas ref={canvasRef} className="music-intro__key" aria-hidden />

            {/* video — hidden door canvas */}
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
              onCanPlay={() => { videoLoaded.current = true; }}
              onEnded={handleVideoEnd}
              onError={handleVideoEnd}
            />

            {/* Caption */}
            <div className="music-intro__caption">
              <p className="music-intro__names">{namen}</p>
              <p className="music-intro__hint">Tik om te openen</p>
            </div>
          </div>
        )}

        {/* Music toggle */}
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

        {/* ══ HERO — header.bl-hero ════════════════════════════════════════════ */}
        <header
          id="top"
          ref={el => { sectRefs.current["top"] = el; }}
          className="bl-hero"
          data-screen-label="Hero"
        >
          <div className="bl-panel">
            <span className="bl-panel__ink" aria-hidden />
            <span className="bl-panel__leaf" aria-hidden />
            <div className="bl-panel__text">
              <span
                className="eyebrow hero__eyebrow"
                data-reveal
                style={{ ...reveal(0.05) }}
              >
                Met liefde uitgenodigd
              </span>
              <h1
                className="hero__names"
                data-reveal
                style={{ ...reveal(0.45), "--name-ch": String(namen.length) } as any}
              >
                {namen}
              </h1>
              <span data-reveal style={{ ...reveal(0.65) }}>
                <img src={B.wave} alt="" aria-hidden style={{ width: "55%", opacity: .25, margin: "0 auto" }} />
              </span>
              <p className="hero__kicker" data-reveal style={{ ...reveal(0.90) }}>
                Wij gaan trouwen
              </p>
              <div className="hero__meta" data-reveal style={{ ...reveal(1.30) }}>
                {datumLang && <span data-reveal style={{ ...reveal(1.30) }}>{datumLang}</span>}
                {(venue || stad) && (
                  <span data-reveal style={{ ...reveal(1.65) }}>
                    {venue}{stad ? `, ${stad}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Lange strik decoratie */}
        <div className="bl-lungo" aria-hidden style={{ ...reveal(1.40), marginTop: -16, position: "relative", zIndex: 5 }}>
          <img
            src={B.lungo}
            alt=""
            style={{
              height: "clamp(52px, 10vw, 76px)",
              width: "auto",
              WebkitMaskImage: `url(${B.lungo})`,
              maskImage: `url(${B.lungo})`,
              opacity: 0,
              background: C.gold,
            }}
          />
          {/* Fallback voor browsers zonder mask-image */}
          <img
            src={B.lungo}
            alt=""
            style={{
              height: "clamp(52px, 10vw, 76px)",
              width: "auto",
              filter: `sepia(1) saturate(2) hue-rotate(330deg) brightness(1.05)`,
              opacity: 0.8,
              position: "absolute",
              top: 0,
            }}
          />
        </div>

        {/* ══ COUNTDOWN ══════════════════════════════════════════════════════ */}
        {showCountdown && countdown.days > 0 && (
          <section
            id="countdown"
            ref={el => { sectRefs.current["countdown"] = el; }}
            className="bl-section"
            style={{ marginBottom: 0 }}
          >
            <div className="bl-section__wrap">
              <div className="bl-sindex" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <span className="bl-sindex__num">Nog</span>
                <span className="bl-sindex__rule" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(.35rem,3cqi,1.4rem)", marginTop: 8 }}>
                {[
                  { v: countdown.days,  l: "dagen" },
                  { v: countdown.hours, l: "uren"  },
                  { v: countdown.min,   l: "min"   },
                  { v: countdown.sec,   l: "sec"   },
                ].map(({ v, l }) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem,12cqi,4.5rem)", color: C.gold, lineHeight: 1, margin: 0, fontVariantNumeric: "tabular-nums" }}>
                      {String(v).padStart(2, "0")}
                    </p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(.5rem,2.4cqi,.85rem)", color: C.ink5, marginTop: 4, letterSpacing: ".1em", textTransform: "uppercase" }}>
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ DATUM & LOCATIE (travel__details met cornice) ═════════════════ */}
        <section
          ref={el => { sectRefs.current["datum"] = el; }}
          className="section"
          style={{ padding: "clamp(2.5rem,11vw,4.5rem) clamp(1.25rem,.5rem + 4vw,6rem)", position: "relative" }}
        >
          <div className="bl-travel-details">
            <div className="bl-travel-details__inner">
              <div className="bl-sindex" style={{ display: "grid" }}>
                <span className="bl-sindex__num">Wanneer & Waar</span>
                <span className="bl-sindex__rule" />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,5vw,1.5rem)", color: C.ink9, margin: "0 0 6px", fontWeight: 400 }}>
                {datumLang}
              </p>
              {weddingTime && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: C.ink7, margin: "0 0 12px" }}>
                  Aanvang {weddingTime} uur
                </p>
              )}
              <img src={B.wave} alt="" aria-hidden style={{ width: "55%", opacity: .2, margin: "10px auto" }} />
              {venue && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,4.5vw,1.35rem)", color: C.ink9, margin: "0 0 4px" }}>
                  {venue}
                </p>
              )}
              {stad && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: C.ink7, margin: 0 }}>
                  {stad}
                </p>
              )}
              {address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address + " " + stad)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.82rem", letterSpacing: ".14em", color: C.gold, textDecoration: "none", textTransform: "uppercase" }}
                >
                  <MapPin size={12} /> Route bekijken
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ══ WELKOMSTBERICHT ═════════════════════════════════════════════════ */}
        {welcomeMessage && (
          <section style={{ padding: "0 clamp(1.25rem,.5rem + 4vw,6rem) 2rem" }}>
            <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
              <img src={B.fiocco} alt="" aria-hidden style={{ width: 36, margin: "0 auto 12px", opacity: .25,
                filter: "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.05)" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,4vw,1.2rem)", fontStyle: "italic", color: C.ink7, lineHeight: 1.8, margin: 0 }}>
                "{welcomeMessage}"
              </p>
              <div style={{ marginTop: 14 }}>
                <img src={B.wave} alt="" aria-hidden style={{ width: "42%", opacity: .18, margin: "0 auto" }} />
              </div>
            </div>
          </section>
        )}

        {/* ══ PROGRAMMA ═══════════════════════════════════════════════════════ */}
        {events.length > 0 && (
          <section
            id="program"
            ref={el => { sectRefs.current["program"] = el; }}
            className="bl-section"
          >
            <div className="bl-section__wrap">
              <div className="bl-sindex bl-program-sindex" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <span className="bl-sindex__num">Programma</span>
                <span className="bl-sindex__title">Vandaag</span>
                <span className="bl-sindex__rule" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {events.map(ev => (
                  <div key={ev.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "baseline", paddingBlock: "1rem", borderTop: `1px solid color-mix(in oklab, ${C.ink9} 16%, transparent)` }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,4vw,1.5rem)", color: C.ink9, whiteSpace: "nowrap" }}>
                      {ev.start_time}
                    </span>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,4vw,1.5rem)", margin: "0 0 2px" }}>{ev.name}</p>
                      {ev.venue && <p style={{ fontSize: "0.9rem", color: C.ink5, margin: 0 }}>{ev.venue}{ev.city ? `, ${ev.city}` : ""}</p>}
                      {ev.description && <p style={{ fontSize: "0.85rem", color: C.ink5, marginTop: 3, lineHeight: 1.5 }}>{ev.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ RSVP ════════════════════════════════════════════════════════════ */}
        {showRsvp && (
          <section
            id="rsvp"
            ref={el => { sectRefs.current["rsvp"] = el; }}
            className="bl-section"
          >
            <div className="bl-section__wrap">
              <div className="bl-sindex bl-rsvp-sindex" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <span className="bl-sindex__num">Aanwezigheid</span>
                <span className="bl-sindex__title">Ben jij erbij?</span>
                <span className="bl-sindex__rule" />
              </div>

              {rsvpDone ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <Heart size={28} style={{ color: C.gold, margin: "0 auto 12px", display: "block" }} />
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.ink9 }}>
                    Bedankt voor je bevestiging!
                  </p>
                </div>
              ) : (
                <>
                  <div className="field" style={{ display: "grid", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <label className="field__label" style={{ fontSize: ".72rem", letterSpacing: ".32em", textTransform: "uppercase", color: C.ink5 }}>Naam</label>
                    <input
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      placeholder="Jouw naam"
                      style={inp}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
                    {[
                      { val: "yes" as const, label: "Ik kom!" },
                      { val: "no"  as const, label: "Ik kan niet" },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        onClick={() => setRsvpChoice(val)}
                        className="choice__opt"
                        aria-pressed={rsvpChoice === val}
                        style={{
                          background: rsvpChoice === val ? (val === "yes" ? C.gold : C.ink7) : "transparent",
                          color: rsvpChoice === val ? C.iv1 : C.ink5,
                          border: `1px solid color-mix(in oklab, ${C.ink9} 16%, transparent)`,
                          borderRadius: 2,
                          padding: ".7em 1.6em",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "0.84rem",
                          letterSpacing: ".18em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          minHeight: 44,
                          transition: "background .2s, color .2s",
                        }}
                      >
                        {rsvpChoice === val && val === "yes" && <Check size={12} style={{ marginRight: 4 }} />}
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="field" style={{ display: "grid", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <label className="field__label" style={{ fontSize: ".72rem", letterSpacing: ".32em", textTransform: "uppercase", color: C.ink5 }}>Dieetwensen (optioneel)</label>
                    <input
                      value={rsvpDiet}
                      onChange={e => setRsvpDiet(e.target.value)}
                      placeholder="Vegetarisch, allergieën..."
                      style={inp}
                    />
                  </div>

                  <button
                    onClick={async () => { await onRsvp?.(rsvpChoice === "yes", rsvpName, rsvpDiet); setRsvpDone(true); }}
                    disabled={!rsvpName || rsvpChoice === null}
                    className="btn"
                    style={{
                      background: (!rsvpName || rsvpChoice === null) ? C.iv4 : C.gold,
                      color: C.iv1,
                      border: "none",
                      borderRadius: 2,
                      padding: ".95em 2.1em",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.84rem",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      cursor: (!rsvpName || rsvpChoice === null) ? "default" : "pointer",
                      width: "100%",
                      transition: "background .2s",
                    }}
                  >
                    Bevestigen
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {/* ══ FOTO ═══════════════════════════════════════════════════════════ */}
        {showPhotos && (
          <section
            id="photos"
            ref={el => { sectRefs.current["photos"] = el; }}
            className="bl-section"
          >
            <div className="bl-section__wrap" style={{ textAlign: "center" }}>
              <div className="bl-sindex" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <span className="bl-sindex__num">Herinneringen</span>
                <span className="bl-sindex__title">Deel een foto</span>
                <span className="bl-sindex__rule" />
              </div>
              <p style={{ color: C.ink5, fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Upload jouw favoriete moment van deze dag
              </p>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: `1px solid color-mix(in oklab, ${C.ink9} 16%, transparent)`,
                borderRadius: 2,
                padding: ".95em 2.1em",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.84rem",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: C.gold,
                cursor: "pointer",
              }}>
                <Camera size={14} />
                Foto kiezen
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => { if (e.target.files?.[0]) onPhotoUpload?.(e.target.files[0]); }}
                />
              </label>
            </div>
          </section>
        )}

        {/* ══ GASTENBOEK ══════════════════════════════════════════════════════ */}
        {showMessages && (
          <section
            id="messages"
            ref={el => { sectRefs.current["messages"] = el; }}
            className="bl-section"
          >
            <div className="bl-section__wrap">
              <div className="bl-sindex" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <span className="bl-sindex__num">Gastenboek</span>
                <span className="bl-sindex__title">Jouw bericht</span>
                <span className="bl-sindex__rule" />
              </div>

              {msgSent ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <img src={B.fiocco} alt="" aria-hidden style={{ width: 30, opacity: .25, filter: "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.05)", margin: "0 auto 10px", display: "block" }} />
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.ink7 }}>
                    Bedankt voor je bericht!
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    rows={3}
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    placeholder="Schrijf een persoonlijk bericht voor het bruidspaar..."
                    style={{ ...inp, resize: "vertical", marginBottom: 16, minHeight: 80, borderBottom: `1px solid ${C.iv4}`, border: 0, borderBottom: `1px solid ${C.iv4}` }}
                  />
                  <button
                    onClick={async () => { await onMessage?.(msgText, rsvpName || "Gast"); setMsgSent(true); setMsgText(""); }}
                    disabled={!msgText.trim()}
                    className="btn"
                    style={{
                      background: msgText.trim() ? C.gold : C.iv4,
                      color: C.iv1,
                      border: "none",
                      borderRadius: 2,
                      padding: ".95em 2.1em",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.84rem",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      cursor: msgText.trim() ? "pointer" : "default",
                      width: "100%",
                      transition: "background .2s",
                    }}
                  >
                    Bericht sturen
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
        <footer className="foot bl-section" style={{ textAlign: "center", paddingBottom: "clamp(3rem,12vw,6rem)" }}>
          <div className="bl-section__wrap">
            <p style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "clamp(2rem,8vw,3rem)", color: C.ink9, margin: "0 0 0.5rem" }}>
              {namen}
            </p>
            <img src={B.wave} alt="" aria-hidden style={{ width: "38%", opacity: .18, margin: "8px auto 16px" }} />
            <p style={{ fontSize: "0.72rem", letterSpacing: ".32em", textTransform: "uppercase", color: C.ink5 }}>
              {datumLang}
            </p>
            <p style={{ fontSize: "0.65rem", letterSpacing: ".22em", textTransform: "uppercase", color: C.ink5, marginTop: 24, opacity: .7 }}>
              Casa Nomada · Digitale trouwuitnodigingen
            </p>
          </div>
        </footer>

        {/* ══ BOTTOM NAV ══════════════════════════════════════════════════════ */}
        <nav className="bottomnav" aria-label="Navigatie" style={{ visibility: introDone ? "visible" : "hidden" }}>
          <div className="bottomnav__inner">
            {[
              { id: "top",      label: "Home"     },
              { id: "program",  label: "Programma" },
              { id: "rsvp",     label: "RSVP"     },
              { id: "photos",   label: "Foto's"   },
              { id: "messages", label: "Berichten" },
            ].map(({ id, label }) => (
              <a
                key={id}
                role="button"
                className={activeSection === id ? "is-active" : ""}
                onClick={e => { e.preventDefault(); scrollTo(id); }}
                tabIndex={0}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); scrollTo(id); } }}
              >
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>

      </div>{/* /.invito */}
    </>
  );
}
