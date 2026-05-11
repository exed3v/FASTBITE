import Link from "next/link";
import { Flame } from "lucide-react";
import CartButton from "@/components/cart/cart-button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <Flame
              className="h-5 w-5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>

          <span className="text-xl font-black uppercase tracking-tight">
            Fast
            <span className="text-primary">Bite</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#menu" className="transition hover:text-primary">
            Menú
          </a>

          <a href="#promos" className="transition hover:text-primary">
            Promos
          </a>
        </nav>

        <CartButton />
      </div>
    </header>
  );
};

export default Header;
