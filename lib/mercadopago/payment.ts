import { Payment } from "mercadopago";

import { mercadoPagoClient } from "@/lib/mercadopago/client";

export async function getPayment(paymentId: string) {
  const payment = new Payment(mercadoPagoClient);

  const response = await payment.get({
    id: paymentId,
  });

  return response;
}
