// Short, generic coaching notes shown to a rider when a parameter didn't
// score the max — keyed by the ParameterScore.label used across the app.
export const IMPROVEMENT_TIPS: Record<string, string> = {
  'Height': 'Push for more raw airtime and pop off the wave/kicker — height brackets are set per event, so check the current thresholds in Parameters Guide.',
  'Amplitude': 'Cover more horizontal distance during the jump — ride more power into the takeoff to extend the arc.',
  'Kite Angle': 'Fly the kite lower and more extreme during the loop — the closer to level with you, the more points earned.',
  'Yank Power': 'Load the kite harder on entry to the loop — a more explosive, aggressive send scores higher.',
  'Free Fall': 'Extend the hang time near weightlessness during the loop — a longer free-fall phase scores higher.',
  'Rotations': 'Add another full rotation to the trick to reach the next tier.',
  'Rotation Axis': 'A vertical-axis rotation scores higher than horizontal — factor that into trick choice.',
  'Board Off': 'Add a board-off variation to the trick — it unlocks extra Technicality points.',
  'Board Flip': 'Add a board flip during the board-off phase for extra Technicality points.',
  'Board Spin': 'Add a board spin during the board-off phase for extra Technicality points.',
  'Style': 'Smoother, more controlled body positioning throughout the trick raises this score.',
  'Stability & Control': 'Tighter kite/body control mid-trick, with less visible correction, raises this score.',
  'Landing Control': 'A cleaner, more absorbed landing with no bobble raises this score.',
  'Board Control': 'Keeping the board locked in and stable through the whole trick raises this score.',
  'Kite Control': 'More precise, deliberate kite steering throughout the trick raises this score.',
};
