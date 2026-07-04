import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import { useScoring } from '@/contexts/ScoringContext';
import { DEMO_JUMPS_BASE, buildDemoJumpResult } from '@/data/demoJumps';

// Internal utility page (not linked from the nav) — lets the chief judge
// instantly reset the Scorer to Leonardo's real Mykonos jumps without
// walking through the Demo page's video/Execution-reveal flow. Useful for
// quickly resetting to a known-good state before/during a live pitch demo.
export default function Admin() {
  const navigate = useNavigate();
  const {
    setActivePreset, setJump1Params, setJump2Params, setJump3Params,
    setJump1Result, setJump2Result, setJump3Result,
    setRealTotalReference, setJumpMeta, heightAmplitudeThresholds,
  } = useScoring();

  const loadRealScores = () => {
    // Wipe the Demo page's own persisted state (Execution reveals + any
    // Judge Overrides made there) so it also comes back to its pristine
    // starting point, not just the Result page.
    localStorage.removeItem('demoExecutionScores');
    localStorage.removeItem('demoJudgeOverrides');

    const results = DEMO_JUMPS_BASE.map((_, i) => buildDemoJumpResult(i, heightAmplitudeThresholds));
    setActivePreset('GKA');
    setJump1Params(results[0].jumpParameters);
    setJump2Params(results[1].jumpParameters);
    setJump3Params(results[2].jumpParameters);
    setJump1Result(results[0]);
    setJump2Result(results[1]);
    setJump3Result(results[2]);
    setRealTotalReference(DEMO_JUMPS_BASE.reduce((sum, j) => sum + j.realScore, 0));
    setJumpMeta(DEMO_JUMPS_BASE.map(j => ({ trick: j.trick, category: j.category, athlete: j.athlete })));
    navigate('/result');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold mb-1">Admin</h2>
      <p className="text-muted-foreground mb-8">Utilities for pitch/demo prep — not part of the normal judging flow.</p>

      <Card className="p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-semibold mb-2">Reset Everything to Real Demo Scores</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Instantly loads Leonardo Casati's 3 real Mykonos jumps into the Scorer and jumps to Result — same data as
          "Load Demo in Scorer" on the Demo page, but skipping the video/Execution-reveal walkthrough. Also clears any
          saved Execution input or Judge Overrides on the Demo page, so both Result and Demo come back to their
          original starting state.
        </p>
        <Button onClick={loadRealScores} className="gap-2">
          <Wrench className="w-4 h-4" />
          Reset to Real Scores
        </Button>
      </Card>
    </div>
  );
}
