import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  className?: string;
}

export function StatCard({ label, value, delta, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-border bg-card p-4',
        className
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
      {delta !== undefined && (
        <span
          className={cn(
            'text-sm font-medium',
            delta >= 0 ? 'text-gain' : 'text-loss'
          )}
        >
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
