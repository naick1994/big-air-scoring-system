import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventPreset, PresetWeights, JumpParameters, ScoringResult, OverallImpressionParams } from '@/types/scoring';
import { PRESET_WEIGHTS } from '@/lib/scoring';

interface ScoringContextType {
  activePreset: EventPreset;
  setActivePreset: (preset: EventPreset) => void;
  weights: PresetWeights;
  setWeights: (weights: PresetWeights) => void;
  jump1Result: ScoringResult | null;
  setJump1Result: (result: ScoringResult | null) => void;
  jump2Result: ScoringResult | null;
  setJump2Result: (result: ScoringResult | null) => void;
  jump3Result: ScoringResult | null;
  setJump3Result: (result: ScoringResult | null) => void;
  jump1Params: JumpParameters | null;
  setJump1Params: (params: JumpParameters | null) => void;
  jump2Params: JumpParameters | null;
  setJump2Params: (params: JumpParameters | null) => void;
  jump3Params: JumpParameters | null;
  setJump3Params: (params: JumpParameters | null) => void;
  overallImpression: OverallImpressionParams | null;
  setOverallImpression: (params: OverallImpressionParams | null) => void;
  overallImpressionScore: number;
  setOverallImpressionScore: (score: number) => void;
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

export function ScoringProvider({ children }: { children: React.ReactNode }) {
  const [activePreset, setActivePresetState] = useState<EventPreset>('KOTA');
  const [weights, setWeightsState] = useState<PresetWeights>(PRESET_WEIGHTS.KOTA);
  
  const [jump1Result, setJump1Result] = useState<ScoringResult | null>(null);
  const [jump2Result, setJump2Result] = useState<ScoringResult | null>(null);
  const [jump3Result, setJump3Result] = useState<ScoringResult | null>(null);
  
  const [jump1Params, setJump1Params] = useState<JumpParameters | null>(null);
  const [jump2Params, setJump2Params] = useState<JumpParameters | null>(null);
  const [jump3Params, setJump3Params] = useState<JumpParameters | null>(null);
  
  const [overallImpression, setOverallImpression] = useState<OverallImpressionParams | null>(null);
  const [overallImpressionScore, setOverallImpressionScore] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('activePreset');
    if (saved && saved in PRESET_WEIGHTS) {
      setActivePresetState(saved as EventPreset);
      setWeightsState(saved === 'Custom' 
        ? JSON.parse(localStorage.getItem('customWeights') || JSON.stringify(PRESET_WEIGHTS.KOTA))
        : PRESET_WEIGHTS[saved as keyof typeof PRESET_WEIGHTS]);
    }
  }, []);

  const setActivePreset = (preset: EventPreset) => {
    setActivePresetState(preset);
    localStorage.setItem('activePreset', preset);
    if (preset !== 'Custom') {
      const newWeights = PRESET_WEIGHTS[preset];
      setWeightsState(newWeights);
    }
  };

  const setWeights = (newWeights: PresetWeights) => {
    setWeightsState(newWeights);
    if (activePreset === 'Custom') {
      localStorage.setItem('customWeights', JSON.stringify(newWeights));
    }
  };

  return (
    <ScoringContext.Provider value={{
      activePreset,
      setActivePreset,
      weights,
      setWeights,
      jump1Result,
      setJump1Result,
      jump2Result,
      setJump2Result,
      jump3Result,
      setJump3Result,
      jump1Params,
      setJump1Params,
      jump2Params,
      setJump2Params,
      jump3Params,
      setJump3Params,
      overallImpression,
      setOverallImpression,
      overallImpressionScore,
      setOverallImpressionScore,
    }}>
      {children}
    </ScoringContext.Provider>
  );
}

export function useScoring() {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error('useScoring must be used within ScoringProvider');
  }
  return context;
}
