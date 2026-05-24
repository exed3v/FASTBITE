"use client";

import { useState } from "react";
import OrdersFilters from "./orders-filters";
import OrderSheet from "./order-sheet";
import { Estado, Pedido, PedidoItem } from "@/types/order";
import OrdersList from "./order-list";
import OrdersPagination from "./orders-paginations";
import { useRouter } from "next/navigation";
import { deletePedido, updatePedidoEstado } from "@/app/admin/pedidos/actions";
import DeleteOrderDialog from "./delete-order-dialog";

const PAGE_SIZE = 10;

type Props = {
  pedidos: Pedido[];
  items: PedidoItem[];
  count: number;
  page: number;
  totalPages: number;
};

export default function OrdersPageClient({
  pedidos,
  items,
  count,
  page,
  totalPages,
}: Props) {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<Pedido | null>(null);

  const handleViewPedido = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setSheetOpen(true);
  };

  const router = useRouter();

  const handleDeletePedido = (pedido: Pedido) => {
    setPedidoToDelete(pedido);

    setDeleteOpen(true);
  };

  const confirmDeletePedido = async () => {
    if (!pedidoToDelete) {
      return;
    }

    try {
      await deletePedido(pedidoToDelete.id);

      setDeleteOpen(false);

      setPedidoToDelete(null);

      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEstado = async (id: string, estado: Estado) => {
    try {
      await updatePedidoEstado(id, estado);

      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
  const selectedItems = items.filter(
    (item) => item.pedido_id === selectedPedido?.id,
  );

  return (
    <div className="space-y-6">
      <OrdersFilters />

      <OrdersList
        pedidos={pedidos}
        onView={handleViewPedido}
        onDelete={handleDeletePedido}
      />

      <OrdersPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={count}
        totalPages={totalPages}
      />
      <OrderSheet
        pedido={selectedPedido}
        items={selectedItems}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onChangeEstado={handleChangeEstado}
      />

      <DeleteOrderDialog
        pedido={pedidoToDelete}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDeletePedido}
      />
    </div>
  );
}
