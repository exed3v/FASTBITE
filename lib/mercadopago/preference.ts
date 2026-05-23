import { Preference } from "mercadopago";

import { mercadoPagoClient } from "@/lib/mercadopago/client";

type CreatePreferenceInput = {
  orderId: string;
  items: {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }[];
};

export async function createPreference({
  orderId,
  items,
}: CreatePreferenceInput) {
  const preference = new Preference(mercadoPagoClient);
  console.log("appUrl: ", process.env.NEXT_PUBLIC_APP_URL);
  const response = await preference.create({
    body: {
      items,

      external_reference: orderId,

      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pago/exitoso`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pago/fallido`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pago/pendiente`,
      },

      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  });

  return response.init_point;
}
