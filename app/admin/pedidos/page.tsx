import OrdersPageClient from "@/components/admin/orders-page-client";
import { adminClient } from "@/lib/supabase/admin";

import {
  DeliveryType,
  Estado,
  OrdersFilters,
  PaymentMethod,
} from "@/types/order";

const PAGE_SIZE = 10;

type Props = {
  searchParams: Promise<OrdersFilters>;
};

export default async function PedidosPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const from = (page - 1) * PAGE_SIZE;

  const to = from + PAGE_SIZE - 1;

  let query = adminClient
    .from("pedidos")
    .select("*", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    });

  // Search
  if (params.q) {
    query = query.or(
      `cliente_nombre.ilike.%${params.q}%,telefono.ilike.%${params.q}%`,
    );
  }

  // Estado
  if (params.estado && params.estado !== "todos") {
    query = query.eq("estado", params.estado as Estado);
  }

  // Pago
  if (params.pago && params.pago !== "todos") {
    query = query.eq("payment_method", params.pago as PaymentMethod);
  }

  // Delivery
  if (params.tipo && params.tipo !== "todos") {
    query = query.eq("delivery_type", params.tipo as DeliveryType);
  }

  // Fecha
  if (params.fecha && params.fecha !== "todos") {
    const now = new Date();

    const date = new Date();

    if (params.fecha === "hoy") {
      date.setHours(0, 0, 0, 0);
    }

    if (params.fecha === "7d") {
      date.setDate(now.getDate() - 7);
    }

    if (params.fecha === "30d") {
      date.setDate(now.getDate() - 30);
    }

    query = query.gte("created_at", date.toISOString());
  }

  query = query.range(from, to);

  const { data: pedidos, count, error } = await query;

  if (error) {
    throw error;
  }

  // Fetch items
  const pedidoIds = pedidos?.map((pedido) => pedido.id) ?? [];

  const { data: items, error: itemsError } = await adminClient
    .from("pedido_items")
    .select("*")
    .in("pedido_id", pedidoIds);

  if (itemsError) {
    throw itemsError;
  }

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Pedidos</h1>

        <p className="text-sm text-muted-foreground">
          {count ?? 0} pedidos encontrados
        </p>
      </div>

      <OrdersPageClient
        pedidos={pedidos ?? []}
        items={items ?? []}
        count={count ?? 0}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
