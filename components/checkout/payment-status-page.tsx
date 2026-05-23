"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { Footer } from "../layout/footer";

type Status = "success" | "pending" | "failure";
type Props = {
  status: Status;
};
const statusConfig = {
  success: {
    Icon: CheckCircle2,
    color: "text-success",
    title: "¡Pedido confirmado!",
    description: "Tu pago fue aprobado. Estamos preparando tu pedido 🍔",
  },

  pending: {
    Icon: Clock,
    color: "text-warning",
    title: "Pago pendiente",
    description: "Confirmaremos tu pedido cuando se acredite el pago.",
  },

  failure: {
    Icon: XCircle,
    color: "text-destructive",
    title: "Pago rechazado",
    description: "No pudimos procesar el pago. Probá nuevamente.",
  },
};

export default function PaymentStatusPage({ status }: Props) {
  const searchParams = useSearchParams();
  const clear = useCart((state) => state.clear);

  useEffect(() => {
    if (status === "success") {
      clear();
    }
  }, [status, clear]);

  const config = statusConfig[status];
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-gradient-card p-8 text-center shadow-card">
          <config.Icon
            className={`mx-auto h-20 w-20 ${config.color}`}
            strokeWidth={1.5}
          />
          <h1 className="font-display text-3xl uppercase">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
          {paymentId && (
            <p className="text-xs text-muted-foreground">Ref: {paymentId}</p>
          )}
          <Button asChild variant="hero" size="lg" className="w-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
