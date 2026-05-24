"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatARS } from "@/utils/currency";
import { Pedido } from "@/types/order";

type Props = {
  pedido: Pedido | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void;
};

export default function DeleteOrderDialog({
  pedido,
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/60 bg-gradient-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display uppercase tracking-tight">
            Eliminar pedido
          </AlertDialogTitle>

          <AlertDialogDescription>
            Vas a eliminar el pedido de{" "}
            <span className="font-medium text-foreground">
              {pedido?.cliente_nombre}
            </span>{" "}
            por un total de{" "}
            <span className="font-semibold text-primary">
              {formatARS(Number(pedido?.total ?? 0))}
            </span>
            . Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-border/60 cursor-pointer">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
