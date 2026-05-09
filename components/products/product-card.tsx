"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatARS } from "@/utils/currency";

type ProductCardProps = {
  p: {
    id: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    imagen_url: string | null;
    disponible: boolean;
  };
};

const ProductCard = ({ p }: ProductCardProps) => {
  const add = useCart((state) => state.add);

  const handleAdd = () => {
    add({
      id: p.id,
      nombre: p.nombre,
      precio: Number(p.precio),
      imagen_url: p.imagen_url,
    });

    toast({
      title: "Agregado al carrito 🔥",
      description: p.nombre,
    });
  };

  return (
    <article className="shadow-card transition-smooth group relative overflow-hidden rounded-2xl border border-border bg-gradient-card hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {p.imagen_url ? (
          <Image
            src={p.imagen_url}
            alt={p.nombre}
            width={600}
            height={400}
            className="transition-smooth h-full w-full object-cover group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-black uppercase leading-tight">
          {p.nombre}
        </h3>

        {p.descripcion && (
          <p className="min-h-[40px] line-clamp-2 text-sm text-muted-foreground">
            {p.descripcion}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-2xl font-black text-primary">
            {formatARS(Number(p.precio))}
          </span>

          <Button
            size="sm"
            variant="cta"
            onClick={handleAdd}
            disabled={!p.disponible}
          >
            <Plus className="h-4 w-4" />

            {p.disponible ? "Agregar" : "Agotado"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
