import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { getPayment } from "@/lib/mercadopago/payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = body?.data?.id;

    if (!paymentId) {
      return NextResponse.json(
        {
          error: "Missing payment id",
        },
        {
          status: 400,
        },
      );
    }

    const payment = await getPayment(paymentId);
    const orderId = payment.external_reference;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Missing external reference",
        },
        {
          status: 400,
        },
      );
    }

    const paymentStatus = payment.status;

    await adminClient
      .from("pedidos")
      .update({
        payment_status: paymentStatus === "approved" ? "aprobado" : "rechazado",
        estado: paymentStatus === "approved" ? "en_preparacion" : "pendiente",
        payment_id: payment.id?.toString() ?? null,
      })
      .eq("id", orderId);
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("MercadoPago webhook error", error);
    return NextResponse.json(
      {
        error: "Webhook error",
      },
      {
        status: 500,
      },
    );
  }
}
