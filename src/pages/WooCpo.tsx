import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { DeployTag } from '@/components/DeployTag';
import {
  Users, MapPin, ArrowUpRight,
  Target, MessagesSquare, Bug, PenTool, Megaphone, TrendingUp, Workflow,
  Layers, RefreshCw, Gauge, Network, Clock, Heart,
} from 'lucide-react';
import nickAvatar from '@/assets/nick-avatar.jpg';
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
  { value: 30, prefix: 'Forbes ', label: 'Under 30 (2023)' },
  { value: 150, suffix: 'x', label: 'GMV growth in 7 years' },
];

type TimelineItem = { title: string; org: string; orgUrl?: string; period: string; desc: string[]; logo?: string; logoScale?: number };

// Real current roles, same data as AboutNick.tsx.
const CURRENT_ROLES: TimelineItem[] = [
  {
    title: 'Co-Founder & CEO', org: 'Flight Mode', period: 'Mar 2025 - Present', logo: logoFlightMode,
    desc: [
      'Exclusive distributor for Harlem Kitesurfing (NL) in Italy and Spain: built the B2B retailer network from zero and set pricing architecture and channel strategy for a premium positioning.',
      'Full P&L across distribution, ecommerce and physical retail; led the launch of a flagship store in Tarifa.',
      'Designed and implemented the end-to-end commerce and ERP ecosystem (Odoo), including B2B portal, D2C ecommerce, POS, inventory and accounting across two tax jurisdictions.',
    ],
  },
  {
    title: 'Manager', org: 'Casati Brothers', period: 'Mar 2025 - Present', logo: logoCasatiBrothers, logoScale: 2.1,
    desc: ['Commercial representation of two World Champion kiteboarders: sponsorship negotiation, brand partnerships and multi-year commercial agreements.'],
  },
  {
    title: 'Italy and Spain Distributor, moving to Agent', org: 'Harlem Kitesurfing', period: 'Mar 2025 - Present', logo: logoHarlem,
    desc: [
      'Also taking on a Strategic Transformation Advisor seat at Harlem HQ: direction, prioritization, and business impact, not day-to-day execution.',
      'Scope spans AI & automation strategy, customer experience transformation, strategic partnerships, and athlete development & branding.',
      "Sets the quarterly OKR framework directly with Harlem's CEO and leadership.",
    ],
  },
];

// Real track record, same data as AboutNick.tsx.
const TRACK_RECORD: TimelineItem[] = [
  {
    title: 'Chief Operating Officer & Chief Product Officer', org: 'Snowit (Founding Team)', orgUrl: 'https://snowit.ski/en', period: 'May 2019 - Feb 2025', logo: logoSnowit,
    desc: [
      'Leading travel-tech platform for winter sports, integrating ski passes, equipment rental, lessons, accommodation and other mountain services into a single digital customer journey. Snowit also provides white-label e-commerce solutions for ski resorts and tourism destinations.',
      'Grew GMV from €200k in the first year to €30M, a 150x increase over seven years.',
      'Scaled Snowit to 400k+ users and the team from 3 to 50+ people.',
      'Named to Forbes 30 Under 30 for this work.',
      'Led Product, Operations and Customer Care with 4 direct reports and 20 people across the three teams; defined the new operating model, and the app holds a 4.8-star rating, credited in part to that work.',
      'Owned the P&L and built the operating model across 3 markets and 300 partner resorts and suppliers, implementing agile project management tools and routines.',
      'Led development of a GPS-based ski tracking app.',
      'Owned product across the Snowit marketplace, the Snowit app, backoffice, 27 white-label sites (each with third-party API integrations), the Bikeit site, the Discovera site, and the tracking app (later merged into the Snowit app).',
      'Ran cross-team PM across the tech team and my own Ops team.',
    ],
  },
  {
    title: 'Chief Operating Officer & Chief Product Officer', org: 'Tribala (Founding Team)', orgUrl: 'https://tribala.travel/en', period: 'May 2023 - Feb 2025', logo: logoTribala,
    desc: [
      'Co-founded Tribala, taking it from the initial idea to launch and market validation.',
      'Reached €500k in revenue with 480 travellers across 50+ departures, validating the model across four sports and an inventory of 50+ packages.',
      'Built the acquisition engine: ~10,000 leads at €7 cost per lead, 16.5% landing page conversion, €108 customer acquisition cost, and a community grown from 0 to 14,400 followers.',
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
    icon: Layers,
    title: 'Tech and kite are already my two worlds',
    desc: "Technology and product are where I've built my career. Kite is the industry I know best and care most about. WOO sits exactly at that intersection: product, technology, data and the sport I love.",
  },
  {
    icon: RefreshCw,
    title: "I've already lived the product loop",
    desc: "At Snowit, I owned a tracking product hands-on, from product direction and testing to user feedback, development and release. At Tribala, I built the product and brand from the ground up as co-founder. Different sport, different sensor, but a very similar product loop.",
  },
  {
    icon: Gauge,
    title: "I've been working on bringing data into kiteboarding",
    desc: "I've been exploring how data and technology could become more integrated into kitesurfing, even before WOO was part of the picture. The Big Air Scoring System is one example, exploring how sensor data could make judging more objective and measurable.",
  },
  {
    icon: Users,
    title: 'Close to the riders pushing the sport forward',
    desc: 'I work directly with Lorenzo, Leonardo and Renato, giving me a front-row view of how top riders train, compete and use technology. I can bring that perspective directly into product decisions.',
  },
  {
    icon: Network,
    title: 'A real-world environment to build and test',
    desc: 'Through Flight Mode, the shop, school and wider network around Tarifa, I have a real-world environment where products can be tested, demonstrated and experienced by riders and the wider community.',
  },
  {
    icon: Clock,
    title: "I'm deliberately moving away from day-to-day execution",
    desc: "I'm moving from distribution to an agency model with Harlem, while delegating the operational side of the distribution, shop and school. I'm keeping the relationships and market access, while creating more space for the kind of product and strategic work where I can have the most impact.",
  },
  {
    icon: Heart,
    title: 'I do my best work when passion and work overlap',
    desc: "I've always chosen to build my work around things I'm genuinely passionate about. When I believe in what I'm building, I bring a different level of energy, curiosity and ownership. WOO sits right in that space.",
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
      'Turning user, rider and market feedback into a clear, prioritized product roadmap.',
      "Testing product releases hands-on before they reach riders, the way I did with Snowit's tracking algorithm.",
      'Connecting product decisions to business, marketing and user priorities.',
      'Bringing an outside view of the market and challenging assumptions from inside the product conversation.',
      'Turning feedback into measurable outcomes, with clear signals for what "better" actually means.',
    ],
  },
  {
    icon: Workflow,
    label: 'Process & Delivery',
    bullets: [
      'Creating a clear path from feedback to decision to shipped change.',
      'Connecting product, development and marketing around the same priorities.',
      'Creating a simple rhythm for priorities, decisions and follow-through.',
      'Building simple internal tools that create a shared source of truth and reduce friction across the team.',
      "Making sure important signals don't get lost between teams, conversations and execution.",
    ],
  },
];

// Same ambient "star field" as ChangeTheTide.tsx's DATA_DOTS, recolored to
// WOO's purple instead of the main site's yellow, for the same sense of
// constant, subtle movement behind the page.
const DATA_DOTS = [
  { x: 6, y: 14, size: 2.5, delay: 0.2, duration: 7, dx: 90, dy: -50 },
  { x: 13, y: 32, size: 2, delay: 1.4, duration: 8.5, dx: -70, dy: 60 },
  { x: 9, y: 55, size: 2, delay: 2.6, duration: 6.5, dx: 110, dy: 30 },
  { x: 17, y: 74, size: 2.5, delay: 0.6, duration: 9, dx: -60, dy: -80 },
  { x: 4, y: 88, size: 2, delay: 1.9, duration: 7.5, dx: 80, dy: -40 },
  { x: 24, y: 18, size: 2, delay: 3.1, duration: 6, dx: -100, dy: 40 },
  { x: 28, y: 46, size: 2.5, delay: 0.3, duration: 8, dx: 60, dy: 90 },
  { x: 21, y: 62, size: 2, delay: 2.2, duration: 7.2, dx: -80, dy: -60 },
  { x: 33, y: 85, size: 2, delay: 1.1, duration: 6.8, dx: 100, dy: -30 },
  { x: 39, y: 10, size: 2, delay: 2.8, duration: 9.2, dx: -50, dy: 100 },
  { x: 45, y: 28, size: 2, delay: 0.8, duration: 6.3, dx: 70, dy: -70 },
  { x: 41, y: 92, size: 2.5, delay: 3.4, duration: 8.1, dx: -110, dy: -20 },
  { x: 52, y: 15, size: 2, delay: 1.6, duration: 7.7, dx: 40, dy: 110 },
  { x: 58, y: 40, size: 2, delay: 2.4, duration: 6.6, dx: -90, dy: 50 },
  { x: 55, y: 68, size: 2.5, delay: 0.5, duration: 8.9, dx: 100, dy: 40 },
  { x: 63, y: 85, size: 2, delay: 1.8, duration: 7.1, dx: -60, dy: -100 },
  { x: 68, y: 22, size: 2.5, delay: 3.0, duration: 6.4, dx: 80, dy: 60 },
  { x: 72, y: 50, size: 2, delay: 0.9, duration: 8.4, dx: -100, dy: -40 },
  { x: 76, y: 12, size: 2, delay: 2.1, duration: 7.4, dx: 50, dy: 90 },
  { x: 79, y: 64, size: 2.5, delay: 1.3, duration: 6.9, dx: -70, dy: 70 },
  { x: 83, y: 34, size: 2, delay: 2.7, duration: 8.6, dx: 90, dy: -50 },
  { x: 87, y: 78, size: 2, delay: 0.4, duration: 7.3, dx: -80, dy: -60 },
  { x: 91, y: 20, size: 2.5, delay: 1.7, duration: 6.2, dx: 60, dy: 100 },
  { x: 94, y: 48, size: 2, delay: 2.9, duration: 8.8, dx: -110, dy: 20 },
  { x: 96, y: 90, size: 2, delay: 0.7, duration: 7.6, dx: 70, dy: -80 },
  { x: 89, y: 58, size: 2, delay: 3.3, duration: 6.7, dx: -50, dy: 90 },
  { x: 62, y: 6, size: 2, delay: 1.0, duration: 9.1, dx: 100, dy: 30 },
  { x: 35, y: 65, size: 2, delay: 2.5, duration: 7.9, dx: -90, dy: -50 },
  { x: 47, y: 80, size: 2, delay: 0.2, duration: 6.1, dx: 80, dy: 60 },
  { x: 14, y: 44, size: 2, delay: 1.5, duration: 8.3, dx: -70, dy: -90 },
];

type EcoNode = { id: string; name: string; short: string; desc: string; url?: string };

// Twelve nodes, evenly spaced around Nick — same distance, same angle
// increment. `short` is what fits on the small on-map card at every
// breakpoint; `name` (the full label) only shows in the reveal panel.
const ECO_NODES: EcoNode[] = [
  { id: 'casati-brothers', name: 'Casati Brothers', short: 'Casati Brothers', desc: 'Two World Champion kiteboarders I manage, already testing WOO.' },
  { id: 'flight-mode', name: 'Flight Mode', short: 'Flight Mode', desc: 'The operating company behind all of this.' },
  { id: 'tarifa', name: 'Connections & Ecosystem in Tarifa', short: 'Tarifa ecosystem', desc: "The wider network in one of the world's kite capitals — Balneario Beach Club, a newly-opened gym, and more." },
  { id: 'harlem-agency', name: 'Harlem Agency Network', short: 'Harlem network', desc: 'The dealer and school network across Italy and Spain that trusts me completely.' },
  { id: 'big-air', name: 'Big Air Scoring System', short: 'Scoring System', desc: "The scoring reform I'm building for the sport, independent but sensor-informed.", url: `${import.meta.env.BASE_URL}` },
  { id: 'tribala', name: 'Tribala', short: 'Tribala', desc: 'A licensed tour operator running kite clinics worldwide with my own riders and ambassadors coaching, Lorenzo included as a sponsored athlete.', url: 'https://tribala.travel/en' },
  { id: 'lorenzo-shop', name: 'Lorenzo Casati Shop', short: 'Casati Shop', desc: 'The flagship shop in Tarifa.' },
  { id: 'casati-harlem-school', name: 'Casati Harlem Pro School', short: 'Harlem School', desc: "The kite school I'm buying and rebranding in Tarifa." },
  { id: 'harlem-clubhouse', name: 'Harlem Clubhouse', short: 'Clubhouse', desc: 'The community events hub in Tarifa.' },
  { id: 'harlem-advisor', name: 'Harlem Advisor Role', short: 'Harlem Advisor', desc: 'Strategic Transformation Advisor at Harlem HQ — direction and prioritization, not day-to-day execution.' },
  { id: 'ralph-aaron', name: 'Ralf & Aaron', short: 'Ralf & Aaron', desc: "Harlem's kite designers (25 years of experience), feeding kite-design data back into product." },
  { id: 'kite-competition', name: 'Tarifa Kite Competition', short: 'Kite Competition', desc: "A new competition I'm organizing in Tarifa for 2027, aiming to be the first in the sport's history judged with sensor data and a reductionist, data-driven scoring approach." },
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
  ['kite-competition', 'big-air'],
  ['kite-competition', 'tarifa'],
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

// Full ecosystem: a fully meshed network — every node connects to every
// other — same interactive map at every breakpoint, just scaled down on
// small screens. Clicking a node only opens its description below; it
// never changes how any line or other node looks, since the point is that
// the whole mesh is already equally alive.
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
      {/* ── Radial network, same at every breakpoint ── */}
      <div className="relative aspect-square w-full max-w-3xl mx-auto">
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
          className={`absolute ${GRADIENT_BG} text-white rounded-full w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center text-center text-[10px] sm:text-sm md:text-base font-bold z-10`}
          style={{
            left: '50%', top: '50%', x: '-50%', y: '-50%', fontFamily: GRADIENT_FONT,
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.3, rotate: -25 }}
          animate={seen ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
        >
          Nick
        </motion.div>

        {nodeGeo.map((node, i) => {
          const active = selected === node.id;
          const angleRad = ((i / n) * 360 - 90) * (Math.PI / 180);
          const flyX = Math.cos(angleRad) * 90;
          const flyY = Math.sin(angleRad) * 90;
          return (
            <div key={node.id} className="absolute z-10" style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}>
              <motion.button
                type="button"
                onClick={() => setSelected((s) => (s === node.id ? null : node.id))}
                className="w-[62px] sm:w-[88px] md:w-[112px] min-h-[30px] sm:min-h-[42px] md:min-h-[50px] flex items-center justify-center text-center px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl md:rounded-2xl border bg-card/95 backdrop-blur-sm text-[7px] sm:text-[9px] md:text-[11px] font-semibold leading-snug"
                style={{
                  borderColor: active ? '#05F998' : 'var(--border)',
                  boxShadow: active ? '0 0 22px rgba(5,249,152,0.5), 0 6px 18px rgba(0,0,0,0.35)' : '0 2px 10px rgba(0,0,0,0.25)',
                }}
                initial={{ opacity: 0, scale: 0.4, x: flyX, y: flyY }}
                animate={seen ? { opacity: 1, scale: 1, x: 0, y: 0 } : {}}
                transition={{ type: 'spring', stiffness: 180, damping: 16, delay: seen ? 0 : 0.2 + i * 0.06 }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="truncate w-full block sm:hidden">{node.short}</span>
                <span className="hidden sm:block">{node.name}</span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* ── Click-to-reveal panel ── */}
      <div className="max-w-xl mx-auto mt-6 sm:mt-10 min-h-[96px]">
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
              <p className="text-center text-sm text-muted-foreground">Tap a node to explore.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Punchier alternative to FadeIn — spring-based scale+rise instead of a
// plain fade, used throughout this page for a much more dynamic scroll
// feel. FadeIn itself stays untouched since it's shared site-wide.
function PopIn({
  children, delay = 0, y = 30, scale = 0.9, duration, className,
}: { children: React.ReactNode; delay?: number; y?: number; scale?: number; duration?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay }}
    >
      {children}
    </motion.div>
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

// Same logo/title/org/period layout as AboutNick.tsx's Timeline component,
// but collapsed to an accordion here: only title/org/period show by
// default, bullets reveal on click. Same interaction pattern as the
// mobile Ecosystem/collaboration accordions elsewhere on this page.
function Timeline({ items }: { items: TimelineItem[] }) {
  const { ref, seen } = useInViewOnce<HTMLDivElement>();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div ref={ref} className="divide-y divide-border border-t border-border">
      {items.map((item, i) => {
        const hasDesc = item.desc.length > 0;
        const open = expanded === i;
        return (
          <motion.div
            key={item.title + item.org}
            className={`flex gap-4 py-5 ${hasDesc ? 'cursor-pointer' : ''}`}
            initial={{ opacity: 0, x: -36, scale: 0.97 }}
            animate={seen ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 240, damping: 20, delay: i * 0.07 }}
            onClick={hasDesc ? () => setExpanded((e) => (e === i ? null : i)) : undefined}
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
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.orgUrl ? (
                      <a
                        href={item.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-foreground underline decoration-dotted underline-offset-2 transition-colors"
                      >
                        {item.org}
                      </a>
                    ) : (
                      item.org
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.period}</div>
                </div>
                {hasDesc && (
                  <span className={`text-muted-foreground text-lg leading-none shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
                    +
                  </span>
                )}
              </div>
              {hasDesc && (
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                        {item.desc.map((line) => <li key={line}>{line}</li>)}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        );
      })}
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        @keyframes statPop { from { opacity: 0.3; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dataDrift {
          0% { opacity: 0.1; transform: translate(0, 0); }
          25% { opacity: 0.42; transform: translate(calc(var(--dx, 10px) * 0.6), calc(var(--dy, -10px) * -0.4)); }
          50% { opacity: 0.15; transform: translate(var(--dx, 10px), var(--dy, -10px)); }
          75% { opacity: 0.4; transform: translate(calc(var(--dx, 10px) * 0.3), calc(var(--dy, -10px) * 0.8)); }
          100% { opacity: 0.1; transform: translate(0, 0); }
        }
        .woo-data-dot { animation-name: dataDrift; animation-timing-function: linear; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) {
          .woo-data-dot { animation: none; opacity: 0.25; }
        }
      `}</style>

      {/* Ambient star-like data field, fixed behind the whole page, WOO purple */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
        {DATA_DOTS.map((d, i) => (
          <span
            key={i}
            className="woo-data-dot absolute rounded-full"
            style={{
              left: `${d.x}%`, top: `${d.y}%`,
              width: d.size, height: d.size,
              background: '#7A33C9',
              boxShadow: '0 0 5px 1px rgba(122,51,201,0.5)',
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              ['--dx' as string]: `${d.dx}px`,
              ['--dy' as string]: `${d.dy}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#29C9F5]/10 via-[#05F998]/5 to-[#7A33C9]/10 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative py-20 md:py-28">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={heroIn ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <WooLogo className="h-9" />
          </motion.div>

          <h1
            className="text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight"
            style={{ fontFamily: GRADIENT_FONT }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={heroIn ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.08 }}
            >
              Nick
            </motion.span>
            <motion.span
              className={`inline-block ${GRADIENT_TEXT}`}
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={heroIn ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.18 }}
            >
              x WOO
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={heroIn ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.32 }}
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
          </motion.div>
        </div>
      </section>

      {/* ───────── Why now ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={40} duration={0.7}>
            <SectionLabel>Why now</SectionLabel>
            <GradientHeading>Why now.</GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4">
              Lorenzo and Leonardo believe in where WOO is going. It's an ambitious new product, built by a new team, not the WOO everyone already knows. That kind of relaunch takes real iteration to get right, and they know that going in. Talking with them after the test, and separately with Renato, what became clear wasn't doubt about the product. It was how much a continuous, trusted connection between the people riding it and the people building it could be worth.
            </p>
            <p className="text-lg text-foreground font-semibold max-w-2xl leading-relaxed mt-4">
              I think I can be that connection.
            </p>
          </PopIn>
        </div>
      </section>

      {/* ───────── Why me, right now ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={40} duration={0.7}>
            <SectionLabel>Why me</SectionLabel>
            <GradientHeading>Why me, right now.</GradientHeading>
          </PopIn>

          <div className="space-y-4">
            {WHY_ME_NOW.map((item, i) => (
              <PopIn key={item.title} y={30} duration={0.6} delay={i * 0.06}>
                <Card className="p-6 flex gap-4 shadow-[var(--shadow-card)]">
                  <item.icon className="w-5 h-5 text-[#29C9F5] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              </PopIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Ecosystem ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={20} duration={0.5}>
            <SectionLabel>Ecosystem</SectionLabel>
          </PopIn>
          <motion.div
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-14 leading-tight"
            style={{ fontFamily: GRADIENT_FONT }}
            initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '50px', amount: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            <span className="text-foreground">1 + 1 + 1 + 1 </span>
            <span className={`inline-block ${GRADIENT_TEXT}`}>= 8, Not 4</span>
          </motion.div>

          <EcosystemNetwork />
        </div>
      </section>

      {/* ───────── What this could look like ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={40} duration={0.7}>
            <SectionLabel>In practice</SectionLabel>
            <GradientHeading>What this could look like.</GradientHeading>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed -mt-4 mb-10">
              This is the kind of work I've already done: hands-on product ownership at Snowit, from product direction and testing to turning user behaviour into what gets built next.
            </p>
          </PopIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {COLLABORATION_AREAS.map((area, i) => (
              <PopIn key={area.label} y={30} duration={0.6} delay={i * 0.08}>
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
              </PopIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Track record ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={40} duration={0.7}>
            <SectionLabel>Track record</SectionLabel>
            <GradientHeading>Track record.</GradientHeading>
          </PopIn>

          <PopIn y={30} duration={0.6} delay={0.05}>
            <h3 className="font-bold mb-4 -mt-6">Right now</h3>
            <Timeline items={CURRENT_ROLES} />
          </PopIn>

          <PopIn y={30} duration={0.6} delay={0.1}>
            <h3 className="font-bold mb-4 mt-12">Track record</h3>
            <Timeline items={TRACK_RECORD} />
          </PopIn>

          <PopIn y={30} duration={0.6} delay={0.1}>
            <h3 className="font-bold mb-4 mt-12">Education</h3>
            <Timeline items={EDUCATION} />
          </PopIn>
        </div>
      </section>

      {/* ───────── The Snowit tracking app ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={40} duration={0.7}>
            <SectionLabel>Product, hands-on</SectionLabel>
            <GradientHeading>The Snowit tracking app.</GradientHeading>
            <p className="text-lg text-foreground font-semibold max-w-2xl leading-relaxed -mt-4">
              I've done this exact job before, on a different sensor: GPS ski tracking then, WOO's sensor tracking now, same loop of product ownership, testing, and turning user behavior into what gets built next.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mt-4">
              GPS-based mobile application for skiers and snowboarders, designed to track and analyse on-slope performance. The app records distance travelled, elevation, number of runs, average and maximum speed, and calories burned, while allowing users to identify ski runs and visualise their routes on 3D maps. It also includes social and gamification features, such as challenges, rewards, performance comparison and social sharing.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mt-4 mb-10">
              As COO and CPO at Snowit, product wasn't a side responsibility. On the GPS ski tracking app I owned it directly: ownership, testing, and the connective tissue between dev, design, marketing, and finance.
            </p>
          </PopIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {SNOWIT_CPO.map((item, i) => (
              <PopIn key={item.title} y={24} duration={0.5} delay={i * 0.05}>
                <Card className="p-5 flex items-start gap-3 h-full">
                  <item.icon className="w-5 h-5 text-[#7A33C9] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              </PopIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── The Tarifa hub ───────── */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={40} duration={0.7}>
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
          </PopIn>
        </div>
      </section>

      {/* ───────── Closing ───────── */}
      <section>
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <PopIn y={30} duration={0.7}>
            <p
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight"
              style={{ fontFamily: GRADIENT_FONT }}
            >
              <span className="block text-foreground">The right product.</span>
              <span className="block text-foreground">The right moment.</span>
              <span className="block text-foreground">The right people.</span>
              <span className="block text-foreground">The right place to build.</span>
            </p>
          </PopIn>

          <PopIn y={24} duration={0.6} delay={0.2}>
            <p
              className="mt-10 md:mt-14 text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight"
              style={{ fontFamily: GRADIENT_FONT }}
            >
              <span className={`inline-block ${GRADIENT_TEXT}`}>Let's build the future of kiting, together</span>
            </p>
          </PopIn>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center gap-4">
          <WooLogo className="h-7 opacity-70" />
          <a
            href="https://naick1994.github.io/about-nick/about-nick"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <img src={nickAvatar} alt="Nicholas Baruffaldi" className="w-7 h-7 rounded-full object-cover border border-border" />
            Built and prototyped by Nicholas Baruffaldi
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <DeployTag />
      </footer>
    </div>
  );
}
