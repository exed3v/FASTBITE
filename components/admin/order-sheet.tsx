"use client";
import {
  Bike,
  Calendar,
  CreditCard,
  Hash,
  MapPin,
  Phone,
  StickyNote,
  Store,
  User,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatARS } from "@/utils/currency";
import {
  ESTADOS,
  Estado,
  estadoBadge,
  estadoLabel,
  metodoPagoLabel,
  Pedido,
  PedidoItem,
} from "@/types/order";
type Props = {
  pedido: Pedido | null;
  items: PedidoItem[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onChangeEstado: (id: string, estado: Estado) => void;
};

const paymentStatusBadge = (status: string | null) => {
  if (!status) {
    return {
      label: "—",

      className: "border-border/60 text-muted-foreground",
    };
  }
  const normalized = status.toLowerCase();
  if (normalized === "approved" || normalized === "aprobado") {
    return {
      label: "Aprobado",

      className: "border-green-500/20 bg-green-500/15 text-green-500",
    };
  }
  if (normalized === "rejected" || normalized === "rechazado") {
    return {
      label: "Rechazado",

      className: "border-red-500/20 bg-red-500/15 text-red-500",
    };
  }
  return {
    label: "Pendiente",

    className: "border-yellow-500/20 bg-yellow-500/15 text-yellow-500",
  };
};

export default function OrderSheet({
  pedido,
  items,
  open,
  onOpenChange,
  onChangeEstado,
}: Props) {
  if (!pedido) {
    return null;
  }
  const pay = paymentStatusBadge(pedido.payment_status);
  const delivery = pedido.delivery_type === "delivery";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-border/50 bg-gradient-card p-0 sm:max-w-lg"
      >
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-60" />

          <SheetHeader className="relative p-6 pb-4 text-left">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
              <Hash className="h-3 w-3" />
              {pedido.id.slice(0, 8)}
            </div>
            <SheetTitle className="font-display text-2xl uppercase tracking-tight">
              {pedido.cliente_nombre}
            </SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 pt-1">
              <Badge className={`${estadoBadge(pedido.estado)} font-medium`}>
                {estadoLabel(pedido.estado)}
              </Badge>
              <Badge
                variant="outline"
                className={`${pay.className} font-medium`}
              >
                {pay.label}
              </Badge>
              <Badge
                variant="outline"
                className="border-border/60 font-medium text-muted-foreground"
              >
                {metodoPagoLabel(pedido.payment_method)}
              </Badge>
              <Badge
                variant="outline"
                className={
                  delivery
                    ? "gap-1 border-primary/40 font-medium text-primary"
                    : "gap-1 border-info/40 font-medium text-info"
                }
              >
                {delivery ? (
                  <Bike className="h-3 w-3" />
                ) : (
                  <Store className="h-3 w-3" />
                )}
                {delivery ? "Delivery" : "Retiro"}
              </Badge>
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="space-y-6 px-6 pb-8">
          <section className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              Cliente
            </h4>
            <InfoRow icon={User} label="Nombre" value={pedido.cliente_nombre} />
            <InfoRow icon={Phone} label="Teléfono" value={pedido.telefono} />
            <InfoRow
              icon={MapPin}
              label="Dirección"
              value={pedido.direccion ?? "Sin dirección"}
            />
            {pedido.notas && (
              <InfoRow
                icon={StickyNote}
                label="Notas"
                value={pedido.notas}
                accent
              />
            )}
          </section>

          <Separator className="bg-border/40" />

          <section className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              Items ({items.length})
            </h4>

            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2.5 transition-smooth hover:border-primary/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="font-display shrink-0 text-sm font-bold text-primary">
                      {item.cantidad}×
                    </span>

                    <span className="truncate text-sm text-foreground/90">
                      {item.producto_nombre}
                    </span>
                  </div>

                  <span className="text-sm font-medium text-muted-foreground">
                    {formatARS(item.precio_unitario * item.cantidad)}
                  </span>
                </li>
              ))}

              {items.length === 0 && (
                <li className="text-xs italic text-muted-foreground/60">
                  Sin items registrados.
                </li>
              )}
            </ul>
          </section>

          <section className="space-y-2 rounded-xl border border-border/40 bg-background/40 p-4">
            <Row label="Subtotal" value={formatARS(Number(pedido.subtotal))} />
            <Row label="Envío" value={formatARS(Number(pedido.delivery_fee))} />
            <Separator className="my-1 bg-border/30" />
            <Row label="Total" value={formatARS(Number(pedido.total))} strong />
          </section>

          <section className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              Pago
            </h4>
            <InfoRow
              icon={CreditCard}
              label="Método"
              value={metodoPagoLabel(pedido.payment_method)}
            />
            <InfoRow
              icon={Hash}
              label="Payment ID"
              value={pedido.payment_id ?? "—"}
              mono
            />
            <InfoRow
              icon={Calendar}
              label="Creado"
              value={new Date(pedido.created_at).toLocaleString("es-AR")}
            />
          </section>

          <section className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
              Cambiar estado
            </h4>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.filter(
                (estado) =>
                  estado.value !== "todos" && estado.value !== pedido.estado,
              ).map((estado) => (
                <Button
                  key={estado.value}
                  size="sm"
                  variant="outline"
                  className="border-border/60 text-xs transition-smooth hover:border-primary/40 hover:bg-muted/60 hover:text-primary"
                  onClick={() =>
                    onChangeEstado(pedido.id, estado.value as Estado)
                  }
                >
                  →{estado.label}
                </Button>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
const InfoRow = ({
  icon: Icon,
  label,
  value,
  mono,
  accent,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0 rounded-md bg-primary/10 p-1.5 text-primary">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
        {label}
      </div>
      <div
        className={`break-words text-sm ${mono ? "font-mono text-xs" : ""} ${
          accent
            ? "mt-1 rounded-md border-l-2 border-primary/50 bg-muted/40 px-2 py-1.5 text-foreground/90"
            : "text-foreground/90"
        }`}
      >
        {value}
      </div>
    </div>
  </div>
);

const Row = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <span
      className={`text-sm ${
        strong
          ? "font-semibold uppercase tracking-wide text-foreground"
          : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
    <span
      className={
        strong
          ? "font-display text-xl font-bold text-primary"
          : "text-sm font-medium text-foreground/90"
      }
    >
      {value}
    </span>
  </div>
);
