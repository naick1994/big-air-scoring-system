import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import logo from '@/assets/gka-logo.svg';
import wooLogo from '@/assets/woo-logo.svg';
import capitalLogo from '@/assets/capital-com-logo.png';

const AREA_GRADIENT: Record<string, string> = {
  'HEIGHT & AMPLITUDE': 'from-blue-500 to-cyan-400',
  EXTREMITY: 'from-purple-500 to-pink-400',
  TECHNICALITY: 'from-amber-500 to-yellow-400',
  EXECUTION: 'from-green-500 to-lime-400',
};

const AREAS = [
  { name: 'HEIGHT & AMPLITUDE', weight: 30, desc: 'Peak height and distance covered, measured directly against event thresholds.', subjective: false },
  { name: 'EXTREMITY', weight: 30, desc: 'Kite angle, load on entry, and hang time during the loop.', subjective: false },
  { name: 'TECHNICALITY', weight: 20, desc: 'Rotations, axis, and board variations — what the trick consisted of.', subjective: false },
  { name: 'EXECUTION', weight: 20, desc: 'Style, control, and landing quality — the one judged, human call.', subjective: true },
];

export default function ChangeTheTide() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-16 pb-24 max-w-5xl relative">
          <div className="flex items-center gap-4 mb-16">
            <img src={logo} alt="GKA" className="h-9" />
            <div className="w-px h-5 bg-border" />
            <img src={wooLogo} alt="Woo" className="h-5" style={{ filter: 'brightness(0) invert(1)' }} />
            <div className="w-px h-5 bg-border" />
            <img src={capitalLogo} alt="Capital.com" className="h-5" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
            It's time for<br />
            <span className="text-primary">objective judging.</span>
          </h1>
          <p className="text-xl text-muted-foreground mt-8 max-w-2xl">
            Every jump in Big Air can now be measured — height, rotation, load, hang time, landing.
            The scoring model just hasn't caught up. This one has.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 text-base hover:opacity-90 transition-opacity"
            >
              See it live
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            <span className="text-sm text-muted-foreground font-mono">Everything below is the real, running product — not a mockup.</span>
          </div>
        </div>
      </section>

      {/* ───────── The problem ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24 max-w-4xl">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">The problem</div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mb-6">
            One impression can outweigh everything else.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Holistic judging asks one person to weigh height, rotation, execution, and risk all at once,
            from a single vantage point, in the seconds after a jump ends. One dominant impression — how
            high it looked, how clean the landing looked — tends to eclipse every other parameter that
            went into the trick.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mt-4">
            The result: a scoreboard that's hard to predict, and even harder to explain.
          </p>
        </div>
      </section>

      {/* ───────── The shift: 4 areas ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24 max-w-5xl">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">The shift</div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mb-4">
            Break the jump into what can be measured.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            Every jump is decomposed into four areas, each scored against fixed, published parameters.
            Three of the four are grounded in objective sensor data. Only Execution stays a judged call
            — and it's the one area labeled as such.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AREAS.map((area) => (
              <Card key={area.name} className="p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm tracking-wide">{area.name}</span>
                  <span className="font-mono text-primary font-semibold">{area.weight}%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{area.desc}</p>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${AREA_GRADIENT[area.name]}`}
                    style={{ width: `${area.weight * 2}%` }}
                  />
                </div>
                {area.subjective && (
                  <Badge variant="outline" className="mt-4 border-amber-500/40 text-amber-400 text-[10px] tracking-wide">
                    SUBJECTIVE BY DESIGN
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Reductionist vs Holistic ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24 max-w-5xl">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">The comparison</div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mb-12">
            Holistic vs. reductionist, side by side.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-7 shadow-[var(--shadow-card)]">
              <div className="text-sm font-mono uppercase tracking-wide text-muted-foreground mb-5">Holistic (today)</div>
              <ul className="space-y-4">
                {[
                  'One overall impression, formed in seconds',
                  'Not tied to any fixed, published parameter',
                  'Hard to audit after the fact',
                  'Varies between judges and events',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/70" />
                    {line}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-7 shadow-[var(--shadow-card)] border-primary/30">
              <div className="text-sm font-mono uppercase tracking-wide text-primary mb-5">Reductionist (this system)</div>
              <ul className="space-y-4">
                {[
                  'Four weighted areas, scored independently',
                  'Every point tied to a published parameter',
                  'Fully auditable — every score is explainable',
                  'Same method, every judge, every event',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────── Why now ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24 max-w-4xl">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">Why now</div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mb-6">
            The data doesn't need to be invented.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Woo's sensors are already strapped to riders in competition today, recording height, speed,
            rotations, and load on every jump. This demo isn't running on live sensor feeds yet — but
            every parameter it scores is something already being measured on the water, jump after jump.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mt-4">
            Turning that into a scoring model isn't a hardware problem. It's a matter of structuring
            data that's already being collected.
          </p>
        </div>
      </section>

      {/* ───────── What it unlocks ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24 max-w-5xl">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">What it unlocks</div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mb-12">
            More than a scoring change.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-bold mb-2">Community &amp; amateurs</h3>
              <p className="text-sm text-muted-foreground">
                A rider can score their own jump against the exact standard the pros are held to,
                using the same sensor data.
              </p>
            </Card>
            <Card className="p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-bold mb-2">Fairer selection</h3>
              <p className="text-sm text-muted-foreground">
                Organizers can shortlist and seed athletes from auditable numbers instead of
                reputation.
              </p>
            </Card>
            <Card className="p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-bold mb-2">Post-competition coaching</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Every athlete gets a precise answer to "what do I need to improve" — a number,
                not a guess.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                  <span>Height &amp; Amplitude</span>
                  <span className="text-green-500 font-semibold">2.50 / 3.00</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                </div>
                <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                  <span>Extremity</span>
                  <span className="text-amber-400 font-semibold">2.25 / 3.00</span>
                  <span className="text-red-400 font-semibold text-[10px]">-0.75</span>
                </div>
                <p className="text-muted-foreground pt-1">Lost 0.75 pts on Extremity — load the kite harder on entry to the loop.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section>
        <div className="container mx-auto px-4 py-28 max-w-3xl text-center">
          <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">See it work</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The system is live.</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Every screen referenced here — the four-area breakdown, the coaching receipt — exists
            today, running, not as a slide.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-8 py-4 text-lg hover:opacity-90 transition-opacity"
          >
            Open the live demo
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
