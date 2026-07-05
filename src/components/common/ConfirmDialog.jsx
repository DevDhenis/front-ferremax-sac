import { Trash2, TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const ICONS = { danger: Trash2, warning: TriangleAlert, primary: TriangleAlert };
const ICON_WRAP = {
  danger: "bg-destructive-bg text-destructive",
  warning: "bg-warning-bg text-warning",
  primary: "bg-primary/10 text-primary",
};
const CONFIRM_CLASS = {
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  warning: "bg-warning text-warning-foreground hover:bg-warning/90",
  primary: "",
};

/**
 * Diálogo de confirmación reutilizable (sobre AlertDialog).
 * Controlado: pásale `open` + `onOpenChange` y `onConfirm`.
 *
 * <ConfirmDialog
 *   open={!!toDelete}
 *   onOpenChange={(o) => !o && setToDelete(null)}
 *   title="Eliminar producto"
 *   description={<>¿Eliminar <b>"{toDelete?.nombre}"</b>?</>}
 *   confirmLabel="Sí, eliminar"
 *   onConfirm={handleDelete}
 * />
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "¿Confirmar acción?",
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  tone = "danger",
}) {
  const Icon = ICONS[tone] || Trash2;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full self-center sm:self-start",
              ICON_WRAP[tone]
            )}
          >
            <Icon className="size-5" />
          </span>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={CONFIRM_CLASS[tone]}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
