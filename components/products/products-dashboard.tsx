"use client";

import { useMemo, useState, useTransition } from "react";

import { Pencil, Plus, Trash2 } from "lucide-react";

import type { Categoria, Producto } from "@/types/product";

import {
  deleteProduct,
  toggleProductAvailability,
} from "@/app/admin/productos/actions";

import { formatARS } from "@/utils/currency";

import { toast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import ProductFormDialog from "./product-form-dialog";

type ProductsDashboardProps = {
  productos: Producto[];

  categorias: Categoria[];
};

const ProductsDashboard = ({
  productos,
  categorias,
}: ProductsDashboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | "todos">(
    "todos",
  );

  const [editing, setEditing] = useState<Producto | null>(null);

  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "todos") {
      return productos;
    }

    return productos.filter(
      (product) => product.categorias?.slug === selectedCategory,
    );
  }, [productos, selectedCategory]);

  const handleCreate = () => {
    setEditing(null);

    setOpen(true);
  };

  const handleEdit = (product: Producto) => {
    setEditing(product);

    setOpen(true);
  };

  const handleDelete = (product: Producto) => {
    const confirmed = window.confirm(`¿Eliminar "${product.nombre}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProduct(product.id, product.imagen_url);

        toast({
          title: "Producto eliminado",
        });
      } catch (error) {
        console.error(error);

        toast({
          title: "Error",

          description: "No se pudo eliminar el producto.",

          variant: "destructive",
        });
      }
    });
  };

  const handleToggle = async (product: Producto) => {
    startTransition(async () => {
      try {
        await toggleProductAvailability(product.id, !product.disponible);

        toast({
          title: product.disponible ? "Producto ocultado" : "Producto visible",
        });
      } catch (error) {
        console.error(error);

        toast({
          title: "Error",

          description: "No se pudo actualizar el producto.",

          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black uppercase">Productos</h1>

          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 && "s"}
          </p>
        </div>

        <Button variant="cta" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedCategory === "todos" ? "cta" : "outline"}
          onClick={() => setSelectedCategory("todos")}
        >
          Todos
        </Button>

        {categorias.map((categoria) => (
          <Button
            key={categoria.id}
            size="sm"
            variant={selectedCategory === categoria.slug ? "cta" : "outline"}
            onClick={() => setSelectedCategory(categoria.slug)}
          >
            {categoria.nombre}
          </Button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No hay productos.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted">
                {product.imagen_url ? (
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold uppercase">{product.nombre}</h3>

                    <p className="text-sm text-muted-foreground">
                      {product.categorias?.nombre}
                    </p>
                  </div>

                  <Badge variant={product.disponible ? "default" : "secondary"}>
                    {product.disponible ? "Disponible" : "Oculto"}
                  </Badge>
                </div>

                {product.descripcion && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.descripcion}
                  </p>
                )}

                <div className="text-2xl font-black text-primary">
                  {formatARS(product.precio)}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle(product)}
                  >
                    {product.disponible ? "Ocultar" : "Mostrar"}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product)}
                    disabled={isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductFormDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        categorias={categorias}
      />
    </>
  );
};

export default ProductsDashboard;
