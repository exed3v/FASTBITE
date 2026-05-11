import { Flame } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-glow">
            <Flame className="h-7 w-7 text-primary-foreground animate-pulse" />
          </div>

          <div>
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />

            <div className="mt-2 h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="mb-8 flex gap-3 overflow-hidden">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-32 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/3] animate-pulse bg-muted" />

              <div className="space-y-3 p-4">
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />

                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="h-7 w-24 animate-pulse rounded bg-muted" />

                  <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
