"use client";

import Image from "next/image";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { toast } from "@/hooks/use-toast";

import { useCart } from "@/store/cart";
import { useCartUI } from "@/store/cartUI";

import { formatARS } from "@/utils/currency";

const CartSidebar = () => {
  const isOpen = useCartUI((state) => state.isOpen);

  const close = useCartUI((state) => state.close);

  const openCheckout = useCartUI((state) => state.openCheckout);

  const items = useCart((state) => state.items);

  const setQty = useCart((state) => state.setQty);

  const remove = useCart((state) => state.remove);

  const subtotal = useCart((state) => state.subtotal());

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-black uppercase">
            Tu pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />

            <p className="text-muted-foreground">Tu carrito está vacío</p>

            <Button variant="cta" onClick={close}>
              Ver el menú
            </Button>
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.imagen_url ? (
                        <Image
                          src={item.imagen_url}
                          alt={item.nombre}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold leading-tight">
                          {item.nombre}
                        </span>

                        <button
                          onClick={() => {
                            remove(item.id);

                            toast({
                              title: "Producto eliminado",
                            });
                          }}
                          className="text-muted-foreground transition hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-primary">
                        {formatARS(item.precio)}
                      </span>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-border">
                          <button
                            onClick={() => setQty(item.id, item.cantidad - 1)}
                            className="p-1.5 transition hover:text-primary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="w-6 text-center text-sm font-bold">
                            {item.cantidad}
                          </span>

                          <button
                            onClick={() => setQty(item.id, item.cantidad + 1)}
                            className="p-1.5 transition hover:text-primary"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="font-bold">
                          {formatARS(item.precio * item.cantidad)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>

                <span>{formatARS(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>

                <span>Se calcula al finalizar</span>
              </div>

              <div className="flex justify-between text-xl font-black">
                <span>Total</span>

                <span className="text-primary">{formatARS(subtotal)}</span>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={openCheckout}
              >
                Continuar al pago
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
