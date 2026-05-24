"use server";

import { revalidatePath } from "next/cache";

import { adminClient } from "@/lib/supabase/admin";

import { Estado } from "@/types/order";

export async function updatePedidoEstado(id: string, estado: Estado) {
  const { error } = await adminClient
    .from("pedidos")
    .update({
      estado,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/admin/pedidos");
}

export async function deletePedido(id: string) {
  const { error } = await adminClient.from("pedidos").delete().eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/admin/pedidos");
}
