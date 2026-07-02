import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PRESET_CONFIG } from '@/lib/scoring';
import { useScoring } from '@/contexts/ScoringContext';
import { toast } from 'sonner';

interface OverallImpressionScores {
  variety: number;
  technical_difficulty: number;
  height: number;
  power: number;
  risk: number;
  commitment: number;
  execution: number;
  style: number;
  smoothness: number;
  show_wow_factor: number;
  innovation: number;
}

const CRITERIA = [
  { key: 'variety' as keyof OverallImpressionScores, label: 'Variety', description: 'Diversity and range of tricks' },
  { key: 'technical_difficulty' as keyof OverallImpressionScores, label: 'Technical Difficulty', description: 'Complexity of maneuvers' },
  { key: 'height' as keyof OverallImpressionScores, label: 'Height', description: 'Altitude achieved' },
  { key: 'power' as keyof OverallImpressionScores, label: 'Power', description: 'Strength and explosiveness' },
  { key: 'risk' as keyof OverallImpressionScores, label: 'Risk', description: 'Level of danger taken' },
  { key: 'commitment' as keyof OverallImpressionScores, label: 'Commitment', description: 'Full dedication to execution' },
  { key: 'execution' as keyof OverallImpressionScores, label: 'Execution', description: 'Quality of performance' },
  { key: 'style' as keyof OverallImpressionScores, label: 'Style', description: 'Aesthetic quality and flair' },
  { key: 'smoothness' as keyof OverallImpressionScores, label: 'Smoothness', description: 'Flow and fluidity' },
  { key: 'show_wow_factor' as keyof OverallImpressionScores, label: 'Show/Wow Factor', description: 'Entertainment and impact' },
  { key: 'innovation' as keyof OverallImpressionScores, label: 'Innovation', description: 'Creativity and originality' },
];

export default function OverallImpression() {
  const navigate = useNavigate();
  const { activePreset, overallImpression, setOverallImpression, setOverallImpressionScore } = useScoring();
  
  useEffect(() => {
    const hasOI = PRESET_CONFIG[activePreset]?.hasOverallImpression ?? false;
    if (!hasOI) {
      toast.error('Overall Impression is not available for this preset');
      navigate('/preset');
    }
  }, [activePreset, navigate]);
  
  const [scores, setScores] = useState<OverallImpressionScores>({
    variety: 0,
    technical_difficulty: 0,
    height: 0,
    power: 0,
    risk: 0,
    commitment: 0,
    execution: 0,
    style: 0,
    smoothness: 0,
    show_wow_factor: 0,
    innovation: 0,
  });

  // Pre-fill scores if they exist in context
  useEffect(() => {
    if (overallImpression) {
      const displayScores: OverallImpressionScores = {
        variety: overallImpression.variety * 11,
        technical_difficulty: overallImpression.technical_difficulty * 11,
        height: overallImpression.height * 11,
        power: overallImpression.power * 11,
        risk: overallImpression.risk * 11,
        commitment: overallImpression.commitment * 11,
        execution: overallImpression.execution * 11,
        style: overallImpression.style * 11,
        smoothness: overallImpression.smoothness * 11,
        show_wow_factor: overallImpression.show_wow_factor * 11,
        innovation: overallImpression.innovation * 11,
      };
      setScores(displayScores);
    }
  }, [overallImpression]);

  const handleSliderChange = (key: keyof OverallImpressionScores, displayValue: number[]) => {
    setScores(prev => ({
      ...prev,
      [key]: displayValue[0]
    }));
  };

  // Calculate total in real terms (displayValue / 11)
  const calculateTotal = () => {
    const sum = Object.values(scores).reduce((acc, val) => acc + val, 0);
    return (sum / 11).toFixed(2);
  };

  const handleSubmit = () => {
    // Convert display values to real values (displayValue / 11)
    const realScores = Object.entries(scores).reduce((acc, [key, displayValue]) => {
      acc[key as keyof OverallImpressionScores] = displayValue / 11;
      return acc;
    }, {} as OverallImpressionScores);

    // Calculate total score
    const totalScore = Object.values(realScores).reduce((sum, val) => sum + val, 0);

    // Save to context
    setOverallImpression(realScores);
    setOverallImpressionScore(totalScore);
    
    // Navigate to results
    navigate('/result');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl font-bold mb-2">Overall Impression</h1>
        <p className="text-muted-foreground">
          Rate each criterion from 0 to 10. Maximum total score: 10 points.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Score</CardTitle>
          <CardDescription>Sum of all criteria (max 10.00)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-primary">
            {calculateTotal()} / 10.00
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 mb-8">
        {CRITERIA.map(({ key, label, description }) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg">{label}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Score</Label>
                <span className="text-2xl font-bold text-primary">
                  {scores[key].toFixed(1)}
                </span>
              </div>
              <Slider
                value={[scores[key]]}
                onValueChange={(value) => handleSliderChange(key, value)}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} size="lg">
          Continue to Results
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
