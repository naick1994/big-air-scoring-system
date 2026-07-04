import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Gavel, X } from 'lucide-react';
import { JudgeOverride as JudgeOverrideType } from '@/types/scoring';

interface JudgeOverrideProps {
  calculatedScore: number;
  maxScore?: number;
  override: JudgeOverrideType | null | undefined;
  onApply: (override: JudgeOverrideType) => void;
  onRemove: () => void;
}

// Lets the chief judge manually set a jump's final score for a genuinely
// extraordinary jump, overriding the reductionist calculation — but always
// keeps the calculated number visible alongside it, with a mandatory reason,
// so the override is an accountable exception rather than a silent backdoor
// back to subjective judging.
export function JudgeOverride({ calculatedScore, maxScore = 10, override, onApply, onRemove }: JudgeOverrideProps) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(calculatedScore.toFixed(2));
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    const parsed = parseFloat(score);
    if (isNaN(parsed) || parsed < 0 || parsed > maxScore || !reason.trim()) return;
    onApply({ score: parsed, reason: reason.trim() });
    setOpen(false);
  };

  if (override) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <Badge variant="outline" className="border-amber-500/40 text-amber-400 gap-1">
          <Gavel className="w-3 h-3" /> Overridden
        </Badge>
        <span className="text-muted-foreground">calculated: {calculatedScore.toFixed(2)}</span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive" title="Remove override">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs text-muted-foreground"
        onClick={() => { setScore(calculatedScore.toFixed(2)); setReason(''); setOpen(true); }}
      >
        <Gavel className="w-3.5 h-3.5" />
        Override Score
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Judge Override</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg p-3">
            This replaces the reductionist calculation ({calculatedScore.toFixed(2)}) for this jump.
            The calculated score stays visible everywhere alongside your override, and a reason is required.
          </p>
          <div>
            <Label htmlFor="override-score">Final score (0–{maxScore})</Label>
            <Input
              id="override-score"
              type="number"
              min={0}
              max={maxScore}
              step={0.01}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="override-reason">Reason (required)</Label>
            <Textarea
              id="override-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why does this jump deserve a different score than the calculation?"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={!reason.trim()}>Confirm Override</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
