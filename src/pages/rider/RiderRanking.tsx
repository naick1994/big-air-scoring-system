import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GKA_BIG_AIR_MEN_RANKINGS_2026 } from '@/data/gkaRankings';

const RIDER_NAME = 'Leonardo Casati';

// Fallback initials avatar for the rare case a hotlinked GKA photo fails to load.
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const COUNTRY_FLAGS: Record<string, string> = {
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Spain': '🇪🇸',
  'Germany': '🇩🇪',
  'Israel': '🇮🇱',
  'Brazil': '🇧🇷',
  'USA': '🇺🇸',
  'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦',
  'Denmark': '🇩🇰',
  'France': '🇫🇷',
  'Cyprus': '🇨🇾',
  'Great Britain': '🇬🇧',
  'Greece': '🇬🇷',
};

function AthletePhoto({ name, photoUrl }: { name: string; photoUrl: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      onError={() => setFailed(true)}
      className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
    />
  );
}

export default function RiderRanking() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-1">GKA Big Air Rankings 2026</h2>
      <p className="text-muted-foreground mb-8">Men's division — GKA Kite World Tour</p>

      <Card className="overflow-hidden shadow-[var(--shadow-card)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border bg-muted/40">
              <th className="text-left py-3 px-4 font-semibold w-16">Rank</th>
              <th className="text-left py-3 px-4 font-semibold">Athlete</th>
              <th className="text-left py-3 px-4 font-semibold">Country</th>
              <th className="text-right py-3 px-4 font-semibold">Points</th>
            </tr>
          </thead>
          <tbody>
            {GKA_BIG_AIR_MEN_RANKINGS_2026.map((row, idx) => {
              const isMe = row.athlete === RIDER_NAME;
              return (
                <tr
                  key={idx}
                  className={`border-b border-border transition-colors ${
                    isMe ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-muted-foreground">#{row.rank}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <AthletePhoto name={row.athlete} photoUrl={row.photoUrl} />
                      <span className={`font-medium ${isMe ? 'text-primary font-bold' : ''}`}>{row.athlete}</span>
                      {isMe && (
                        <Badge className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/20 text-[10px]">
                          You
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-2xl" title={row.country}>{COUNTRY_FLAGS[row.country] ?? row.country}</td>
                  <td className="py-3 px-4 text-right font-semibold">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
