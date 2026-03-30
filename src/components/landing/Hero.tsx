import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackMetaCustomEvent, trackMetaEvent } from "@/lib/metaPixel";
import { META_CUSTOM_EVENTS, META_EVENT_PLACEMENTS } from "@/lib/metaPixelEvents";
import SomaLogo from "./SomaLogo";
import JornadaClt from "./JornadaClt";

const highlightTags = [
  "As melhores condições",
  "Direto em folha",
  "Pré-aprova negativados",
  "Análise 100% online",
] as const;

const Hero = () => {
  const [started, setStarted] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  const handleStart = () => {
    trackMetaEvent("Lead", {
      source: META_EVENT_PLACEMENTS.HERO_SIMULACAO_CARD,
    });
    trackMetaCustomEvent(META_CUSTOM_EVENTS.SIMULATION_STARTED, {
      source: META_EVENT_PLACEMENTS.HERO_SIMULACAO_CARD,
    });
    setStarted(true);
  };

  useEffect(() => {
    if (started) {
      setShowNudge(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowNudge(true);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [started]);

  return (
    <section
      id="inicio"
      className="flex-1 flex flex-col py-6 bg-gradient-to-b from-primary/10 via-background to-background"
    >
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="hero-intro"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center justify-center text-center gap-4 px-2"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              className="w-full flex justify-center relative left-[55px]"
              >
                <div>
                  <SomaLogo />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-secondary/10 border border-secondary/40 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary"
              >
                Crédito exclusivo para CLT
              </motion.button>

              <h1 className="text-[2.6rem] md:text-[3rem] font-display font-extrabold leading-tight">
                Consignado do Trabalhador
              </h1>

              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                Responda a poucas perguntas e chame no WhatsApp para fazer a simulação.
              </p>

              <ul className="pt-2 w-full grid grid-cols-2 gap-x-10 gap-y-1 items-center">
                {(
                  [
                    // Linha 1 (igual imagem)
                    { side: "left", label: highlightTags[3] }, // Análise 100% online
                    { side: "right", label: highlightTags[0] }, // As melhores condições
                    // Linha 2 (igual imagem)
                    { side: "left", label: highlightTags[2] }, // Pré-aprova negativados
                    { side: "right", label: highlightTags[1] }, // Direto em folha
                  ] as const
                ).map(({ side, label }, idx) => {
                  const isLeft = side === "left";
                  return (
                    <motion.li
                      key={`${side}-${label}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className={[
                        "flex items-center gap-3 text-xs md:text-sm text-foreground/85",
                        isLeft ? "justify-end" : "justify-start",
                      ].join(" ")}
                    >
                      {isLeft ? (
                        <>
                          <span className="whitespace-nowrap">{label}</span>
                          <i
                            className="bi bi-check2-circle text-secondary text-lg shrink-0"
                            aria-hidden
                          />
                        </>
                      ) : (
                        <>
                          <i
                            className="bi bi-check2-circle text-secondary text-lg shrink-0"
                            aria-hidden
                          />
                          <span className="whitespace-nowrap">{label}</span>
                        </>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={handleStart}
                className="w-full max-w-md mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm md:text-base font-bold text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors floating-cta-wave-soma"
              >
                Começar minha análise
              </button>

              {showNudge && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-xs md:text-sm text-secondary font-semibold nudge-double-zoom"
                >
                  Vamos lá! Após análise em poucos minutos o dinheiro está na conta.
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hero-jornada"
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center justify-center px-2"
            >
              <div className="w-full max-w-md">
                <JornadaClt onExit={() => setStarted(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;
