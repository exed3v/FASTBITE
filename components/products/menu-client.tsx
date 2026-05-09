"use client";

import ProductCard from "@/components/products/product-card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = [
  {
    id: "todos",
    label: "Todo",
  },

  {
    id: "hamburguesas",
    label: "🍔 Hamburguesas",
  },

  {
    id: "pizzas",
    label: "🍕 Pizzas",
  },

  {
    id: "combos",
    label: "🎉 Combos",
  },

  {
    id: "bebidas",
    label: "🥤 Bebidas",
  },
];

type Producto = {
  id: string;

  nombre: string;

  descripcion: string | null;

  precio: number;

  imagen_url: string | null;

  disponible: boolean;

  categoria: string;
};

type MenuClientProps = {
  productos: Producto[];
};

const MenuClient = ({ productos }: MenuClientProps) => {
  return (
    <section id="menu" className="container py-12 md:py-20">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-black uppercase md:text-5xl">El menú</h2>

        <p className="mt-2 text-muted-foreground">
          Elegí, agregá al carrito y a comer
        </p>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-center gap-2 bg-transparent">
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="transition-smooth rounded-full border border-border bg-card px-5 py-2 text-sm font-bold uppercase data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((category) => {
          const list =
            category.id === "todos"
              ? productos
              : productos.filter(
                  (product) => product.categoria === category.id,
                );

          return (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              {list.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  No hay productos en esta categoría aún.
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {list.map((product) => (
                    <ProductCard key={product.id} p={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};

export default MenuClient;
