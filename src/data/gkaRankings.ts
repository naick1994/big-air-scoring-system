// Snapshot of the GKA Kite World Tour 2026 Big Air rankings (Men's category
// only, since that's the rider's own division) — hardcoded, no backend/live
// fetch available. Source: https://www.gkakiteworldtour.com/rankings-2026/big-air/
// photoUrl hotlinks the athlete's own profile photo hosted on GKA's site
// (panel.gkakiteworldtour.com) rather than storing a copy in this repo.
// Update this list by hand if the standings change before the pitch.
export interface RankingRow {
  rank: number;
  athlete: string;
  country: string;
  points: number;
  photoUrl: string;
}

const GKA_PHOTO_BASE = 'https://panel.gkakiteworldtour.com/img/profilethumb/';

export const GKA_BIG_AIR_MEN_RANKINGS_2026: RankingRow[] = [
  { rank: 1, athlete: 'Leonardo Casati', country: 'Italy', points: 1770, photoUrl: `${GKA_PHOTO_BASE}leonardo-casati.jpg` },
  { rank: 2, athlete: 'Jamie Overbeek', country: 'Netherlands', points: 1700, photoUrl: `${GKA_PHOTO_BASE}Jamie-Overbeek.jpg` },
  { rank: 3, athlete: 'Lorenzo Casati', country: 'Spain', points: 1290, photoUrl: `${GKA_PHOTO_BASE}Lorenzo-Casati.jpg` },
  { rank: 4, athlete: 'Finn Flügel', country: 'Germany', points: 1290, photoUrl: `${GKA_PHOTO_BASE}finn-flugel.jpg` },
  { rank: 5, athlete: 'Shahar Tsabary', country: 'Israel', points: 1190, photoUrl: `${GKA_PHOTO_BASE}shahar-tsabary.jpg` },
  { rank: 6, athlete: 'Josué San Ferreira', country: 'Brazil', points: 1080, photoUrl: `${GKA_PHOTO_BASE}Josue-San-Ferreira.jpg` },
  { rank: 7, athlete: 'Jeremy Burlando', country: 'Spain', points: 1080, photoUrl: `${GKA_PHOTO_BASE}Jeremy-Burlando.jpg` },
  { rank: 8, athlete: 'Zac Adams', country: 'USA', points: 980, photoUrl: `${GKA_PHOTO_BASE}zac-adams.jpg` },
  { rank: 9, athlete: 'Andrea Principi', country: 'Italy', points: 920, photoUrl: `${GKA_PHOTO_BASE}andrea-principi.jpg` },
  { rank: 10, athlete: 'Cohan Van Dijk', country: 'Netherlands', points: 720, photoUrl: `${GKA_PHOTO_BASE}Cohan-Van-Dijk.jpg` },
  { rank: 11, athlete: 'Hugo Wigglesworth', country: 'New Zealand', points: 670, photoUrl: `${GKA_PHOTO_BASE}hugo-wigglesworth.jpg` },
  { rank: 12, athlete: 'Jason Van Der Spuy', country: 'South Africa', points: 640, photoUrl: `${GKA_PHOTO_BASE}Jason-Van-Der-Spuy.jpg` },
  { rank: 13, athlete: 'Marten Koblischke', country: 'Germany', points: 560, photoUrl: `${GKA_PHOTO_BASE}marten-koblischke.jpg` },
  { rank: 14, athlete: 'Maxwell Dahl', country: 'Denmark', points: 560, photoUrl: `${GKA_PHOTO_BASE}maxwell-dahl.jpg` },
  { rank: 15, athlete: 'Giel Vlugt', country: 'Netherlands', points: 510, photoUrl: `${GKA_PHOTO_BASE}Giel-Vlugt.jpg` },
  { rank: 16, athlete: 'Parker Sage', country: 'USA', points: 420, photoUrl: `${GKA_PHOTO_BASE}parker-sage.jpg` },
  { rank: 17, athlete: 'Nathan Texier', country: 'France', points: 420, photoUrl: `${GKA_PHOTO_BASE}Nathan-Texier.jpg` },
  { rank: 18, athlete: 'Stino Mul', country: 'Netherlands', points: 420, photoUrl: `${GKA_PHOTO_BASE}Stino-Mul.jpg` },
  { rank: 19, athlete: 'Luca Ceruti', country: 'South Africa', points: 370, photoUrl: `${GKA_PHOTO_BASE}luca-ceruti.jpg` },
  { rank: 20, athlete: 'Yucel Paralik', country: 'Cyprus', points: 280, photoUrl: `${GKA_PHOTO_BASE}yucel-paralik.jpg` },
  { rank: 21, athlete: 'Josh Gillitt', country: 'South Africa', points: 280, photoUrl: `${GKA_PHOTO_BASE}josh-gillitt.jpg` },
  { rank: 22, athlete: 'Baptiste Jacquemain', country: 'France', points: 280, photoUrl: `${GKA_PHOTO_BASE}Baptiste-Jacquemain.jpg` },
  { rank: 22, athlete: 'Eliott Bouton', country: 'France', points: 280, photoUrl: `${GKA_PHOTO_BASE}eliott-bouton.jpg` },
  { rank: 24, athlete: 'Kimo Verkerk', country: 'Netherlands', points: 230, photoUrl: `${GKA_PHOTO_BASE}kimo-verkerk.jpg` },
  { rank: 25, athlete: 'Timo Boersema', country: 'Netherlands', points: 140, photoUrl: `${GKA_PHOTO_BASE}timo-boersema.jpg` },
  { rank: 26, athlete: 'Baptiste Bourdoulous', country: 'Greece', points: 90, photoUrl: `${GKA_PHOTO_BASE}Baptiste-Bourdoulous.jpg` },
  { rank: 26, athlete: 'Jinne Boer', country: 'Netherlands', points: 90, photoUrl: `${GKA_PHOTO_BASE}jinne-boer.jpg` },
  { rank: 26, athlete: 'Max Tullett', country: 'Great Britain', points: 90, photoUrl: `${GKA_PHOTO_BASE}max-tullett.jpg` },
  { rank: 29, athlete: 'Clement Huot', country: 'France', points: 90, photoUrl: `${GKA_PHOTO_BASE}Clement-Huot.jpg` },
];
