/**
 * ═══════════════════════════════════════════════════════════════════
 * Sex Positions Library — ASCII Art Database
 * Eros Status Terminal v3.0
 * ═══════════════════════════════════════════════════════════════════
 */

export interface SexPosition {
  emoji: string;
  category: string;
  label: string;
  description: string;
  ascii: string[];
}

export const POSITIONS_LIB: Record<string, SexPosition> = {
  missionary: { emoji: '🛏️', category: 'Classic', label: 'Missionary', description: 'Face-to-face, partner on top.', ascii: ['   \\o/  ', '   /|\\  ', '  _/|\\_  ', ' (_____)  '] },
  cowgirl: { emoji: '🤠', category: 'Classic', label: 'Cowgirl', description: 'Partner on top, facing forward.', ascii: ['  \\o/   ', '   |    ', '  /|\\   ', ' _/ \\_  '] },
  'reverse cowgirl': { emoji: '🔄', category: 'Classic', label: 'Reverse Cowgirl', description: 'Partner on top, facing away.', ascii: ['  _o_   ', '   |\\   ', '  /|    ', ' _/ \\_ '] },
  doggystyle: { emoji: '🐕', category: 'Classic', label: 'Doggystyle', description: 'Rear entry, both on knees.', ascii: [' \\o  o/ ', '  |  |  ', '  |--|  ', ' /    \\ '] },
  spooning: { emoji: '🥄', category: 'Classic', label: 'Spooning', description: 'Side by side, rear entry.', ascii: [' (o)(o) ', '  )--<  ', ' (    ) ', '  ----  '] },
  '69': { emoji: '🔁', category: 'Oral', label: '69', description: 'Mutual oral stimulation.', ascii: ['  \\o/   ', '   |    ', '  /|    ', ' o/|    ', '  |\\   ', '  |/   '] },
  standing: { emoji: '🧍', category: 'Standing', label: 'Standing', description: 'Both standing, face-to-face.', ascii: ['  o o   ', ' /|X|\\  ', '  | |   ', ' / \\ /\\ '] },
  'standing doggy': { emoji: '🧱', category: 'Standing', label: 'Standing Doggy', description: 'Rear entry, both standing.', ascii: [' o   o  ', ' |\\  |  ', ' | \\ |  ', '/   \\|  '] },
  'wall pin': { emoji: '🧱', category: 'Standing', label: 'Wall Pin', description: 'Partner pressed against wall.', ascii: [' |o  o  ', ' ||  |  ', ' ||--|  ', ' |/ \\   '] },
  lifted: { emoji: '🏋️', category: 'Standing', label: 'Lifted', description: 'Partner carried, legs wrapped.', ascii: ['  o\\o   ', '  |/|   ', ' /X/    ', '/   \\   '] },
  'lap dance': { emoji: '💺', category: 'Seated', label: 'Lap Dance', description: 'Partner seated, other on lap.', ascii: ['  \\o/   ', '   |    ', ' __U__  ', '(_____)  '] },
  'seated facing': { emoji: '🪑', category: 'Seated', label: 'Seated Facing', description: 'Face-to-face, seated position.', ascii: ['  o o   ', ' (X X)  ', '  | |   ', ' _| |_  '] },
  chair: { emoji: '🪑', category: 'Seated', label: 'Chair', description: 'One seated on chair, other on lap.', ascii: ['  \\o/   ', '   |    ', ' |_|_|  ', ' |   |  '] },
  'side by side': { emoji: '↔️', category: 'Lying', label: 'Side by Side', description: 'Both lying sideways, face-to-face.', ascii: [' o---o  ', ' |   |  ', ' |---|  ', '       '] },
  lotus: { emoji: '🪷', category: 'Lying', label: 'Lotus', description: 'Partner in lap, face-to-face seated.', ascii: ['  \\o/   ', '   X    ', ' (___) ', '        '] },
  'prone bone': { emoji: '⬇️', category: 'Lying', label: 'Prone Bone', description: 'Partner lying flat, rear entry.', ascii: [' o----o ', ' |    | ', ' ------  ', '        '] },
  'pile driver': { emoji: '⬇️', category: 'Lying', label: 'Pile Driver', description: 'Legs raised vertically, deep penetration.', ascii: ['  |||   ', '  |||   ', ' (   )  ', '  ---   '] },
  blowjob: { emoji: '💋', category: 'Oral', label: 'Blowjob', description: 'Oral stimulation, kneeling.', ascii: ['   o    ', '   |    ', ' o-|    ', ' |      '] },
  cunnilingus: { emoji: '👅', category: 'Oral', label: 'Cunnilingus', description: 'Oral stimulation, lying.', ascii: [' o----  ', '  \\  |  ', '   \\ |  ', '    \\|  '] },
  'doggy deep': { emoji: '🔥', category: 'Advanced', label: 'Deep Doggy', description: 'Rear entry, hips held, deep thrust.', ascii: [' \\o  o/ ', '  |  |  ', '  |==|  ', ' /    \\ '] },
  amazon: { emoji: '⚡', category: 'Advanced', label: 'Amazon', description: 'Partner dominant, legs folded back.', ascii: ['  \\o/   ', '   |    ', ' __U__  ', '  |||   '] },
  suspended: { emoji: '🌀', category: 'Advanced', label: 'Suspended', description: 'Partner held in air, full penetration.', ascii: ['  o\\    ', '  |/o   ', ' /|/    ', '/       '] },
  butterfly: { emoji: '🦋', category: 'Advanced', label: 'Butterfly', description: 'Partner at edge of surface, legs raised.', ascii: ['  o  o  ', '  |--|  ', ' /|  |\\ ', '/  --  \\'] },
  pretzel: { emoji: '🥨', category: 'Advanced', label: 'Pretzel', description: 'Side position, one leg raised.', ascii: [' o--o   ', ' |  |\\  ', ' |  | \\ ', '        '] },
};

export const POSITION_CATEGORIES = ['Classic', 'Standing', 'Seated', 'Lying', 'Oral', 'Advanced'];
export const POSITIONS_LIST = Object.keys(POSITIONS_LIB);

export function findPosition(name?: string): SexPosition | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  if (POSITIONS_LIB[lower]) return POSITIONS_LIB[lower];
  for (const [key, data] of Object.entries(POSITIONS_LIB)) {
    if (lower.includes(key) || key.includes(lower)) return data;
  }
  return null;
}

export function getPositionsByCategory(category: string): Array<SexPosition & { key: string }> {
  return Object.entries(POSITIONS_LIB)
    .filter(([, v]) => v.category === category)
    .map(([k, v]) => ({ key: k, ...v }));
}
