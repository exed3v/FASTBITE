"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useCartUI } from "@/store/cartUI";

const CartButton = () => {
  const count = useCart((state) => state.count());

  const open = useCartUI((state) => state.open);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button onClick={open} className="relative cursor-pointer">
      <ShoppingBag className="h-4 w-4" />

      <span className="hidden sm:inline">Mi pedido</span>

      {mounted && count > 0 && (
        <span className="shadow-button absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
