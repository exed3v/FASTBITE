import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AdminNavbar from "@/components/admin/admin-navbar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: roleData } = await (supabase.rpc as any)("has_role", {
    _role: "admin",
  });

  if (!roleData) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavbar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
