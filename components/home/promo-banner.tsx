import React from "react";

const PromoBanner = () => {
  return (
    <section id="promos" className="container py-8">
      <div className="rounded-2xl bg-gradient-hero p-6 md:p-10 text-primary-foreground shadow-glow">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          2x1 en hamburguesas los miércoles 🔥
        </h2>
        <p className="mt-2 max-w-xl text-primary-foreground/80">
          Pedí cualquier hamburguesa los miércoles y llevate la segunda gratis.
        </p>
      </div>
    </section>
  );
};

export default PromoBanner;
