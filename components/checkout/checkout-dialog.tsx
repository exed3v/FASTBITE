"use client";

import { useState } from "react";

import { z } from "zod";

import { Loader2 } from "lucide-react";

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

import { createClient } from "@/lib/supabase/browser";
import { useCart } from "@/store/cart";

import { useCartUI } from "@/store/cartUI";

import { formatARS } from "@/utils/currency";

const schema = z.object({
  cliente_nombre: z.string().trim().min(2, "Nombre muy corto").max(120),

  telefono: z.string().trim().min(6, "Teléfono inválido").max(30),

  direccion: z.string().trim().min(5, "Dirección muy corta").max(300),

  notas: z.string().trim().max(500).optional(),
});

const CheckoutDialog = () => {
  const supabase = createClient();

  const checkoutOpen = useCartUI((state) => state.checkoutOpen);

  const closeCheckout = useCartUI((state) => state.closeCheckout);

  const items = useCart((state) => state.items);

  const subtotal = useCart((state) => state.subtotal());

  const [form, setForm] = useState({
    cliente_nombre: "",

    telefono: "",

    direccion: "",

    notas: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (items.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const deliveryFee = 0;

      const total = subtotal + deliveryFee;

      const { data, error } = await supabase.functions.invoke(
        "create-preference",
        {
          body: {
            cliente: parsed.data,

            items: items.map((item) => ({
              id: item.id,

              nombre: item.nombre,

              precio: item.precio,

              cantidad: item.cantidad,
            })),

            subtotal,

            envio: deliveryFee,

            total,
          },
        },
      );

      if (error) {
        throw error;
      }

      if (data?.init_point) {
        window.location.href = data.init_point;

        return;
      }

      throw new Error("No se pudo iniciar el pago");
    } catch (error: any) {
      toast({
        title: "Error al iniciar el pago",

        description: error?.message ?? "Verifica Mercado Pago.",

        variant: "destructive",
      });

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

          <div className="space-y-1 rounded-lg bg-muted/40 p-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatARS(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Envío</span>

              <span>Se calcula luego</span>
            </div>

            <div className="flex justify-between pt-1 text-lg font-black">
              <span>Total</span>

              <span className="text-primary">{formatARS(subtotal)}</span>
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
            ) : (
              "Pagar con Mercado Pago"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Serás redirigido a Mercado Pago para completar el pago.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
