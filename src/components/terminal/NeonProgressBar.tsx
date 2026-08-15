import { cn } from '@/utils/cn';

export type ProgressColor = 'cyan' | 'pink' | 'green' | 'gold' | 'purple';
export type BarStyle = 'bar' | 'ascii' | 'emoji';

interface NeonProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: ProgressColor;
  emoji?: string;
  style?: BarStyle;
  className?: string;
}

const COLOR_TEXT: Record<ProgressColor, string> = {
  cyan: 'text-[var(--neon-cyan)]',
  pink: 'text-[var(--neon-pink)]',
  green: 'text-[var(--neon-green)]',
  gold: 'text-[var(--neon-gold)]',
  purple: 'text-[var(--neon-purple)]',
};

const COLOR_FILL: Record<ProgressColor, string> = {
  cyan: 'progress-fill-cyan',
  pink: 'progress-fill-pink',
  green: 'progress-fill-green',
  gold: 'progress-fill-gold',
  purple: 'progress-fill-purple',
};

export function NeonProgressBar({
  label,
  value,
  max = 100,
  color = 'cyan',
  emoji,
  style = 'bar',
  className,
}: NeonProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const rounded = Math.round(pct);
  const textColor = COLOR_TEXT[color];
  const fillClass = COLOR_FILL[color];

  if (style === 'ascii') {
    const totalChars = 20;
    const filled = Math.round((pct / 100) * totalChars);
    const bar = `[${'='.repeat(filled)}${'-'.repeat(totalChars - filled)}]`;
    return (
      <div className={cn('flex items-center gap-2 font-mono text-xs py-0.5', className)}>
        {emoji && <span className="text-sm w-5">{emoji}</span>}
        <span className={cn('w-24 text-xs', textColor)}>{label}</span>
        <span className={cn('w-10 text-right font-bold', textColor)}>{rounded}%</span>
        <span className={cn('text-xs', textColor)} style={{ textShadow: `0 0 6px currentColor` }}>
          {bar}
        </span>
      </div>
    );
  }

  if (style === 'emoji') {
    const filled = Math.round((pct / 100) * 10);
    return (
      <div className={cn('flex items-center gap-2 font-mono text-xs py-0.5', className)}>
        {emoji && <span className="text-sm w-5">{emoji}</span>}
        <span className={cn('w-24 text-xs', textColor)}>{label}</span>
        <span className={cn('w-10 text-right font-bold', textColor)}>{rounded}%</span>
        <span className="text-xs tracking-widest">
          {'♥'.repeat(filled)}
          <span className="text-[#333]">{'♥'.repeat(10 - filled)}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 font-mono text-xs py-0.5', className)}>
      {emoji && <span className="text-sm w-5 flex-shrink-0">{emoji}</span>}
      <span className={cn('w-24 flex-shrink-0 text-xs', textColor)}>{label}</span>
      <span className={cn('w-8 text-right font-bold flex-shrink-0 text-xs', textColor)}>
        {rounded}%
      </span>
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: `var(--neon-${color})15` }}
      >
        <div className={cn('h-full rounded-full transition-all duration-700 ease-out', fillClass)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
