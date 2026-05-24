"use client";

import {
  Bike,
  Clock,
  Eye,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Trash2,
} from "lucide-react";
import { formatARS } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  estadoBadge,
  estadoLabel,
  metodoPagoLabel,
  Pedido,
} from "@/types/order";

type Props = {
  pedidos: Pedido[];
  onView: (pedido: Pedido) => void;
  onDelete: (pedido: Pedido) => void;
};

const paymentStatusBadge = (status: string | null) => {
  switch (status) {
    case "aprobado":
      return "border-green-500/20 bg-green-500/15 text-green-500";

    case "rechazado":
      return "border-red-500/20 bg-red-500/15 text-red-500";

    default:
      return "border-yellow-500/20 bg-yellow-500/15 text-yellow-500";
  }
};

const deliveryTypeBadge = (delivery: "delivery" | "pickup") => {
  switch (delivery) {
    case "pickup":
      return "border-violet-500/20 bg-violet-500/15 text-violet-500";

    default:
      return "border-orange-500/20 bg-orange-500/15 text-orange-500";
  }
};

export default function OrdersList({ pedidos, onView, onDelete }: Props) {
  if (pedidos.length === 0) {
    return (
      <div className="rounded-2xl border border-border/30 bg-gradient-card py-20 text-center text-muted-foreground/60">
        <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-30" />

        <p className="text-sm">No hay pedidos que coincidan con los filtros.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pedidos.map((pedido, idx) => {
        const delivery = pedido.delivery_type === "delivery";

        return (
          <Card
            key={pedido.id}
            className="group overflow-hidden rounded-2xl border border-border/40 bg-gradient-card shadow-card transition-smooth hover:border-primary/40 hover:shadow-glow"
            style={{
              animationDelay: `${idx * 30}ms`,
            }}
          >
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Cliente + badges */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold">
                      {pedido.cliente_nombre}
                    </h3>

                    <Badge
                      className={`${estadoBadge(pedido.estado)} font-medium`}
                    >
                      {estadoLabel(pedido.estado)}
                    </Badge>

                    <Badge
                      className={`${paymentStatusBadge(
                        pedido.payment_status,
                      )} font-medium`}
                    >
                      {pedido.payment_status === "aprobado"
                        ? "Pagado"
                        : pedido.payment_status === "rechazado"
                          ? "Rechazado"
                          : "Pendiente"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="border-border/60 font-medium text-muted-foreground"
                    >
                      {metodoPagoLabel(pedido.payment_method)}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={`${deliveryTypeBadge(
                        pedido.delivery_type,
                      )} gap-1 font-medium`}
                    >
                      {delivery ? (
                        <Bike className="h-3 w-3" />
                      ) : (
                        <Store className="h-3 w-3" />
                      )}

                      {delivery ? "Delivery" : "Retiro"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />

                      {new Date(pedido.created_at).toLocaleString("es-AR")}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" />

                      {pedido.telefono}
                    </span>

                    <span className="inline-flex max-w-[280px] items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />

                      <span className="line-clamp-1">{pedido.direccion}</span>
                    </span>
                  </div>

                  {pedido.notas && (
                    <p className="mt-2 line-clamp-1 text-xs italic text-muted-foreground/80">
                      “{pedido.notas}”
                    </p>
                  )}
                </div>

                {/* Total + acciones */}
                <div className="flex items-center justify-between gap-3 lg:shrink-0 lg:justify-end lg:gap-4">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      Total
                    </div>

                    <div className="font-display text-xl font-bold leading-tight text-primary">
                      {formatARS(Number(pedido.total))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/60 transition-smooth hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                      onClick={() => onView(pedido)}
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      onClick={() => onDelete(pedido)}
                      aria-label="Eliminar pedido"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
