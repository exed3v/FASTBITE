import { createClient } from "@/lib/supabase/server";

import MenuClient from "@/components/products/menu-client";

const Menu = async () => {
  const supabase = await createClient();

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("disponible", true)
    .order("nombre");

  return <MenuClient productos={productos ?? []} />;
};

export default Menu;
