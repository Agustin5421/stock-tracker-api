import { cn } from '@/lib/utils';

interface SkeletonRowProps {
  className?: string;
}

export function SkeletonRow({ className }: SkeletonRowProps) {
  return (
    <div
      className={cn(
        'flex min-h-[72px] animate-pulse items-center gap-3 px-4 py-3',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}
