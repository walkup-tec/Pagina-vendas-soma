import { useEffect, useState } from "react";
import Hero from "./components/landing/Hero";
import Benefits from "./components/landing/Benefits";
import HowItWorks from "./components/landing/HowItWorks";
import OfferDetails from "./components/landing/OfferDetails";
import FAQ from "./components/landing/FAQ";
import CTAStrong from "./components/landing/CTAStrong";
import Footer from "./components/landing/Footer";
import ValorSimulacaoModal from "./components/landing/ValorSimulacaoModal";
import { trackMetaCustomEvent, trackMetaEvent } from "./lib/metaPixel";
import { META_CUSTOM_EVENTS, META_EVENT_PLACEMENTS } from "./lib/metaPixelEvents";

function App() {
  const [modalSimulacaoAberto, setModalSimulacaoAberto] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const handleOpenFloatingSimulacao = () => {
    trackMetaEvent("Lead", {
      source: META_EVENT_PLACEMENTS.FLOATING_TOP_CTA,
    });
    trackMetaCustomEvent(META_CUSTOM_EVENTS.SIMULATION_STARTED, {
      source: META_EVENT_PLACEMENTS.FLOATING_TOP_CTA,
    });
    setModalSimulacaoAberto(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("inicio");
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setShowFloatingCta(heroBottom <= 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main>
        <Hero onOpenSimulacao={() => setModalSimulacaoAberto(true)} />
        <Benefits onOpenSimulacao={() => setModalSimulacaoAberto(true)} />
        <HowItWorks />
        <OfferDetails />
        <FAQ />
        <CTAStrong />
      </main>
      <Footer />
      <ValorSimulacaoModal
        isOpen={modalSimulacaoAberto}
        onClose={() => setModalSimulacaoAberto(false)}
      />

      {/* Botão flutuante de contratação (após passar o Hero) */}
      {showFloatingCta && (
        <button
          type="button"
          onClick={handleOpenFloatingSimulacao}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-40 h-10 px-6 bg-accent text-accent-foreground rounded-b-xl shadow-xl flex items-center justify-center hover:bg-accent/90 transition-transform floating-cta-wave-soma"
          aria-label="Contrate agora"
        >
          <span className="text-[11px] font-semibold tracking-[0.2em]">
            CONTRATE AGORA
          </span>
        </button>
      )}
    </div>
  );
}

export default App;
