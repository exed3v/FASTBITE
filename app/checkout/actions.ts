"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

const orderItemSchema = z.object({
  producto_id: z.uuid(),

  producto_nombre: z.string(),

  cantidad: z.number().int().positive(),

  precio_unitario: z.number().nonnegative(),
});

const createOrderSchema = z
  .object({
    cliente_nombre: z.string().min(2),

    telefono: z.string().min(6),

    direccion: z.string().nullable(),

    notas: z.string().nullable(),

    delivery_type: z.enum(["delivery", "pickup"]),

    payment_method: z.enum(["efectivo", "mercadopago"]),

    subtotal: z.number().nonnegative(),

    delivery_fee: z.number().nonnegative(),

    total: z.number().nonnegative(),

    items: z.array(orderItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (
      data.delivery_type === "delivery" &&
      (!data.direccion || data.direccion.length < 5)
    ) {
      ctx.addIssue({
        code: "custom",

        path: ["direccion"],

        message: "La dirección es obligatoria para delivery.",
      });
    }

    if (data.delivery_type === "pickup" && data.delivery_fee > 0) {
      ctx.addIssue({
        code: "custom",

        path: ["delivery_fee"],

        message: "Retiro en local no puede tener costo de envío.",
      });
    }
  });

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export async function createOrder(input: CreateOrderInput) {
  const parsed = createOrderSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Datos inválidos del pedido",
    );
  }

  // const supabase = await createClient();
  const supabase = adminClient;

  const orderData = parsed.data;

  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      cliente_nombre: orderData.cliente_nombre,

      telefono: orderData.telefono,

      direccion:
        orderData.delivery_type === "pickup" ? null : orderData.direccion,

      notas: orderData.notas,

      delivery_type: orderData.delivery_type,

      payment_method: orderData.payment_method,

      subtotal: orderData.subtotal,

      delivery_fee: orderData.delivery_fee,

      total: orderData.total,
    })
    .select()
    .single();

  if (pedidoError) {
    throw pedidoError;
  }

  const items = orderData.items.map((item) => ({
    pedido_id: pedido.id,

    producto_id: item.producto_id,

    producto_nombre: item.producto_nombre,

    cantidad: item.cantidad,

    precio_unitario: item.precio_unitario,
  }));

  const { error: itemsError } = await supabase
    .from("pedido_items")
    .insert(items);

  if (itemsError) {
    throw itemsError;
  }

  return {
    success: true,

    orderId: pedido.id,

    payment_method: orderData.payment_method,

    delivery_type: orderData.delivery_type,
  };
}
