import ProductsDashboard from "@/components/products/products-dashboard";

import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const [productsResult, categoriesResult] = await Promise.all([
    (supabase.from("productos") as any)
      .select(
        `
        *,
        categorias (
          id,
          nombre,
          slug
        )
      `,
      )
      .order("created_at", {
        ascending: false,
      }),

    (supabase.from("categorias") as any).select("*").order("nombre"),
  ]);

  return (
    <ProductsDashboard
      productos={productsResult.data ?? []}
      categorias={categoriesResult.data ?? []}
    />
  );
}
