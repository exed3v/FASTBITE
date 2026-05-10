"use client";

import { Search } from "lucide-react";

import type { Categoria } from "@/types/product";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductsFiltersProps = {
  query: string;

  onQueryChange: (value: string) => void;

  category: "todos" | string;

  onCategoryChange: (value: string) => void;

  availability: "todos" | "si" | "no";

  onAvailabilityChange: (value: "todos" | "si" | "no") => void;

  categorias: Categoria[];
};

const ProductsFilters = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  categorias,
}: ProductsFiltersProps) => {
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px_220px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar producto..."
          className="pl-9"
        />
      </div>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="todos">Todas las categorías</SelectItem>

          {categorias.map((categoria) => (
            <SelectItem key={categoria.id} value={categoria.slug}>
              {categoria.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={availability}
        onValueChange={(value) =>
          onAvailabilityChange(value as "todos" | "si" | "no")
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Disponibilidad" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>

          <SelectItem value="si">Disponibles</SelectItem>

          <SelectItem value="no">No disponibles</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductsFilters;
