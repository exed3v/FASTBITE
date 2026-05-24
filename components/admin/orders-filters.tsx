"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useTransition } from "react";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ESTADOS } from "@/types/order";

export default function OrdersFilters() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "todos") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset pagination
    params.delete("page");

    startTransition(() => {
      router.push(`/admin/pedidos?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/admin/pedidos");
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="mb-6 rounded-2xl border border-border/40 bg-gradient-card p-4 shadow-card">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Search */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Buscar cliente o teléfono..."
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(e) => updateFilter("q", e.target.value)}
            className="border-border/60 bg-background/40 pl-9"
          />
        </div>

        {/* Estado */}
        <Select
          defaultValue={searchParams.get("estado") ?? "todos"}
          onValueChange={(v) => updateFilter("estado", v)}
        >
          <SelectTrigger className="border-border/60 bg-background/40 md:col-span-2">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>

            {ESTADOS.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pago */}
        <Select
          defaultValue={searchParams.get("pago") ?? "todos"}
          onValueChange={(v) => updateFilter("pago", v)}
        >
          <SelectTrigger className="border-border/60 bg-background/40 md:col-span-2">
            <SelectValue placeholder="Pago" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todos">Todos los pagos</SelectItem>

            <SelectItem value="mercadopago">Mercado Pago</SelectItem>

            <SelectItem value="efectivo">Efectivo</SelectItem>
          </SelectContent>
        </Select>

        {/* Delivery */}
        <Select
          defaultValue={searchParams.get("tipo") ?? "todos"}
          onValueChange={(v) => updateFilter("tipo", v)}
        >
          <SelectTrigger className="border-border/60 bg-background/40 md:col-span-2">
            <SelectValue placeholder="Entrega" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>

            <SelectItem value="delivery">Delivery</SelectItem>

            <SelectItem value="pickup">Retiro</SelectItem>
          </SelectContent>
        </Select>

        {/* Fecha */}
        <Select
          defaultValue={searchParams.get("fecha") ?? "todos"}
          onValueChange={(v) => updateFilter("fecha", v)}
        >
          <SelectTrigger className="border-border/60 bg-background/40 md:col-span-2">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todos">Cualquier fecha</SelectItem>

            <SelectItem value="hoy">Hoy</SelectItem>

            <SelectItem value="7d">Últimos 7 días</SelectItem>

            <SelectItem value="30d">Últimos 30 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            <X className="h-3 w-3" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
