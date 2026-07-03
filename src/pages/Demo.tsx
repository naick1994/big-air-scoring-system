import { useState, useRef } from 'react';
import { Play, Pause, Film, ArrowUp, Wind, Timer, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface OverlayStat {
  label: string;
  value: string;
  unit: string;
  icon: 'up' | 'wind' | 'timer' | 'gauge';
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
  event: string;
  videoSrc?: string;
  score: number;
  penaltyNote?: string;
  areas: AreaScore[];
  overlayStats: OverlayStat[];
}

const ICON_MAP = {
  up: ArrowUp,
  wind: Wind,
  timer: Timer,
  gauge: Gauge,
};

// GKA preset weights: HEIGHT 20% → max 2.0 | EXTREMITY 10% → max 1.0 | TECHNICALITY 45% → max 4.5 | EXECUTION 25% → max 2.5
const DEMO_JUMPS: JumpDemo[] = [
  {
    id: 1,
    label: 'Jump 1',
    athlete: 'Leonardo Casati',
    event: 'Capital.com GKA Big Air',
    videoSrc: '/videos/LEO_8.07.mp4',
    score: 8.07,
    areas: [
      { name: 'HEIGHT',       score: 1.47, maxScore: 2.00, gradient: 'from-blue-500 to-cyan-400' },
      { name: 'EXTREMITY',    score: 0.74, maxScore: 1.00, gradient: 'from-purple-500 to-pink-400' },
      { name: 'TECHNICALITY', score: 3.83, maxScore: 4.50, gradient: 'from-amber-500 to-yellow-400' },
      { name: 'EXECUTION',    score: 2.03, maxScore: 2.50, gradient: 'from-green-500 to-lime-400' },
    ],
    overlayStats: [
      { label: 'HEIGHT',    value: '17.5', unit: 'm',   icon: 'up' },
      { label: 'AIRTIME',   value: '7.0',  unit: 's',   icon: 'timer' },
      { label: 'DISTANCE',  value: '121',  unit: 'm',   icon: 'wind' },
      { label: 'MAX SPEED', value: '65',   unit: 'kmh', icon: 'gauge' },
    ],
  },
  {
    id: 2,
    label: 'Jump 2',
    athlete: 'Leonardo Casati',
    event: 'Capital.com GKA Big Air',
    videoSrc: '/videos/LEO_8.37.mp4',
    score: 8.37,
    areas: [
      { name: 'HEIGHT',       score: 1.80, maxScore: 2.00, gradient: 'from-blue-500 to-cyan-400' },
      { name: 'EXTREMITY',    score: 0.76, maxScore: 1.00, gradient: 'from-purple-500 to-pink-400' },
      { name: 'TECHNICALITY', score: 3.85, maxScore: 4.50, gradient: 'from-amber-500 to-yellow-400' },
      { name: 'EXECUTION',    score: 1.96, maxScore: 2.50, gradient: 'from-green-500 to-lime-400' },
    ],
    overlayStats: [
      { label: 'HEIGHT',    value: '19.8', unit: 'm',   icon: 'up' },
      { label: 'AIRTIME',   value: '7.5',  unit: 's',   icon: 'timer' },
      { label: 'DISTANCE',  value: '83',   unit: 'm',   icon: 'wind' },
      { label: 'MAX SPEED', value: '52',   unit: 'kmh', icon: 'gauge' },
    ],
  },
  {
    id: 3,
    label: 'Jump 3',
    athlete: 'Lorenzo Casati',
    event: 'Capital.com GKA Big Air',
    videoSrc: '/videos/LORE_9.40.mp4',
    score: 9.40,
    areas: [
      { name: 'HEIGHT',       score: 1.65, maxScore: 2.00, gradient: 'from-blue-500 to-cyan-400' },
      { name: 'EXTREMITY',    score: 0.95, maxScore: 1.00, gradient: 'from-purple-500 to-pink-400' },
      { name: 'TECHNICALITY', score: 4.40, maxScore: 4.50, gradient: 'from-amber-500 to-yellow-400' },
      { name: 'EXECUTION',    score: 2.40, maxScore: 2.50, gradient: 'from-green-500 to-lime-400' },
    ],
    overlayStats: [
      { label: 'HEIGHT',    value: '18.4', unit: 'm',   icon: 'up' },
      { label: 'AIRTIME',   value: '6.8',  unit: 's',   icon: 'timer' },
      { label: 'DISTANCE',  value: '94',   unit: 'm',   icon: 'wind' },
      { label: 'MAX SPEED', value: '56',   unit: 'kmh', icon: 'gauge' },
    ],
  },
];

function VideoPlayer({ src, overlayStats }: { src?: string; overlayStats: OverlayStat[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden group">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          onEnded={() => setPlaying(false)}
          onPlay={() => setShowOverlay(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-600">
          <Film className="w-16 h-16" />
          <span className="text-sm font-medium tracking-wide">VIDEO COMING SOON</span>
        </div>
      )}

      {/* Overlay stats badges */}
      {showOverlay && (
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {overlayStats.map((stat) => {
            const Icon = ICON_MAP[stat.icon];
            return (
              <div
                key={stat.label}
                className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 animate-in fade-in slide-in-from-left-2 duration-500"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-sm font-bold text-white ml-1">
                  {stat.value}
                  <span className="text-xs text-zinc-400 ml-0.5">{stat.unit}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Play / Pause button — only shows when there's a real video */}
      {src && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
            {playing ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white" />
            )}
          </div>
        </button>
      )}
    </div>
  );
}

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
        <div
          className={`h-full bg-gradient-to-r ${area.gradient} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function JumpCard({ jump }: { jump: JumpDemo }) {
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-card to-primary/5">
        <div>
          <h3 className="text-lg font-bold text-foreground">{jump.label}</h3>
          <p className="text-sm text-muted-foreground">{jump.athlete} · {jump.event}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-primary leading-none">
            {jump.score.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">/ 10</div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Video */}
        <VideoPlayer src={jump.videoSrc} overlayStats={jump.overlayStats} />

        {/* Score breakdown */}
        <div className="flex flex-col justify-center gap-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Score Breakdown
          </h4>
          <div className="space-y-4">
            {jump.areas.map((area) => (
              <ScoreBar key={area.name} area={area} />
            ))}
          </div>
          {jump.penaltyNote && (
            <p className="text-xs text-amber-600 font-medium mt-2">{jump.penaltyNote}</p>
          )}
          <div className="mt-2 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-black text-primary">
              {jump.score.toFixed(2)}
              <span className="text-base font-normal text-muted-foreground"> / 10</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Demo() {
  const totalScore = DEMO_JUMPS.reduce((sum, j) => sum + j.score, 0);

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

      {/* Total score banner */}
      <Card className="p-6 mb-8 shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-primary/5 text-center">
        <p className="text-sm text-muted-foreground mb-1">Combined Score (3 Jumps)</p>
        <div className="text-6xl font-black text-primary">
          {totalScore.toFixed(2)}
          <span className="text-3xl text-muted-foreground font-normal"> / 30</span>
        </div>
      </Card>

      {/* Jump cards */}
      <div className="space-y-8">
        {DEMO_JUMPS.map((jump) => (
          <JumpCard key={jump.id} jump={jump} />
        ))}
      </div>
    </div>
  );
}
