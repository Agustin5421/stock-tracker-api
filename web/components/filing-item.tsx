import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';

interface Filing {
  formType: string;
  date: string;
  description: string;
  accessionNumber: string;
}

interface FilingItemProps {
  filing: Filing;
  onClick?: () => void;
  className?: string;
}

export function FilingItem({ filing, onClick, className }: FilingItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left',
        'hover:bg-muted/50 active:bg-muted min-h-[44px]',
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-semibold',
              filing.formType === '10-K'
                ? 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {filing.formType}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(filing.date), 'MMM d, yyyy')}
          </span>
        </div>
        <p className="truncate text-sm text-foreground">{filing.description}</p>
      </div>
    </button>
  );
}
