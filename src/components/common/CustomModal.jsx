import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const CustomModal = ({
  visible,
  onHide,
  header,
  children,
  footerActions,
  className = 'w-[83vw] sm:w-[66vw] md:w-[42vw] lg:w-[33vw] xl:w-[33vw]',
  style,
  closeOnEscape = true,
  dismissableMask = false,
  position = 'center',
  centered = true,
  widthPercentage = 90
}) => {
  return (
    <Dialog open={visible} onOpenChange={(open) => { if (!open) onHide(); }}>
      <DialogContent
        className={cn("sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none", className)}
        style={style}
        onInteractOutside={(event) => {
          if (!dismissableMask) {
            event.preventDefault();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !closeOnEscape) {
            event.preventDefault();
          }
        }}
      >
        {header && (
          <DialogHeader>
            <DialogTitle>{header}</DialogTitle>
          </DialogHeader>
        )}
        
        <div className="flex-1 overflow-y-auto max-h-[70vh] py-1 text-sm text-foreground">
          {children}
        </div>

        {footerActions && (
          <DialogFooter className="border-t border-border/40 pt-4 mt-2">
            {footerActions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;