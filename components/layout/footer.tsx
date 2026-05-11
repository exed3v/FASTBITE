import { Flame } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-card/40 mt-16">
    <div className="container py-10 grid gap-6 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <Flame className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display uppercase">FastBite</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Comida rápida real, lista en minutos.
        </p>
      </div>
      <div className="text-sm">
        <h4 className="font-bold mb-2">Horarios</h4>
        <p className="text-muted-foreground">Lun a Dom · 11:00 – 23:00</p>
      </div>
      <div className="text-sm">
        <h4 className="font-bold mb-2">Contacto</h4>
        <p className="text-muted-foreground">WhatsApp: +54 11 1234-5678</p>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} FastBite. Todos los derechos reservados.
    </div>
  </footer>
);
