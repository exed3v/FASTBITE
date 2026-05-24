"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function OrdersPagination({
  page,
  pageSize,
  total,
  totalPages,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const changePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/admin/pedidos?${params.toString()}`);
  };

  if (total <= pageSize) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-between px-1">
      <span className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium text-foreground">
          {start}–{end}
        </span>{" "}
        de <span className="font-medium text-foreground">{total}</span>
      </span>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="border-border/60 hover:border-primary/40 hover:text-primary"
          disabled={page <= 1}
          onClick={() => changePage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="px-3 text-xs font-medium tabular-nums text-muted-foreground">
          {page} / {totalPages}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="border-border/60 hover:border-primary/40 hover:text-primary"
          disabled={page >= totalPages}
          onClick={() => changePage(page + 1)}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
