"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  ArrowUpRight,
  Clock,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { formatARS } from "@/utils/currency";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Estado, Pedido, PedidoItem } from "@/types/order";

import { ESTADOS } from "@/types/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const estadoBadge = (estado: Estado) =>
  ESTADOS.find((item) => item.value === estado)?.color ?? "";

const OrdersDashboard = () => {
  const supabase = createClient();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [items, setItems] = useState<PedidoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Estado | "todos">("todos");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const [{ data: ped }, { data: its }] = await Promise.all([
        supabase
          .from("pedidos")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(500),
        supabase
          .from("pedido_items")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(2000),
      ]);

      if (ped) {
        setPedidos(ped as Pedido[]);
      }
      if (its) {
        setItems(its as PedidoItem[]);
      }
      setLoading(false);
    };

    init();

    const channel = supabase
      .channel("admin-pedidos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pedidos",
        },

        (payload) => {
          if (payload.eventType === "INSERT") {
            setPedidos((prev) => [payload.new as Pedido, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            setPedidos((prev) =>
              prev.map((pedido) =>
                pedido.id === (payload.new as Pedido).id
                  ? (payload.new as Pedido)
                  : pedido,
              ),
            );
          }

          if (payload.eventType === "DELETE") {
            setPedidos((prev) =>
              prev.filter((pedido) => pedido.id !== (payload.old as Pedido).id),
            );
          }
        },
      )

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pedido_items",
        },

        (payload) => {
          setItems((prev) => [payload.new as PedidoItem, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const cambiarEstado = async (id: string, estado: Estado) => {
    const previousPedidos = pedidos;

    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === id
          ? {
              ...pedido,
              estado,
            }
          : pedido,
      ),
    );

    const { error } = await supabase
      .from("pedidos")
      .update({
        estado,
      })
      .eq("id", id);

    if (error) {
      setPedidos(previousPedidos);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "Estado actualizado",
    });
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Fecha", "Cliente", "Teléfono", "Dirección", "Total", "Estado"],
      ...filtered.map((pedido) => [
        pedido.id,
        new Date(pedido.created_at).toLocaleString("es-AR"),
        pedido.cliente_nombre,
        pedido.telefono,
        pedido.direccion,
        pedido.total,
        pedido.estado,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered =
    filter === "todos"
      ? pedidos
      : pedidos.filter((pedido) => pedido.estado === filter);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hoy = new Date();

  const pedidosHoy = pedidos.filter((pedido) => {
    const fecha = new Date(pedido.created_at);

    return fecha.toDateString() === hoy.toDateString();
  });

  const metrics = {
    pedidosHoy: pedidosHoy.length,

    ventasHoy: pedidosHoy.reduce(
      (acc, pedido) => acc + Number(pedido.total),
      0,
    ),

    activos: pedidos.filter(
      (pedido) =>
        pedido.estado !== "entregado" && pedido.estado !== "cancelado",
    ).length,
  };

  const metricCards = [
    {
      label: "Pedidos hoy",
      value: String(metrics.pedidosHoy),
      sub: metrics.pedidosHoy === 1 ? "pedido" : "pedidos",
      icon: ShoppingBag,
      accent: "text-primary",
      bgIcon: "bg-primary/10",
    },
    {
      label: "Ventas hoy",
      value: formatARS(metrics.ventasHoy),
      sub:
        metrics.ventasHoy > 1_000_000
          ? "Fuerte"
          : metrics.ventasHoy > 0
            ? "En marcha"
            : "Sin ventas",
      icon: TrendingUp,
      accent: "text-green-500",
      bgIcon: "bg-green-500/10",
    },
    {
      label: "Pedidos activos",
      value: String(metrics.activos),
      sub: metrics.activos === 0 ? "Todo al día" : "en curso",
      icon: Clock,
      accent: "text-blue-500",
      bgIcon: "bg-blue-500/10",
    },
  ];

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

  const paymentMethodBadge = (method: string) => {
    switch (method) {
      case "mercadopago":
        return "border-blue-500/20 bg-blue-500/15 text-blue-500";

      default:
        return "border-green-500/20 bg-green-500/15 text-green-500";
    }
  };

  const deliveryTypeBadge = (type: string) => {
    switch (type) {
      case "pickup":
        return "border-violet-500/20 bg-violet-500/15 text-violet-500";

      default:
        return "border-orange-500/20 bg-orange-500/15 text-orange-500";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black uppercase">Pedidos</h1>

          <p className="text-sm text-muted-foreground">
            {filtered.length} pedido
            {filtered.length !== 1 && "s"} · actualización en vivo
          </p>
        </div>

        <div className="flex gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as Estado | "todos")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {ESTADOS.map((estado) => (
                <SelectItem key={estado.value} value={estado.value}>
                  {estado.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      <>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metricCards.map((m) => (
            <Card
              key={m.label}
              className="relative overflow-hidden border border-border/60 bg-gradient-card shadow-card transition-all duration-500 ease-out hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-[0_0_80px_rgba(255,200,0,0.60)]"
            >
              <div className="pointer-events-none absolute right-1 top-0 p-4 opacity-5">
                <m.icon className="h-24 w-24" />
              </div>

              <CardHeader className="flex flex-row items-center justify-between space-y-1 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </CardTitle>

                <div className={cn("rounded-lg p-2", m.bgIcon, m.accent)}>
                  <m.icon className="h-4 w-4" />
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="text-2xl font-black tracking-tight">
                  {m.value}
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{m.sub}</span>

                  {metrics.ventasHoy > 1_000_000 &&
                    m.label === "Ventas hoy" && (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Pedidos recientes</h2>

            <p className="text-sm text-muted-foreground">
              Últimos 5 pedidos recibidos
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No hay pedidos para mostrar.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.slice(0, 5).map((pedido) => {
              const pedidoItems = items.filter(
                (item) => item.pedido_id === pedido.id,
              );

              const isOpen = expanded === pedido.id;

              return (
                <Card
                  key={pedido.id}
                  className="border border-border/60 bg-card transition-all hover:border-primary/20"
                >
                  <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
                    <div className="flex-1 ">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">
                          {pedido.cliente_nombre}
                        </CardTitle>

                        <div className="flex flex-wrap items-start gap-3 ml-1.5">
                          <div className="">
                            <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
                              Estado
                            </p>

                            <Badge
                              className={cn(
                                estadoBadge(pedido.estado),
                                "hover:bg-transparent hover:text-inherit",
                              )}
                            >
                              {pedido.estado.replace("_", " ")}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
                              Pago
                            </p>

                            <Badge
                              className={cn(
                                paymentStatusBadge(pedido.payment_status),
                                "hover:bg-transparent hover:text-inherit",
                              )}
                            >
                              {pedido.payment_status === "aprobado"
                                ? "Pagado"
                                : "Pendiente"}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
                              Método
                            </p>

                            <Badge
                              className={cn(
                                paymentMethodBadge(pedido.payment_method),
                                "hover:bg-transparent hover:text-inherit",
                              )}
                            >
                              {pedido.payment_method === "mercadopago"
                                ? "Mercado Pago"
                                : "Efectivo"}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
                              Entrega
                            </p>

                            <Badge
                              className={cn(
                                deliveryTypeBadge(pedido.delivery_type),
                                "hover:bg-transparent hover:text-inherit",
                              )}
                            >
                              {pedido.delivery_type === "pickup"
                                ? "Retiro"
                                : "Delivery"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
                        {new Date(pedido.created_at).toLocaleString("es-AR")} ·{" "}
                        {pedido.telefono} · {pedido.direccion}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-primary">
                        {formatARS(Number(pedido.total))}
                      </div>

                      <button
                        onClick={() => setExpanded(isOpen ? null : pedido.id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        {isOpen ? (
                          <>
                            Ocultar
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Ver detalle
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </CardHeader>

                  {isOpen && (
                    <CardContent className="space-y-3 border-t border-border pt-4">
                      <ul className="space-y-1 text-sm">
                        {pedidoItems.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.cantidad}× {item.producto_nombre}
                            </span>

                            <span className="text-muted-foreground">
                              {formatARS(item.precio_unitario * item.cantidad)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {pedido.notas && (
                        <p className="text-xs italic text-muted-foreground">
                          📝 {pedido.notas}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        {ESTADOS.filter(
                          (estado) =>
                            estado.value !== "todos" &&
                            estado.value !== pedido.estado,
                        ).map((estado) => (
                          <Button
                            key={estado.value}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              cambiarEstado(pedido.id, estado.value as Estado)
                            }
                          >
                            → {estado.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </>
    </div>
  );
};

export default OrdersDashboard;
