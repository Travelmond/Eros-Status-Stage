interface GoalsPanelProps {
  goals?: string[];
  aiInstructions?: Array<string | { text: string }>;
}

export function GoalsPanel({ goals, aiInstructions }: GoalsPanelProps) {
  const allGoals = goals || [];
  const instructions = aiInstructions || [];
  if (allGoals.length === 0 && instructions.length === 0) return null;

  return (
    <div
      className="mx-3 mb-2 p-2 rounded"
      style={{ border: '1px solid var(--terminal-border)', background: 'var(--terminal-card)' }}
    >
      <div className="text-xs font-mono mb-1.5 neon-cyan opacity-60 tracking-widest">GOALS & INTENTIONS</div>
      <div className="space-y-1">
        {allGoals.map((goal, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs font-mono">
            <span style={{ color: 'var(--neon-gold)' }}>▸</span>
            <span className="text-gray-300">{goal}</span>
          </div>
        ))}
        {instructions.map((inst, i) => (
          <div key={`inst-${i}`} className="flex items-start gap-1.5 text-xs font-mono">
            <span style={{ color: 'var(--neon-purple)' }}>◈</span>
            <span className="text-gray-400 italic">
              {typeof inst === 'string' ? inst : inst.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
