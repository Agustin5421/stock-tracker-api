import { cn } from '@/lib/utils';
import { formatPercentage } from '@/lib/mock-data';

interface PnlBadgeProps {
  value: number; // percentage
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PnlBadge({ value, showIcon = true, size = 'md', className }: PnlBadgeProps) {
  const isPositive = value >= 0;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        isPositive ? 'bg-gain/15 text-gain' : 'bg-loss/15 text-loss',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <span aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
      )}
      {formatPercentage(value)}
    </span>
  );
}
