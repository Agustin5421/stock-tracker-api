'use client';

import { BottomSheet } from './bottom-sheet';
import { Button } from '@/components/ui/button';

interface ConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}: ConfirmSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground">{description}</p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={isDestructive ? 'destructive' : 'default'}
            className="min-h-[44px] w-full"
          >
            {confirmLabel}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="min-h-[44px] w-full"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
