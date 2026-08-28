import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DeployTag } from '@/components/DeployTag';
import {
  MapPin, Wind, Home, Flag, Sparkles, Download, ExternalLink,
  Camera, Waves, PartyPopper, Sunrise, Instagram, Activity, Ruler, Menu, ArrowUpRight,
} from 'lucide-react';
import nickAvatar from '@/assets/nick-avatar.jpg';
import wooLogo from '@/assets/woo-logo.svg';
import balnearioLogo from '@/assets/woo-tarifa/balneario-logo.png';
import balnearioLogoWhite from '@/assets/woo-tarifa/balneario-logo-white.png';
import balnearioLogoCircle from '@/assets/woo-tarifa/balneario-logo-circle.png';
import balnearioLogosZip from '@/assets/woo-tarifa/balneario-logos.zip';
import photo1 from '@/assets/woo-tarifa/photo-1.jpg';
import photo2 from '@/assets/woo-tarifa/photo-2.jpg';
import photo3 from '@/assets/woo-tarifa/photo-3.jpg';
import photo4 from '@/assets/woo-tarifa/photo-4.jpg';
import photo5 from '@/assets/woo-tarifa/photo-5.jpg';
import photo6 from '@/assets/woo-tarifa/photo-6.jpg';
import photo7 from '@/assets/woo-tarifa/photo-7.jpg';
import photo8 from '@/assets/woo-tarifa/photo-8.jpg';
import photo9 from '@/assets/woo-tarifa/photo-9.png';
import photo10 from '@/assets/woo-tarifa/photo-10.png';
import stayPenthouse from '@/assets/woo-tarifa/stays/penthouse-pool-parking.jpg';
import stayLaMarina from '@/assets/woo-tarifa/stays/la-marina.jpg';
import stayLaCasaAzul from '@/assets/woo-tarifa/stays/la-casa-azul.jpg';
import stayRafa from '@/assets/woo-tarifa/stays/rafa-penthouse.jpg';
import stayEventTarifa from '@/assets/woo-tarifa/stays/event-tarifa-qhotels.jpg';

const MAP_URL = 'https://www.google.com/maps/d/viewer?mid=1A9sb-kfoNEzI4vGUT5ONC5fGzRetNqc';
const MAP_EMBED_URL = 'https://www.google.com/maps/d/embed?mid=1A9sb-kfoNEzI4vGUT5ONC5fGzRetNqc';
const WINDGURU_URL = 'https://www.windguru.cz/48780';
const COZY_HOUSE_URL = 'https://www.tarifacozyhouse.com/search-results/?arrive=02-09-2026&depart=04-09-2026&guest=3&adult_guest=3&child_guest=0';
const BALNEARIO_INSTAGRAM_URL = 'https://www.instagram.com/balneariotarifa/';

const NAV_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Schedule', href: '#schedule' },
  { label: 'Location', href: '#location' },
  { label: 'Forecast', href: WINDGURU_URL, external: true },
  { label: 'The test', href: '#measuring' },
  { label: 'Setup', href: '#setup' },
  { label: 'Activation ideas', href: '#activation-ideas' },
  { label: 'Where to stay', href: '#where-to-stay' },
  { label: 'Marketing assets', href: '#downloads' },
];

const PHOTOS = [
  { src: photo1, file: 'photo-1.jpg' },
  { src: photo2, file: 'photo-2.jpg' },
  { src: photo3, file: 'photo-3.jpg' },
  { src: photo4, file: 'photo-4.jpg' },
  { src: photo5, file: 'photo-5.jpg' },
  { src: photo6, file: 'photo-6.jpg' },
  { src: photo7, file: 'photo-7.jpg' },
  { src: photo8, file: 'photo-8.jpg' },
  { src: photo9, file: 'photo-9.png' },
  { src: photo10, file: 'photo-10.png' },
];

type Stay = {
  name: string;
  cover: string;
  price: string;
  priceNote: string;
  facts: string;
  source: string;
  url: string;
};

const STAYS: Stay[] = [
  {
    name: 'Penthouse | Pool | Parking',
    cover: stayPenthouse,
    price: '€536',
    priceNote: 'total, 2–4 Sep (2 nights)',
    facts: '2 bedrooms · 2 bathrooms · 4 guests · pool · parking',
    source: 'Tarifa Cozy House',
    url: 'https://www.tarifacozyhouse.com/properties/penthouse-pool-parking/?arrive=02-09-2026&depart=04-09-2026',
  },
  {
    name: 'La Marina | Pool | Parking',
    cover: stayLaMarina,
    price: '€491',
    priceNote: 'total, 2–4 Sep (2 nights)',
    facts: '2 bedrooms · 2 bathrooms · 4 guests · pool · parking',
    source: 'Tarifa Cozy House',
    url: 'https://www.tarifacozyhouse.com/properties/la-marina-pool-parking/?arrive=02-09-2026&depart=04-09-2026',
  },
  {
    name: 'La Casa Azul',
    cover: stayLaCasaAzul,
    price: '€578',
    priceNote: 'total, 2–4 Sep (2 nights)',
    facts: '2 bedrooms · 2 bathrooms · 4 guests · Atlantic view',
    source: 'Tarifa Cozy House',
    url: 'https://www.tarifacozyhouse.com/properties/la-casa-azul/?arrive=02-09-2026&depart=04-09-2026',
  },
  {
    name: 'Fantastic penthouse with pool and sea view',
    cover: stayRafa,
    price: '€774',
    priceNote: 'total, 1–5 Sep (4 nights)',
    facts: '2 bedrooms · 2 bathrooms · 4 guests · 4.97★ (39 reviews)',
    source: 'Airbnb · Host Rafa',
    url: 'https://www.airbnb.it/rooms/560866523099672825?adults=3&check_in=2026-09-01&check_out=2026-09-05',
  },
  {
    name: 'Event Tarifa by QHotels - Adults Recommended',
    cover: stayEventTarifa,
    price: '€903',
    priceNote: 'total, 2 rooms, 1–4 Sep (3 nights)',
    facts: '4★ hotel · breakfast included · pool · 9.1 Excellent (1,177 reviews)',
    source: 'Booking.com',
    url: 'https://www.booking.com/hotel/es/event-tarifa-by-qhotels-adults-recommended.it.html?checkin=2026-09-02&checkout=2026-09-04&group_adults=3&no_rooms=2&group_children=0',
  },
];

// Fires once when the wrapped element scrolls into view, mirroring the
// AboutNick page's reveal pattern for sections that don't use FadeIn.
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


function SectionLabel({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
      <Icon className="w-3.5 h-3.5 text-primary" />
      {children}
    </div>
  );
}

type ScheduleBlock = {
  time?: string;
  title: string;
  desc: string;
  badge?: string;
  badgeVariant?: 'default' | 'outline';
  icon?: typeof MapPin;
};

function ScheduleDay({
  dayLabel, dateLabel, weekday, forecast, blocks, parallel,
}: {
  dayLabel: string;
  dateLabel: string;
  weekday: string;
  forecast?: string;
  blocks: ScheduleBlock[];
  parallel?: { time?: string; left: ScheduleBlock; right: ScheduleBlock };
}) {
  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between flex-wrap gap-2 mb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-1">{dayLabel}</div>
          <h3 className="text-xl font-bold">{dateLabel} <span className="text-muted-foreground font-normal">· {weekday}</span></h3>
        </div>
        {forecast && (
          <Badge variant="outline" className="border-primary/40 text-primary gap-1">
            <Wind className="w-3 h-3" /> Forecast: {forecast}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {blocks.map((b) => (
          <div key={b.title} className="flex gap-3 rounded-lg bg-muted/40 p-3">
            {b.time && (
              <div className="text-xs font-mono text-muted-foreground w-24 shrink-0 pt-0.5 tabular-nums">{b.time}</div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                {b.title}
                {b.badge && <Badge className="text-[10px]">{b.badge}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}

        {parallel && (
          <div>
            {parallel.time && (
              <div className="text-xs font-mono text-muted-foreground mb-3 tabular-nums">{parallel.time} · in parallel</div>
            )}
            <div className="grid md:grid-cols-2 gap-3">
              {[parallel.left, parallel.right].map((b) => (
                <div key={b.title} className="rounded-lg border border-border p-4">
                  {b.time && <div className="text-xs font-mono text-muted-foreground mb-1 tabular-nums">{b.time}</div>}
                  <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                    {b.icon && <b.icon className="w-4 h-4 text-primary shrink-0" />}
                    {b.title}
                    {b.badge && (
                      <Badge
                        variant={b.badgeVariant}
                        className={`text-[10px] ${b.badgeVariant === 'outline' ? 'border-primary/40 text-primary' : ''}`}
                      >
                        {b.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Reveal({ children }: { children: ReactNode }) {
  const { ref, seen } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  );
}

export default function WooTarifa() {
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setHeroIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───────── Nav ───────── */}
      <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="hidden sm:flex items-center gap-6 py-3 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex sm:hidden items-center justify-end py-3">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" aria-label="Open menu" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetTitle className="text-left mb-2">Menu</SheetTitle>
                <div className="flex flex-col gap-1 mt-4">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border last:border-0"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative py-20 md:py-28">
          <div
            className="flex items-center gap-4 mb-8"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <img src={wooLogo} alt="Woo" className="h-9" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            <span className="block">TARIFA</span>
            <span className="block text-primary">TEST SESSIONS</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mt-6"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            }}
          >
            2–4 September 2026
          </p>
        </div>
      </section>

      {/* ───────── Schedule ───────── */}
      <section id="schedule" className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={Sunrise}>Schedule</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Three days in Tarifa.</h2>
          </Reveal>

          <div className="space-y-6">
            <Reveal>
              <ScheduleDay
                dayLabel="Day 1"
                dateLabel="2 September"
                weekday="Tuesday"
                blocks={[
                  {
                    title: 'Balneario setup',
                    desc: 'Same-day setup at the beach club: TV for live data, Woo corner, flags, and signage.',
                  },
                ]}
              />
            </Reveal>

            <Reveal>
              <ScheduleDay
                dayLabel="Day 2"
                dateLabel="3 September"
                weekday="Wednesday"
                blocks={[
                  {
                    time: '10:00–13:00',
                    title: 'Sensor calibration & setup',
                    desc: 'With Marina and the local team.',
                  },
                  {
                    time: '13:00–15:00',
                    title: 'Lunch at the Balneario',
                    desc: 'Team lunch at the beach club.',
                  },
                ]}
                parallel={{
                  time: '15:00–20:00',
                  left: {
                    title: 'Water test session',
                    desc: 'Open to any rider who wants to join, not just Lorenzo and Leonardo. Not promoted on public social channels.',
                    badge: 'Invite-only',
                    badgeVariant: 'outline',
                    icon: Waves,
                  },
                  right: {
                    title: 'AR goggles demo: The Future Of Kiting',
                    desc: 'Public demo of the Woo AR goggles at the beach club, open to everyone and promoted on social media.',
                    badge: 'Public',
                    icon: Sparkles,
                  },
                }}
              />
            </Reveal>

            <Reveal>
              <ScheduleDay
                dayLabel="Day 3"
                dateLabel="4 September"
                weekday="Thursday"
                blocks={[
                  {
                    time: '10:00–14:00',
                    title: 'Buffer / Plan B',
                    desc: "Held in reserve in case there's no wind on Thursday.",
                  },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Location ───────── */}
      <section id="location" className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={MapPin}>Location</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Balneario Beach Club Tarifa.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              The spot right in front of the club, with 2 fixed cameras covering the water.
            </p>
          </Reveal>

          <Reveal>
            <Card className="overflow-hidden shadow-[var(--shadow-card)] -mx-4 sm:mx-0 rounded-none sm:rounded-lg">
              <iframe
                src={MAP_EMBED_URL}
                title="Map of the Balneario Beach Club Tarifa area with pins for the spot, fixed cameras, and parking"
                className="w-full aspect-[3/4] sm:aspect-video border-0"
                loading="lazy"
              />
              <div className="p-6">
                <Button asChild>
                  <a href={MAP_URL} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <p className="text-sm text-muted-foreground mt-4 flex items-start gap-2 max-w-2xl">
              <Camera className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              The two fixed cameras double as a reference to cross-check the sensor data, and record every jump for Technicality &amp; Execution review.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── What we're measuring ───────── */}
      <section id="measuring" className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={Activity}>The test</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sensor Test Protocol.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              A private field test, not a competition. The first step toward feeding real sensor data into the Reductionist Scoring System, a single holistic score built from Woo sensor readings and reviewed video, on real jumps with real riders.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-6">
                <Badge className="mb-3 gap-1"><Ruler className="w-3 h-3" /> Sensor-based</Badge>
                <p className="text-xs text-muted-foreground mb-4">Measured directly by the Woo sensor, every rider, every jump.</p>
                <ul className="text-sm space-y-1.5">
                  <li>Height</li>
                  <li>Amplitude (travel distance)</li>
                  <li>Kite angle</li>
                  <li>Yank power</li>
                  <li>Free fall</li>
                </ul>
              </Card>
              <Card className="p-6">
                <Badge variant="outline" className="mb-3 gap-1"><Camera className="w-3 h-3" /> Video-checked</Badge>
                <p className="text-xs text-muted-foreground mb-4">Not sensor-based, reviewed from the two fixed camera feeds.</p>
                <ul className="text-sm space-y-1.5">
                  <li><span className="font-medium">Technicality:</span> rotations, rotation axis, board off, board flip, board spin</li>
                  <li><span className="font-medium">Execution:</span> style, stability &amp; control, landing control, board control, kite control</li>
                </ul>
              </Card>
            </div>
          </Reveal>

          <Reveal>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl">
              Output: a sensor dataset across all jumps, plus a full video archive for review and as a cross-check on the sensor-recorded parameters.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── Setup ───────── */}
      <section id="setup" className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={Flag}>Setup</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Confirmed on-site.</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-5 flex items-center gap-3">
                <Flag className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">Flags around the beach club</span>
              </Card>
              <Card className="p-5 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">TV with live jump data</span>
              </Card>
              <Card className="p-5 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">Woo corner at the club</span>
              </Card>
              <Card className="p-5">
                <a href={BALNEARIO_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <Instagram className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">
                    Co-marketing with{' '}
                    <span className="text-primary font-semibold underline underline-offset-2 group-hover:no-underline">
                      @balneariotarifa
                    </span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
                </a>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Activation ideas ───────── */}
      <section id="activation-ideas" className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={Sparkles}>Activation ideas</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Proposals, not locked in.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              A few ideas floating around for the public demo. Nothing here is a confirmed plan yet.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-5 border-dashed">
                <Badge variant="outline" className="text-[10px] mb-3">Idea</Badge>
                <p className="text-sm">Try the AR goggles ("The Future Of Kiting"), get a free beer or a discount.</p>
              </Card>
              <Card className="p-5 border-dashed">
                <Badge variant="outline" className="text-[10px] mb-3">Idea</Badge>
                <p className="text-sm">
                  A free beer or a discount for anyone who posts a story tagging{' '}
                  <a href={BALNEARIO_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline underline-offset-2 hover:no-underline inline-flex items-center gap-0.5">
                    <Instagram className="w-3 h-3" /> @balneariotarifa
                  </a>{' '}
                  and Woo.
                </p>
              </Card>
              <Card className="p-5 border-dashed">
                <Badge variant="outline" className="text-[10px] mb-3 gap-1"><PartyPopper className="w-3 h-3" /> Idea</Badge>
                <p className="text-sm">Evening activation + party at the Balneario to wrap up Day 2.</p>
              </Card>
              <Card className="p-5 border-dashed">
                <Badge variant="outline" className="text-[10px] mb-3 gap-1"><Activity className="w-3 h-3" /> Idea</Badge>
                <p className="text-sm">Live "biggest jump of the day" leaderboard on the TV, pulled straight from the Woo sensor data. Top rider wins a prize.</p>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Where to stay ───────── */}
      <section id="where-to-stay" className="border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={Home}>Where to stay</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Recommended stays.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Picked for location and easy parking. Prices and availability verified for the event dates. Direct link to book.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              {STAYS.map((stay) => (
                <Card key={stay.name} className="overflow-hidden shadow-[var(--shadow-card)]">
                  <div className="relative">
                    <img src={stay.cover} alt={stay.name} className="w-full aspect-[16/10] object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-muted-foreground mb-1">{stay.source}</div>
                    <h3 className="font-bold mb-2 leading-tight">{stay.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{stay.facts}</p>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-bold text-primary">{stay.price}</div>
                        <div className="text-[11px] text-muted-foreground">{stay.priceNote}</div>
                      </div>
                      <Button asChild size="sm">
                        <a href={stay.url} target="_blank" rel="noopener noreferrer">
                          Book <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <a
              href={COZY_HOUSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              See all Tarifa Cozy House options <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ───────── Downloads ───────── */}
      <section id="downloads">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <Reveal>
            <SectionLabel icon={Download}>Marketing assets</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Logos &amp; photos.</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <Card className="p-5 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 h-10">
                  <div className="bg-white rounded px-1.5 h-9 flex items-center">
                    <img src={balnearioLogo} alt="Balneario Beach Club Tarifa logo" className="h-7" />
                  </div>
                  <img src={balnearioLogoCircle} alt="Balneario Beach Club Tarifa badge logo" className="h-9" />
                  <div className="bg-neutral-800 rounded px-1.5 h-9 flex items-center">
                    <img src={balnearioLogoWhite} alt="Balneario Beach Club Tarifa white logo" className="h-4" />
                  </div>
                </div>
                <a
                  href={balnearioLogosZip}
                  download="balneario-logos.zip"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2"
                >
                  <Download className="w-3 h-3" /> Logos (.zip)
                </a>
              </Card>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PHOTOS.map((photo, i) => (
                <Card key={photo.file} className="overflow-hidden group relative">
                  <img src={photo.src} alt={`Balneario Beach Club Tarifa, photo ${i + 1}`} className="w-full aspect-square object-cover" />
                  <a
                    href={photo.src}
                    download={photo.file}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors"
                    aria-label={`Download photo ${i + 1}`}
                  >
                    <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <Link
            to="/about-nick"
            className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <img src={nickAvatar} alt="Nicholas Baruffaldi" className="w-7 h-7 rounded-full object-cover border border-border" />
            Built and prototyped by Nicholas Baruffaldi
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <DeployTag />
      </footer>
    </div>
  );
}
