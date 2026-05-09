"use client";
import Image from "next/image";
import { Clock, Flame, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="bg-gradient-glow absolute inset-0 opacity-70"
        aria-hidden
      />

      <div className="container relative grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Flame className="h-3.5 w-3.5" />
            Envío gratis pidiendo +$15.000
          </div>

          <h1 className="text-5xl font-black uppercase leading-[0.95] md:text-7xl">
            Hambre.
            <br />
            <span className="text-primary">Click.</span>{" "}
            <span className="text-accent">Devorado.</span>
          </h1>

          <p className="max-w-md text-lg text-muted-foreground">
            Hamburguesas, pizzas y combos brutales. Pedí online, pagá con
            Mercado Pago y comé en minutos.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="xl" variant="hero" asChild>
              <a href="#menu">Ver el menú 🔥</a>
            </Button>

            <Button size="xl" variant="outline" asChild>
              <a href="#promos">Promos del día</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Delivery 25 min
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Abierto 11–23h
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="bg-gradient-hero absolute -inset-4 rounded-full opacity-30 blur-3xl"
            aria-hidden
          />

          <Image
            src="/hero-burger.jpg"
            alt="Hamburguesa doble con cheddar y bacon"
            width={1536}
            height={1024}
            className="shadow-glow relative w-full rounded-3xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
