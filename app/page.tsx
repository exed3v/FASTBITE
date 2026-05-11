import CartSidebar from "@/components/cart/cart-sidebar";
import CheckoutDialog from "@/components/checkout/checkout-dialog";
import Hero from "@/components/home/hero";
import PromoBanner from "@/components/home/promo-banner";
import { Footer } from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Menu from "@/components/products/menu";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        <PromoBanner />

        <Menu />
      </main>

      <Footer />
      <CartSidebar />
      <CheckoutDialog />
    </div>
  );
}
