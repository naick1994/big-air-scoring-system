import { useState, useRef, useEffect } from 'react';
import { X, Play, Film } from 'lucide-react';
import { Card } from '@/components/ui/card';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WooData {
  jumpLabel: string;
  jumpTime: string;
  maxHeight: number;
  airtime: number;
  distance: number;
  maxSpeed: number;
  approachSpeed: number;
  windAngle: number;
  quality: 'Good' | 'OK';
  peakTimeRatio: number;
}

interface AreaScore {
  name: string;
  score: number;
  maxScore: number;
  gradient: string;
}

interface JumpDemo {
  id: number;
  label: string;
  athlete: string;
  videoSrc?: string;
  score: number;
  penaltyNote?: string;
  areas: AreaScore[];
  woo: WooData;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEMO_JUMPS: JumpDemo[] = [
  {
    id: 1,
    label: 'Jump 1',
    athlete: 'Leonardo Casati',
    videoSrc: `${import.meta.env.BASE_URL}videos/LEO_8.07.mp4`,
    score: 8.07,
    areas: [
      { name: 'HEIGHT',       score: 1.47, maxScore: 2.00, gradient: 'from-blue-500 to-cyan-400' },
      { name: 'EXTREMITY',    score: 0.74, maxScore: 1.00, gradient: 'from-purple-500 to-pink-400' },
      { name: 'TECHNICALITY', score: 3.83, maxScore: 4.50, gradient: 'from-amber-500 to-yellow-400' },
      { name: 'EXECUTION',    score: 2.03, maxScore: 2.50, gradient: 'from-green-500 to-lime-400' },
    ],
    woo: {
      jumpLabel: 'Jump 22', jumpTime: '17:13',
      maxHeight: 17.5, airtime: 7.0, distance: 121, maxSpeed: 65,
      approachSpeed: 28, windAngle: 6, quality: 'Good', peakTimeRatio: 0.27,
    },
  },
  {
    id: 2,
    label: 'Jump 2',
    athlete: 'Leonardo Casati',
    videoSrc: `${import.meta.env.BASE_URL}videos/LEO_8.37.mp4`,
    score: 8.37,
    areas: [
      { name: 'HEIGHT',       score: 1.80, maxScore: 2.00, gradient: 'from-blue-500 to-cyan-400' },
      { name: 'EXTREMITY',    score: 0.76, maxScore: 1.00, gradient: 'from-purple-500 to-pink-400' },
      { name: 'TECHNICALITY', score: 3.85, maxScore: 4.50, gradient: 'from-amber-500 to-yellow-400' },
      { name: 'EXECUTION',    score: 1.96, maxScore: 2.50, gradient: 'from-green-500 to-lime-400' },
    ],
    woo: {
      jumpLabel: 'Jump 20', jumpTime: '17:02',
      maxHeight: 19.8, airtime: 7.5, distance: 83, maxSpeed: 52,
      approachSpeed: 30, windAngle: 11, quality: 'Good', peakTimeRatio: 0.31,
    },
  },
  {
    id: 3,
    label: 'Jump 3',
    athlete: 'Lorenzo Casati',
    videoSrc: `${import.meta.env.BASE_URL}videos/LORE_9.40.mp4`,
    score: 9.40,
    areas: [
      { name: 'HEIGHT',       score: 1.65, maxScore: 2.00, gradient: 'from-blue-500 to-cyan-400' },
      { name: 'EXTREMITY',    score: 0.95, maxScore: 1.00, gradient: 'from-purple-500 to-pink-400' },
      { name: 'TECHNICALITY', score: 4.40, maxScore: 4.50, gradient: 'from-amber-500 to-yellow-400' },
      { name: 'EXECUTION',    score: 2.40, maxScore: 2.50, gradient: 'from-green-500 to-lime-400' },
    ],
    woo: {
      jumpLabel: 'Jump 9', jumpTime: '16:47',
      maxHeight: 18.4, airtime: 6.8, distance: 94, maxSpeed: 56,
      approachSpeed: 28, windAngle: 19, quality: 'OK', peakTimeRatio: 0.29,
    },
  },
];

// ─── SVG trajectory helpers ───────────────────────────────────────────────────

const SW = 550, SH = 155, PL = 38, PR = 8, PT = 8, PB = 24;
const CW = SW - PL - PR;
const CH_SVG = SH - PT - PB;

function curvePath(r: number): string {
  const x0 = PL, xE = SW - PR;
  const yG = PT + CH_SVG, yP = PT + 4;
  const px = x0 + r * CW;
  const dx1 = px - x0, dx2 = xE - px;
  const ry = yG - yP;
  return [
    `M ${x0} ${yG}`,
    `C ${x0 + dx1 * 0.3} ${yG - ry * 0.8} ${px - dx1 * 0.1} ${yP} ${px} ${yP}`,
    `C ${px + dx2 * 0.1} ${yP} ${xE - dx2 * 0.3} ${yG - ry * 0.8} ${xE} ${yG}`,
  ].join(' ');
}

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, decimals = 0): string {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const dur = 1400, t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((target * e).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, decimals]);
  return val.toFixed(decimals);
}

// ─── Woo-style overlay ────────────────────────────────────────────────────────

function WooOverlay({ woo, gradId }: { woo: WooData; gradId: string }) {
  const [drawn, setDrawn] = useState(false);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDrawn(true), 80);
    const t2 = setTimeout(() => setStatsOn(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const height   = useCountUp(woo.maxHeight, statsOn, 1);
  const airtime  = useCountUp(woo.airtime,   statsOn, 1);
  const distance = useCountUp(woo.distance,  statsOn, 0);
  const speed    = useCountUp(woo.maxSpeed,  statsOn, 0);

  const yG = PT + CH_SVG;
  const maxTime = woo.airtime < 7.2 ? 7 : 8;
  const yStep = Math.round(woo.maxHeight / 4);
  const yLabels = [0, yStep, yStep * 2, yStep * 3, Math.round(woo.maxHeight)];
  const qualColor = woo.quality === 'Good' ? '#22c55e' : '#eab308';
  const path = curvePath(woo.peakTimeRatio);

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex flex-col"
      style={{ height: '58%' }}
    >
      {/* Fade gradient top edge */}
      <div className="flex-none h-10 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />

      {/* Main panel */}
      <div className="flex-1 bg-black/85 backdrop-blur-sm flex flex-col px-4 pt-2 pb-2 gap-1 min-h-0">

        {/* Header */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-white font-bold text-sm">{woo.jumpLabel}</span>
          <span className="text-zinc-400 text-xs">{woo.jumpTime} · Left</span>
        </div>

        {/* SVG chart */}
        <div className="flex-1 min-h-0">
          <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {yLabels.map((_, i) => {
              const y = PT + CH_SVG * (1 - i / (yLabels.length - 1));
              return <line key={i} x1={PL} y1={y} x2={SW - PR} y2={y} stroke="#3f3f46" strokeWidth="0.7" strokeDasharray="3 3" />;
            })}

            {/* Y labels */}
            {yLabels.map((lbl, i) => {
              const y = PT + CH_SVG * (1 - i / (yLabels.length - 1));
              return <text key={i} x={PL - 4} y={y + 3} textAnchor="end" fill="#71717a" fontSize="9">{lbl}m</text>;
            })}

            {/* X labels */}
            {Array.from({ length: maxTime + 1 }, (_, t) => (
              <text key={t} x={PL + (t / maxTime) * CW} y={SH - 3} textAnchor="middle" fill="#71717a" fontSize="9">{t}</text>
            ))}

            {/* Area fill */}
            <path d={path + ' Z'} fill={`url(#${gradId})`} />

            {/* Curve stroke — draws in on mount */}
            <path
              d={path}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                transition: drawn ? 'stroke-dashoffset 1.3s ease-out' : 'none',
              }}
            />

            {/* Peak dot */}
            {drawn && (() => {
              const px = PL + woo.peakTimeRatio * CW;
              return <circle cx={px} cy={PT + 4} r="3.5" fill="#22d3ee" style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.3s 1.3s' }} />;
            })()}
          </svg>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-4 gap-1 border-t border-zinc-700 pt-2 shrink-0"
          style={{ opacity: statsOn ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
        >
          {[
            { v: height,   u: 'm',   l: 'Height' },
            { v: airtime,  u: 's',   l: 'Airtime' },
            { v: distance, u: 'm',   l: 'Distance' },
            { v: speed,    u: 'kmh', l: 'Max speed' },
          ].map(({ v, u, l }) => (
            <div key={l} className="text-center">
              <div className="text-white font-black text-xl leading-none tabular-nums">
                {v}<span className="text-zinc-500 font-normal text-[10px] ml-0.5">{u}</span>
              </div>
              <div className="text-zinc-500 text-[9px] mt-0.5 uppercase tracking-wide">{l}</div>
            </div>
          ))}
        </div>

        {/* Bottom info row */}
        <div
          className="flex items-center gap-4 text-[10px] text-zinc-500 shrink-0"
          style={{ opacity: statsOn ? 1 : 0, transition: 'opacity 0.5s ease-in 0.2s' }}
        >
          <span>⏱ {woo.approachSpeed} kmh approach</span>
          <span>→ {woo.windAngle}° upwind</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: qualColor }} />
            <span style={{ color: qualColor }}>{woo.quality}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Replay prompt ────────────────────────────────────────────────────────────

function ReplayPrompt({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
      <button onClick={onReplay} className="group flex flex-col items-center gap-4">
        {/* Pulsing ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-cyan-400/25 animate-ping" />
          <div className="relative w-20 h-20 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </div>
        </div>
        {/* Text */}
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-cyan-400/50" />
          <span className="text-white font-black text-3xl tracking-[0.25em] uppercase">Replay</span>
          <div className="h-px w-10 bg-cyan-400/50" />
        </div>
        <span className="text-zinc-400 text-xs tracking-widest uppercase">with sensor data</span>
      </button>
    </div>
  );
}

// ─── Video player (thumbnail + fullscreen modal) ───────────────────────────────

type VideoState = 'idle' | 'playing' | 'replay-prompt' | 'replaying';

function VideoPlayer({ jump }: { jump: JumpDemo }) {
  const [open, setOpen]   = useState(false);
  const [vState, setVState] = useState<VideoState>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFirstPlay = useRef(true);

  const openModal = () => {
    if (!jump.videoSrc) return;
    setOpen(true);
    setVState('playing');
    isFirstPlay.current = true;
  };

  const closeModal = () => {
    setOpen(false);
    setVState('idle');
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  const handleEnded = () => {
    if (isFirstPlay.current) { setVState('replay-prompt'); isFirstPlay.current = false; }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setVState('replaying');
  };

  // Autoplay when modal opens
  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  return (
    <>
      {/* Card thumbnail — click to open */}
      <div
        className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden group cursor-pointer"
        onClick={openModal}
      >
        {jump.videoSrc ? (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
              <Film className="w-10 h-10 mb-2" />
              <span className="text-xs font-medium tracking-widest uppercase">Click to play</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-4">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
            <Film className="w-10 h-10 mb-2" />
            <span className="text-xs tracking-widest uppercase">Coming soon</span>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 16:9 container */}
          <div
            className="relative w-full"
            style={{ aspectRatio: '16/9', maxHeight: '100vh', maxWidth: 'calc(100vh * 16 / 9)' }}
          >
            <video
              ref={videoRef}
              src={jump.videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={handleEnded}
              playsInline
            />

            {vState === 'replaying' && (
              <WooOverlay woo={jump.woo} gradId={`areaFill-${jump.id}`} />
            )}

            {vState === 'replay-prompt' && (
              <ReplayPrompt onReplay={handleReplay} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ area }: { area: AreaScore }) {
  const pct = area.maxScore > 0 ? (area.score / area.maxScore) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground">{area.name}</span>
        <span className="text-xs font-bold text-foreground">
          {area.score.toFixed(2)}
          <span className="text-muted-foreground font-normal"> / {area.maxScore.toFixed(2)}</span>
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${area.gradient} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Jump card ────────────────────────────────────────────────────────────────

function JumpCard({ jump }: { jump: JumpDemo }) {
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-card to-primary/5">
        <div>
          <h3 className="text-lg font-bold text-foreground">{jump.label}</h3>
          <p className="text-sm text-muted-foreground">{jump.athlete} · Capital.com GKA Big Air</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-primary leading-none">{jump.score.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-0.5">/ 10</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <VideoPlayer jump={jump} />

        <div className="flex flex-col justify-center gap-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Score Breakdown</h4>
          <div className="space-y-4">
            {jump.areas.map(area => <ScoreBar key={area.name} area={area} />)}
          </div>
          {jump.penaltyNote && <p className="text-xs text-amber-600 font-medium mt-2">{jump.penaltyNote}</p>}
          <div className="mt-2 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-black text-primary">
              {jump.score.toFixed(2)}<span className="text-base font-normal text-muted-foreground"> / 10</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Demo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">Live Demo</h2>
          <p className="text-muted-foreground">
            3 real competition jumps · scored with objective Woo sensor data · no judge subjectivity.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">Woo Sensor Data</span>
        </div>
      </div>

      <div className="space-y-8">
        {DEMO_JUMPS.map(jump => <JumpCard key={jump.id} jump={jump} />)}
      </div>
    </div>
  );
}
