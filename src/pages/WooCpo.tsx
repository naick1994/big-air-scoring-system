import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { FadeIn } from '@/components/FadeIn';
import { DeployTag } from '@/components/DeployTag';
import {
  Wind, Users, Wrench, MapPin,
  Target, MessagesSquare, Bug, PenTool, Megaphone, TrendingUp, Workflow,
} from 'lucide-react';
import logoFlightMode from '@/assets/logo-flight-mode.jpg';
import logoHarlem from '@/assets/logo-harlem.jpg';
import logoSnowit from '@/assets/logo-snowit.jpg';
import logoTribala from '@/assets/logo-tribala.jpg';
import logoFnm from '@/assets/logo-fnm.jpg';
import logoDgm from '@/assets/logo-dgm.jpg';
import logoBocconi from '@/assets/logo-bocconi.jpg';
import logoNtuTaiwan from '@/assets/logo-ntu-taiwan.jpg';
import logoCasatiBrothers from '@/assets/logo-casati-brothers.svg';

const GRADIENT_FONT = "'Baloo 2', sans-serif";
// Sampled directly from WOO's own "Standouts" Instagram badge, not a guess.
const GRADIENT_TEXT = 'bg-gradient-to-r from-[#29C9F5] via-[#05F998] to-[#7A33C9] bg-clip-text text-transparent';
const GRADIENT_BG = 'bg-gradient-to-r from-[#29C9F5] via-[#05F998] to-[#7A33C9]';

// Same path data as src/assets/woo-logo.svg, inlined so the fill can be
// set directly (an <img>-referenced SVG can't be recolored via CSS).
function WooLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2006 714" className={className} fill="#7A33C9" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M121.5 407.25 239 9.25H12.75zM334 12.25 175.75 587.5q-6.25 41.25 6.75 69.25t42.75 36h66L485 12.25zm250 0L425.75 587.5q-6.25 41.25 6.75 69.25t42.75 36h72.5L741 12.25zm68.75 677H738q31-5 56-27.75t36.5-57.5L915 304q36-103.5 136.75-131.5c100.75-28 164 31.25 173 46 2.864-9.614 12.82-45.466 32.5-81 18-32.5 42.5-65 47.5-69.75-30.5-27.5-166-96-316.25-44Q826.836 79.7 769.75 238.25zM1641 5c193.852 0 351 157.148 351 351s-157.148 351-351 351c-72.26 0-139.421-21.836-195.243-59.27q29.301-37.037 47.243-69.48 18.25-33 32.75-83 9.582 14.202 18 21.5l.642.548q6.586 5.55 19.88 13.662C1587.754 541.276 1613.71 547 1641 547c105.486 0 191-85.514 191-191s-85.514-191-191-191-191 85.514-191 191q0 2.569.067 5.12L1450 361q0 64.5-30 139.5-15.95 39.875-58.236 88.55c-29.758 33.08-69.433 64.11-122.264 88.7-123 57.25-271.75 21.75-321.25-12.25l49.5-170.25c30.25 50 139.75 67.5 199.5 40.75q120.905-54.13 122.75-172l.09.003q-.09-3.99-.09-8.003c0-193.852 157.148-351 351-351" />
    </svg>
  );
}

// Same forward-cycling pattern as ChangeTheTide.tsx's useCyclingIndex.
function useCyclingIndex(length: number, periodMs: number) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % length), periodMs);
    return () => clearInterval(id);
  }, [reducedMotion, length, periodMs]);

  return index;
}

// Fires once when the wrapped element scrolls into view. Same pattern as
// AboutNick.tsx's useInViewOnce, reused here to drive the Timeline reveal.
function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSeen(true); },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [seen]);
  return { ref, seen };
}

type HeroStat = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string };

// Each stat is one atomic unit (value + label rendered and animated
// together, keyed by index) so a cycle can never pair one stat's number
// with another stat's label mid-transition.
const HERO_STATS: HeroStat[] = [
  { value: 400, suffix: 'k+', label: 'users scaled' },
  { value: 50, suffix: '+', label: 'person team built' },
  { value: 2, label: 'World Champions managed' },
  { value: 6, label: 'years product & ops' },
  { value: 18.6, decimals: 1, suffix: 'm', label: 'highest jump tracked' },
  { value: 1, label: 'tracking app built end-to-end' },
  { value: 3, label: 'companies co-founded' },
  { value: 6, prefix: '€', suffix: 'M', label: 'Series A raised' },
];

type TimelineItem = { title: string; org: string; orgUrl?: string; period: string; desc: string[]; logo?: string; logoScale?: number };

// Real current roles, same data as AboutNick.tsx.
const CURRENT_ROLES: TimelineItem[] = [
  {
    title: 'Co-Founder & CEO', org: 'Flight Mode', period: 'Mar 2025 - Present', logo: logoFlightMode,
    desc: [
      'Objective: innovate and revolutionise the kitesurf industry.',
      'Developing market growth initiatives for the global wind-powered sports ecosystem.',
    ],
  },
  {
    title: 'Manager', org: 'Casati Brothers', period: 'Mar 2025 - Present', logo: logoCasatiBrothers, logoScale: 2.1,
    desc: ['Athlete representation for two World Champion kiteboarders.'],
  },
  {
    title: 'Italy and Spain Distributor, moving to Agent', org: 'Harlem Kitesurfing', period: 'Mar 2025 - Present', logo: logoHarlem,
    desc: [
      'Also taking on a Strategic Transformation Advisor seat at Harlem HQ: direction, prioritization, and business impact, not day-to-day execution.',
      'Scope spans AI & automation strategy, customer experience transformation, strategic partnerships, and athlete development & branding.',
      "Sets the quarterly OKR framework directly with Harlem's CEO and leadership.",
      "That same seat gives WOO a direct line into Harlem's own strategic roadmap and partnership decisions.",
    ],
  },
];

// Real track record, same data as AboutNick.tsx.
const TRACK_RECORD: TimelineItem[] = [
  {
    title: 'Chief Operating Officer & Chief Product Officer', org: 'Snowit (Founding Team)', orgUrl: 'https://snowit.ski/en', period: 'May 2019 - Feb 2025', logo: logoSnowit,
    desc: [
      'Scaled Snowit to 400k+ users and the team from 3 to 50+ people.',
      'Led Product, Ops, and Customer Care teams.',
      'Managed P&L and implemented agile project management tools and routines.',
      'Led development of a GPS-based ski tracking app.',
      'Owned product across the Snowit marketplace, the Snowit app, backoffice, 27 white-label sites (each with third-party API integrations), the Bikeit site, the Discovera site, and the tracking app (later merged into the Snowit app).',
      'Ran cross-team PM across the tech team and my own Ops team.',
    ],
  },
  {
    title: 'Co-Founder, Chief Operating Officer & Chief Product Officer', org: 'Tribala', orgUrl: 'https://tribala.travel/en', period: 'May 2023 - Feb 2025', logo: logoTribala,
    desc: [
      'Co-founded Tribala, taking it from the initial idea to launch and market validation.',
      'Built the brand identity and product strategy for a sports group travel marketplace.',
      'Led operations, partnerships, and growth.',
    ],
  },
  {
    title: 'Digital & Innovation Ambassador', org: 'FNM S.p.A.', orgUrl: 'https://www.fnmgroup.it/', period: 'Sep 2022 - Oct 2024', logo: logoFnm,
    desc: ['Member of Digital & Innovation Ambassadors to promote innovation within the FNM group.'],
  },
  {
    title: 'Consultant', org: 'DGM Consulting Srl', orgUrl: 'https://dgmco.it/it/', period: 'Apr 2018 - Aug 2018', logo: logoDgm,
    desc: ['Data analytics and strategic consulting in hospitality and industrial sectors.'],
  },
];

// Real education, same data as AboutNick.tsx.
const EDUCATION: TimelineItem[] = [
  {
    title: 'MSc in Management', org: 'Bocconi University', period: 'Sep 2016 - Dec 2018', logo: logoBocconi,
    desc: ['Top grades (110/110).'],
  },
  {
    title: 'Exchange Program', org: 'National Taiwan University of Taipei', period: 'Aug 2016 - Dec 2018', logo: logoNtuTaiwan,
    desc: ['Business & culture exchange.', 'GPA 4/4.'],
  },
  {
    title: 'BSc', org: 'Bocconi University', period: 'Sep 2013 - Jul 2016', logo: logoBocconi,
    desc: [],
  },
];

const SNOWIT_CPO = [
  { icon: Target, title: 'Product ownership', desc: 'Owned the roadmap and prioritization for the GPS ski tracking app end to end.' },
  { icon: MessagesSquare, title: 'Developer feedback', desc: 'Ran the feedback loop with the dev team, turning user behavior into sprint priorities.' },
  { icon: Bug, title: 'Software & GPS algorithm testing', desc: 'Tested the tracking algorithm and every app release directly, catching what broke before users did.' },
  { icon: PenTool, title: 'App design', desc: 'Shaped product design and UX decisions, not just the backlog.' },
  { icon: Megaphone, title: 'Marketing alignment', desc: 'Kept product and marketing in sync so releases and campaigns landed together.' },
  { icon: TrendingUp, title: 'Finance alignment', desc: "Connected product decisions to the P&L, not built in a vacuum." },
];

const WHY_ME_NOW = [
  {
    icon: Wind,
    title: 'A kiter, not just someone who manages kiters',
    desc: 'Can translate what a rider feels on the water into something a product team can build.',
  },
  {
    icon: Users,
    title: 'Real trust with the riders who matter here',
    desc: 'Lorenzo, Leonardo, plus a wider circle across Italy, Spain, and internationally who talk straight, not through a filter.',
  },
  {
    icon: Wrench,
    title: 'A second channel, from kite design',
    desc: "Moving into a Strategic Transformation role at Harlem opens a second feedback channel. Ralph and Aaron, Harlem's kite designers (Ralph has 25 years in this), will use WOO sensor data to develop new kites, and will feed back on the WOO product itself. Same kind of input as Lorenzo and Leo, from a kite-design angle instead of riding.",
  },
];

// Two complementary areas of contribution, deliberately not framed as
// roles or titles — this is what working together could look like, not
// an org chart.
const COLLABORATION_AREAS = [
  {
    icon: Target,
    label: 'Product',
    bullets: [
      'Turning rider and designer feedback into a real, prioritized product roadmap — not a feedback inbox.',
      "Testing product releases hands-on before they reach riders, the way I did with Snowit's tracking algorithm.",
      'Keeping product decisions connected to marketing and business priorities, not built in a vacuum.',
      'Bringing an outside view of where the product sits against the rest of the market — not theoretical, from being inside those conversations already.',
      'Turning feedback into trackable outcomes — clear metrics for what "better" actually means, not just anecdotes.',
    ],
  },
  {
    icon: Workflow,
    label: 'Process & Delivery',
    bullets: [
      'Bringing structure to how feedback becomes a decision becomes a shipped change — a repeatable process, not ad hoc.',
      'Coordinating across product, dev, and marketing so nothing falls through the cracks.',
      'A simple prioritization rhythm — a small number of clear priorities at a time, reviewed regularly, instead of everything happening at once.',
      "Basic internal tooling so teams aren't working off disconnected spreadsheets and chats — the kind of connective process work I built at Snowit and proposed for Harlem.",
      'Flagging risks and bottlenecks early, before they become blockers for the wider team.',
    ],
  },
];

type EcoNode = { id: string; name: string; desc: string; url?: string };

// Eleven nodes, evenly spaced around Nick — same distance, same angle
// increment.
const ECO_NODES: EcoNode[] = [
  { id: 'casati-brothers', name: 'Casati Brothers', desc: 'Two World Champion kiteboarders I manage, already testing WOO.' },
  { id: 'flight-mode', name: 'Flight Mode', desc: 'The operating company behind all of this.' },
  { id: 'tarifa', name: 'Connections & Ecosystem in Tarifa', desc: "The wider network in one of the world's kite capitals — Balneario Beach Club, a newly-opened gym, and more." },
  { id: 'harlem-agency', name: 'Harlem Agency Network', desc: 'The dealer and school network across Italy and Spain that trusts me completely.' },
  { id: 'big-air', name: 'Big Air Scoring System', desc: "The scoring reform I'm building for the sport, independent but sensor-informed.", url: `${import.meta.env.BASE_URL}` },
  { id: 'tribala', name: 'Tribala', desc: 'A licensed tour operator running kite clinics worldwide with my own riders and ambassadors coaching, Lorenzo included as a sponsored athlete.', url: 'https://tribala.travel/en' },
  { id: 'lorenzo-shop', name: 'Lorenzo Casati Shop', desc: 'The flagship shop in Tarifa.' },
  { id: 'casati-harlem-school', name: 'Casati Harlem Pro School', desc: "The kite school I'm buying and rebranding in Tarifa." },
  { id: 'harlem-clubhouse', name: 'Harlem Clubhouse', desc: 'The community events hub in Tarifa.' },
  { id: 'harlem-advisor', name: 'Harlem Advisor Role', desc: 'Strategic Transformation Advisor at Harlem HQ — direction and prioritization, not day-to-day execution.' },
  { id: 'ralph-aaron', name: 'Ralph & Aaron', desc: "Harlem's kite designers (25 years of experience), feeding kite-design data back into product." },
];

// A handful of real, meaningful cross-branch links — not a full mesh.
// Enough to show the branches reinforce each other without turning Nick
// into the center of a sunburst.
const CROSS_EDGES: [string, string][] = [
  ['casati-brothers', 'big-air'],
  ['casati-brothers', 'tribala'],
  ['casati-brothers', 'casati-harlem-school'],
  ['flight-mode', 'harlem-agency'],
  ['flight-mode', 'lorenzo-shop'],
  ['tarifa', 'harlem-clubhouse'],
  ['tarifa', 'casati-harlem-school'],
  ['harlem-agency', 'harlem-advisor'],
  ['harlem-agency', 'ralph-aaron'],
  ['harlem-advisor', 'big-air'],
];

const ECO_RADIUS = 41;

function polarToPercent(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

// Quadratic bezier bowed outward from the diagram's center, so cross-branch
// links arc gracefully instead of cutting straight across the circle.
function curvedPath(x1: number, y1: number, x2: number, y2: number, bow: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  let dx = mx - 50;
  let dy = my - 50;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const cx = mx + dx * bow;
  const cy = my + dy * bow;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// One connection: a "trace" stroke that draws in once on entrance, plus a
// short bright dash that loops along the same path forever once drawn —
// the continuous "energy flowing through the ecosystem" effect. Spokes to
// Nick flow slowly and ambiently; cross-branch links flow fast, reading as
// data moving quickly between branches. Visual weight is fixed — hover and
// click never change how a connection looks, only which node's own card
// and description are active. The dash pattern is measured from the real
// rendered path so the loop is seamless.
function EcoConnection({ d, seen, delayMs, fast }: { d: string; seen: boolean; delayMs: number; fast?: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const flowRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useLayoutEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [d]);

  useEffect(() => {
    if (!seen || !length || !flowRef.current) return;
    const duration = fast ? 1600 + (length % 5) * 180 : 9000 + (length % 7) * 900;
    const anim = flowRef.current.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: -length }],
      { duration, iterations: Infinity, easing: 'linear', delay: delayMs + (fast ? 300 : 900) }
    );
    return () => anim.cancel();
  }, [seen, length, delayMs, fast]);

  return (
    <g>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#ecosystemLine)"
        strokeLinecap="round"
        strokeWidth={0.32}
        strokeOpacity={fast ? 0.38 : 0.42}
        strokeDasharray={length || 1}
        strokeDashoffset={seen ? 0 : length || 1}
        style={{ transition: `stroke-dashoffset 0.9s ease ${delayMs}ms` }}
      />
      {length > 0 && (
        <path
          ref={flowRef}
          d={d}
          fill="none"
          stroke="url(#ecosystemLine)"
          strokeLinecap="round"
          strokeWidth={fast ? 0.75 : 0.6}
          strokeDasharray={`${Math.max(length * (fast ? 0.08 : 0.045), 1.5)} ${length}`}
          style={{ opacity: seen ? (fast ? 0.55 : 0.5) : 0, transition: 'opacity 0.4s ease' }}
        />
      )}
    </g>
  );
}

// Full ecosystem: a fully meshed network on desktop — every node connects
// to every other — grouped accordion on mobile. Clicking a node only opens
// its description below; it never changes how any line or other node
// looks, since the point is that the whole mesh is already equally alive.
function EcosystemNetwork() {
  const { ref, seen } = useInViewOnce<HTMLDivElement>();
  const [selected, setSelected] = useState<string | null>(null);

  const n = ECO_NODES.length;
  const nodeGeo = useMemo(
    () => ECO_NODES.map((node, i) => ({ ...node, ...polarToPercent((i / n) * 360 - 90, ECO_RADIUS) })),
    [n]
  );
  const nodeById = useMemo(() => Object.fromEntries(nodeGeo.map((node) => [node.id, node])), [nodeGeo]);
  const crossGeo = useMemo(
    () => CROSS_EDGES.map(([a, b]) => ({ a, b, d: curvedPath(nodeById[a].x, nodeById[a].y, nodeById[b].x, nodeById[b].y, 6) })),
    [nodeById]
  );

  const activeNode = selected ? ECO_NODES.find((node) => node.id === selected) ?? null : null;

  return (
    <div ref={ref}>
      {/* ── Desktop: radial network ── */}
      <div className="relative aspect-square w-full max-w-3xl mx-auto hidden md:block">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="ecosystemLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#29C9F5" />
              <stop offset="50%" stopColor="#05F998" />
              <stop offset="100%" stopColor="#7A33C9" />
            </linearGradient>
          </defs>
          {nodeGeo.map((node, i) => (
            <EcoConnection key={node.id} d={`M 50 50 L ${node.x} ${node.y}`} seen={seen} delayMs={i * 70} />
          ))}
          {crossGeo.map(({ a, b, d }, i) => (
            <EcoConnection key={`${a}-${b}`} d={d} seen={seen} delayMs={900 + i * 30} fast />
          ))}
        </svg>

        <motion.div
          className={`absolute ${GRADIENT_BG} text-white rounded-full w-20 h-20 flex items-center justify-center text-center text-base font-bold z-10`}
          style={{
            left: '50%', top: '50%', x: '-50%', y: '-50%', fontFamily: GRADIENT_FONT,
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={seen ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          Nick
        </motion.div>

        {nodeGeo.map((node, i) => {
          const active = selected === node.id;
          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => setSelected((s) => (s === node.id ? null : node.id))}
              className="absolute z-10 w-[112px] min-h-[50px] flex items-center justify-center text-center px-3 py-2 rounded-2xl border bg-card/95 backdrop-blur-sm text-[11px] font-semibold leading-snug"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                x: '-50%',
                y: '-50%',
                borderColor: active ? '#05F998' : 'var(--border)',
                boxShadow: active ? '0 0 22px rgba(5,249,152,0.5), 0 6px 18px rgba(0,0,0,0.35)' : '0 2px 10px rgba(0,0,0,0.25)',
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={seen ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: seen ? 0 : 0.15 + i * 0.05 }}
              whileHover={{ scale: 1.08, y: '-54%' }}
              whileTap={{ scale: 0.97 }}
            >
              {node.name}
            </motion.button>
          );
        })}
      </div>

      {/* ── Desktop: click-to-reveal panel ── */}
      <div className="hidden md:block max-w-xl mx-auto mt-10 min-h-[96px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected ?? 'default'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeNode ? (
              <Card className="p-5 text-center">
                <h4 className="font-bold text-sm mb-1.5">{activeNode.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeNode.desc}</p>
                {activeNode.url && (
                  <a
                    href={activeNode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-[#05F998] hover:underline"
                  >
                    Visit →
                  </a>
                )}
              </Card>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Click a node to explore.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mobile: vertical list as accordion ── */}
      <div className="md:hidden">
        <div
          className={`inline-flex items-center rounded-full ${GRADIENT_BG} text-white px-4 py-2 text-sm font-bold mb-4`}
          style={{ fontFamily: GRADIENT_FONT }}
        >
          Nick
        </div>
        <div className="space-y-2 border-l-2 border-border pl-4 ml-4">
          {ECO_NODES.map((node) => {
            const active = selected === node.id;
            return (
              <div key={node.id} className="rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelected((s) => (s === node.id ? null : node.id))}
                  className="w-full flex items-center justify-between gap-2 bg-card px-3 py-2.5 text-left text-sm font-semibold"
                >
                  {node.name}
                  <span className={`text-muted-foreground text-lg leading-none transition-transform duration-200 ${active ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 py-2.5 text-sm text-muted-foreground leading-relaxed border-t border-border">
                        {node.desc}
                        {node.url && (
                          <a
                            href={node.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-1.5 text-xs font-semibold text-[#05F998]"
                          >
                            Visit →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <div className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">{children}</div>;
}

function GradientHeading({ children, className }: { children: string; className?: string }) {
  return (
    <h2
      className={`${className ?? 'inline-block'} text-3xl md:text-4xl font-bold mb-10 ${GRADIENT_TEXT}`}
      style={{ fontFamily: GRADIENT_FONT }}
    >
      {children}
    </h2>
  );
}

// Same logo/title/org/period layout as AboutNick.tsx's Timeline component.
function Timeline({ items }: { items: TimelineItem[] }) {
  const { ref, seen } = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="divide-y divide-border border-t border-border">
      {items.map((item, i) => (
        <div
          key={item.title + item.org}
          className="flex gap-4 py-5"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? 'translateX(0)' : 'translateX(-12px)',
            transition: `opacity 0.5s ease ${i * 90}ms, transform 0.5s ease ${i * 90}ms`,
          }}
        >
          {item.logo && (
            item.orgUrl ? (
              <a
                href={item.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
              >
                <img
                  src={item.logo}
                  alt={`${item.org} logo`}
                  className="w-full h-full object-contain"
                  style={item.logoScale ? { transform: `scale(${item.logoScale})` } : undefined}
                />
              </a>
            ) : (
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={item.logo}
                  alt={`${item.org} logo`}
                  className="w-full h-full object-contain"
                  style={item.logoScale ? { transform: `scale(${item.logoScale})` } : undefined}
                />
              </div>
            )
          )}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm">{item.title}</div>
            <div className="text-sm text-muted-foreground">
              {item.orgUrl ? (
                <a
                  href={item.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline decoration-dotted underline-offset-2 transition-colors"
                >
                  {item.org}
                </a>
              ) : (
                item.org
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.period}</div>
            {item.desc.length > 0 && (
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                {item.desc.map((line) => <li key={line}>{line}</li>)}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WooCpo() {
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setHeroIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const statIndex = useCyclingIndex(HERO_STATS.length, 2800);
  const stat = HERO_STATS[statIndex];
  const statValueText = `${stat.prefix ?? ''}${stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}${stat.suffix ?? ''}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes statPop { from { opacity: 0.3; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#29C9F5]/10 via-[#05F998]/5 to-[#7A33C9]/10 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative py-20 md:py-28">
          <div
            className="flex items-center gap-4 mb-8"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <WooLogo className="h-9" />
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight"
            style={{
              fontFamily: GRADIENT_FONT,
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            <span className="block">Nick</span>
            <span className={`inline-block ${GRADIENT_TEXT}`}>x WOO</span>
          </h1>

          <div
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/60 pl-5 pr-6 py-3 mt-8">
              <div key={statIndex} className="flex items-center gap-3" style={{ animation: 'statPop 0.4s ease' }}>
                <span
                  className={`text-3xl font-extrabold tabular-nums ${GRADIENT_TEXT}`}
                  style={{ fontFamily: GRADIENT_FONT }}
                >
                  {statValueText}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Why now ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>Why now</SectionLabel>
            <GradientHeading>Why now.</GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4">
              Lorenzo and Leonardo aren't fully sold on the product yet, but they're genuinely excited about the direction. What both of them, and Renato, keep coming back to is the same idea: they want one person on the inside they actually trust to be the channel for feedback. Not a support ticket, a real person who gets it.
            </p>
            <p className="text-lg text-foreground font-semibold max-w-2xl leading-relaxed mt-4">
              I think that person should be me. Fractional, not full-time.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Why I have the bandwidth ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>Bandwidth</SectionLabel>
            <GradientHeading>Why I have the bandwidth for this.</GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4">
              Distribution used to take up most of my operational time. I'm moving to an agent model with Harlem, taking on a Strategic Transformation role at their HQ instead. That means delegating the day-to-day distribution work, and the shop and the kite school stay fully delegated to the people who run them day to day, assets I own and oversee, not jobs I'm hands-on in.
            </p>
            <p className="text-lg text-foreground font-semibold max-w-2xl leading-relaxed mt-4">
              That frees up real capacity, and I'm deliberate about where I reinvest it. This is one of the places.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Track record ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>Track record</SectionLabel>
            <GradientHeading>Track record.</GradientHeading>
          </FadeIn>

          <FadeIn y={30} duration={0.6} delay={0.05}>
            <h3 className="font-bold mb-4 -mt-6">Right now</h3>
            <Timeline items={CURRENT_ROLES} />
          </FadeIn>

          <FadeIn y={30} duration={0.6} delay={0.1}>
            <h3 className="font-bold mb-4 mt-12">Track record</h3>
            <Timeline items={TRACK_RECORD} />
          </FadeIn>

          <FadeIn y={30} duration={0.6} delay={0.1}>
            <h3 className="font-bold mb-4 mt-12">Education</h3>
            <Timeline items={EDUCATION} />
          </FadeIn>
        </div>
      </section>

      {/* ───────── The Snowit tracking app ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>Product, hands-on</SectionLabel>
            <GradientHeading>The Snowit tracking app.</GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4 mb-10">
              As COO and CPO at Snowit, product wasn't a side responsibility. On the GPS ski tracking app I owned it directly: ownership, testing, and the connective tissue between dev, design, marketing, and finance.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {SNOWIT_CPO.map((item, i) => (
              <FadeIn key={item.title} y={24} duration={0.5} delay={i * 0.05}>
                <Card className="p-5 flex items-start gap-3 h-full">
                  <item.icon className="w-5 h-5 text-[#7A33C9] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Why me, right now ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>Why me</SectionLabel>
            <GradientHeading>Why me, right now.</GradientHeading>
          </FadeIn>

          <div className="space-y-4">
            {WHY_ME_NOW.map((item, i) => (
              <FadeIn key={item.title} y={30} duration={0.6} delay={i * 0.06}>
                <Card className="p-6 flex gap-4 shadow-[var(--shadow-card)]">
                  <item.icon className="w-5 h-5 text-[#29C9F5] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── What this could look like ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>In practice</SectionLabel>
            <GradientHeading>What this could look like.</GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4 mb-10">
              This is the kind of work I've already done — hands-on product ownership at Snowit, and a similar transformation mandate I've already put together for Harlem.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {COLLABORATION_AREAS.map((area, i) => (
              <FadeIn key={area.label} y={30} duration={0.6} delay={i * 0.08}>
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <area.icon className="w-4 h-4 text-[#29C9F5]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{area.label}</span>
                  </div>
                  <ul className="space-y-3">
                    {area.bullets.map((b) => (
                      <li key={b} className="text-sm text-muted-foreground leading-relaxed flex gap-2.5">
                        <span className="text-[#05F998] shrink-0">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Ecosystem ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>Ecosystem</SectionLabel>
            <div className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-14 leading-tight" style={{ fontFamily: GRADIENT_FONT }}>
              <span className="text-foreground">1 + 1 + 1 + 1 </span>
              <span className={`inline-block ${GRADIENT_TEXT}`}>= 8, Not 4</span>
            </div>
          </FadeIn>

          <EcosystemNetwork />
        </div>
      </section>

      {/* ───────── The Tarifa hub ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={40} duration={0.7}>
            <SectionLabel>The hub</SectionLabel>
            <GradientHeading className="inline-flex items-center gap-3">
              <MapPin className="w-8 h-8 text-[#05F998] shrink-0" />
              The Tarifa hub.
            </GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4">
              There's a shop in Tarifa, and a kite school being added to it, fully delegated and run by their own team day to day. Real physical infrastructure that can become WOO's actual hub in town: a meeting point, a point of sale, and a live test and demo space, not just an abstract feedback channel.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mt-4">
              Full access to the Balneario Beach Club for events and demos. A contact at a newly-opened gym in Tarifa too, potential space for simulators, board displays, and AR/VR goggles demo stations. Real-world reach: sales, testing, and demo, all in one town.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Closing ───────── */}
      <section>
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <FadeIn y={24} duration={0.6}>
            <p className="text-xl md:text-2xl font-semibold text-foreground">
              This is already in motion. Let's talk about where it goes.
            </p>
          </FadeIn>
        </div>
      </section>

      <DeployTag />
    </div>
  );
}
