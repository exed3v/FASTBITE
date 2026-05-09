"use client";

import { useEffect, useState } from "react";

import { ChevronDown, ChevronUp, Download, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/browser";

import { formatARS } from "@/utils/currency";

import { toast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Estado =
  | "pendiente"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

type Pedido = {
  id: string;

  cliente_nombre: string;

  telefono: string;

  direccion: string;

  notas: string | null;

  subtotal: number;

  envio: number;

  total: number;

  estado: Estado;

  metodo_pago: string;

  payment_id: string | null;

  payment_status: string | null;

  created_at: string;
};

type Item = {
  id: string;

  pedido_id: string;

  producto_nombre: string;

  cantidad: number;

  precio_unitario: number;
};

const ESTADOS: {
  value: Estado | "todos";

  label: string;

  color: string;
}[] = [
  {
    value: "todos",
    label: "Todos",
    color: "",
  },

  {
    value: "pendiente",
    label: "Pendiente",
    color: "bg-warning text-background",
  },

  {
    value: "en_preparacion",
    label: "En preparación",
    color: "bg-info text-background",
  },

  {
    value: "en_camino",
    label: "En camino",
    color: "bg-primary text-primary-foreground",
  },

  {
    value: "entregado",
    label: "Entregado",
    color: "bg-success text-background",
  },

  {
    value: "cancelado",
    label: "Cancelado",
    color: "bg-destructive text-destructive-foreground",
  },
];

const estadoBadge = (estado: Estado) =>
  ESTADOS.find((item) => item.value === estado)?.color ?? "";

const OrdersDashboard = () => {
  const supabase = createClient();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [items, setItems] = useState<Item[]>([]);

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
        setItems(its as Item[]);
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
          setItems((prev) => [payload.new as Item, ...prev]);
        },
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const cambiarEstado = async (id: string, estado: Estado) => {
    const { error } = await (supabase.from("pedidos") as any)
      .update({ estado })
      .eq("id", id);

    if (error) {
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

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No hay pedidos para mostrar.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((pedido) => {
            const pedidoItems = items.filter(
              (item) => item.pedido_id === pedido.id,
            );

            const isOpen = expanded === pedido.id;

            return (
              <Card key={pedido.id} className="bg-gradient-card">
                <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">
                        {pedido.cliente_nombre}
                      </CardTitle>

                      <Badge className={estadoBadge(pedido.estado)}>
                        {pedido.estado.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
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
    </div>
  );
};

export default OrdersDashboard;
