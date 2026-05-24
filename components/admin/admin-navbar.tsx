"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

const AdminNavbar = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="border-b p-6">
        <h2 className="text-2xl font-black uppercase">FastBite Admin</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link href="/admin/productos">
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" />
            Productos
          </Button>
        </Link>

        <Link href="/admin/pedidos">
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Pedidos
          </Button>
        </Link>
      </nav>

      <div className="border-t p-4">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
};

export default AdminNavbar;
