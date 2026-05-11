export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  created_at?: string;
};

export type Producto = {
  id: string;
  categoria_id: string;
  categorias?: Categoria;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  disponible: boolean;
  created_at: string;
  updated_at?: string;
};
