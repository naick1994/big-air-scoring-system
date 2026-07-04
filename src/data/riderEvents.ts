import { GKA_BIG_AIR_MEN_RANKINGS_2026 } from './gkaRankings';

// Real final standings for the "Lords of Tram" GKA Big Air Kite World Cup,
// France 2026 (one of the events contributing to the 2026 season ranking).
// Source: athlete-provided screenshots of the GKA live bracket + the
// @gkakiteworldtour Instagram results post.
export interface EventStandingRow {
  rank: number;
  athlete: string;
  points: number;
}

function photoFor(athlete: string): string {
  return GKA_BIG_AIR_MEN_RANKINGS_2026.find(r => r.athlete === athlete)?.photoUrl ?? '';
}

export function getCountryForAthlete(athlete: string): string {
  return GKA_BIG_AIR_MEN_RANKINGS_2026.find(r => r.athlete === athlete)?.country ?? '';
}

export const LORDS_OF_TRAM_FRANCE_2026 = {
  name: 'Lords of Tram — GKA Big Air Kite World Cup',
  location: 'France',
  date: '2026-03-31',
  standings: [
    { rank: 1, athlete: 'Jamie Overbeek', points: 1000 },
    { rank: 2, athlete: 'Finn Flügel', points: 870 },
    { rank: 3, athlete: 'Leonardo Casati', points: 770 },
    { rank: 4, athlete: 'Zac Adams', points: 700 },
    { rank: 5, athlete: 'Cohan Van Dijk', points: 580 },
    { rank: 5, athlete: 'Jeremy Burlando', points: 580 },
    { rank: 7, athlete: 'Lorenzo Casati', points: 420 },
  ] as EventStandingRow[],
};

export function getPhotoForAthlete(athlete: string): string {
  return photoFor(athlete);
}

// Leonardo's own result at each event this season, in the order they're
// presented — used for the Progression view. Units differ between events
// (tour points vs. this reductionist system's own jump score) since we only
// have full Woo/jump-level data for Mykonos, not France.
export const LEONARDO_EVENT_TIMELINE = [
  {
    event: 'Lords of Tram — France 2026',
    date: '2026-03-31',
    headline: '3rd place',
    detail: '770 tour points · lost to Jamie Overbeek (1st) and Finn Flügel (2nd)',
  },
  {
    event: 'Capital.com GKA Big Air World Cup — Mykonos 2026',
    date: null,
    headline: '23.77 / 30',
    detail: 'Reductionist system score across his 3 real jumps — see Results',
  },
];
