import { useMemo } from "react";
import Hero from "./components/landing/Hero";
import Footer from "./components/landing/Footer";

function App() {
  // Sem scroll: a página ocupa 100% da tela.
  // Mantemos o componente simples para não depender de eventos de `scroll`.
  const containerClassName = useMemo(
    () => "h-screen overflow-hidden bg-background text-foreground flex flex-col",
    []
  );

  return (
    <div className={containerClassName}>
      <main className="flex-1 overflow-hidden">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default App;
