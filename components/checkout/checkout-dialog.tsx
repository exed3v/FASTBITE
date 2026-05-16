"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { createOrder } from "@/app/checkout/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/store/cart";
import { useCartUI } from "@/store/cartUI";
import { formatARS } from "@/utils/currency";

const DELIVERY_FEE = 1000;
const schema = z.object({
  cliente_nombre: z.string().trim().min(2, "Nombre muy corto").max(120),
  telefono: z.string().trim().min(6, "Teléfono inválido").max(30),
  direccion: z.string().trim().max(300).optional(),
  notas: z.string().trim().max(500).optional(),
});

const CheckoutDialog = () => {
  const checkoutOpen = useCartUI((state) => state.checkoutOpen);
  const closeCheckout = useCartUI((state) => state.closeCheckout);
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.subtotal());
  const clearCart = useCart((state) => state.clear);

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "efectivo" | "mercadopago"
  >("mercadopago");
  const [form, setForm] = useState({
    cliente_nombre: "",
    telefono: "",
    direccion: "",
    notas: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = deliveryType === "delivery" ? DELIVERY_FEE : 0;

  const total = subtotal + deliveryFee;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    if (
      deliveryType === "delivery" &&
      (!parsed.data.direccion || parsed.data.direccion.length < 5)
    ) {
      setErrors({
        direccion: "La dirección es obligatoria",
      });

      return;
    }
    if (items.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const result = await createOrder({
        cliente_nombre: parsed.data.cliente_nombre,

        telefono: parsed.data.telefono,

        direccion:
          deliveryType === "pickup" ? null : (parsed.data.direccion ?? null),

        notas: parsed.data.notas ?? null,

        delivery_type: deliveryType,

        payment_method: paymentMethod,

        subtotal,

        delivery_fee: deliveryFee,

        total,

        items: items.map((item) => ({
          producto_id: item.id,

          producto_nombre: item.nombre,

          cantidad: item.cantidad,

          precio_unitario: item.precio,
        })),
      });

      if (paymentMethod === "efectivo") {
        clearCart();

        closeCheckout();

        toast({
          title: "Pedido realizado",

          description: "Tu pedido fue enviado correctamente.",
        });
        return;
      }
      console.log(result);
      toast({
        title: "Mercado Pago próximamente",
        description: "El flujo de pago será integrado en el siguiente paso.",
      });
    } catch (error) {
      toast({
        title: "Error al crear pedido",

        description:
          error instanceof Error ? error.message : "Error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={checkoutOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeCheckout();
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase">
            Datos de entrega
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              value={form.cliente_nombre}
              maxLength={120}
              onChange={(event) =>
                setForm({
                  ...form,

                  cliente_nombre: event.target.value,
                })
              }
            />
            {errors.cliente_nombre && (
              <p className="mt-1 text-xs text-destructive">
                {errors.cliente_nombre}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              type="tel"
              value={form.telefono}
              maxLength={30}
              onChange={(event) =>
                setForm({
                  ...form,

                  telefono: event.target.value,
                })
              }
            />
            {errors.telefono && (
              <p className="mt-1 text-xs text-destructive">{errors.telefono}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Método de entrega</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={deliveryType === "delivery" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setDeliveryType("delivery")}
              >
                Delivery
              </Button>
              <Button
                type="button"
                variant={deliveryType === "pickup" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setDeliveryType("pickup")}
              >
                Retiro en local
              </Button>
            </div>
          </div>
          {deliveryType === "delivery" && (
            <div>
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={form.direccion}
                maxLength={300}
                placeholder="Calle, número, piso/depto"
                onChange={(event) =>
                  setForm({
                    ...form,

                    direccion: event.target.value,
                  })
                }
              />
              {errors.direccion && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.direccion}
                </p>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={form.notas}
              maxLength={500}
              placeholder="Sin cebolla, timbre roto, etc."
              onChange={(event) =>
                setForm({
                  ...form,

                  notas: event.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Método de pago</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={paymentMethod === "efectivo" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPaymentMethod("efectivo")}
              >
                Efectivo
              </Button>
              <Button
                type="button"
                variant={
                  paymentMethod === "mercadopago" ? "default" : "outline"
                }
                className="flex-1"
                onClick={() => setPaymentMethod("mercadopago")}
              >
                Mercado Pago
              </Button>
            </div>
          </div>
          <div className="space-y-1 rounded-lg bg-muted/40 p-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatARS(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>
                {deliveryType === "delivery"
                  ? formatARS(DELIVERY_FEE)
                  : "Gratis"}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-lg font-black">
              <span>Total</span>
              <span className="text-primary">{formatARS(total)}</span>
            </div>
          </div>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={loading || items.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : paymentMethod === "mercadopago" ? (
              "Pagar con Mercado Pago"
            ) : (
              "Confirmar pedido"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {paymentMethod === "mercadopago"
              ? "Serás redirigido a Mercado Pago para completar el pago."
              : "Pagarás al recibir o retirar tu pedido."}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
