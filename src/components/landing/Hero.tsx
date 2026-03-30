import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/config/whatsapp";
import { trackMetaCustomEvent, trackMetaEvent, trackWhatsappCtaClick } from "@/lib/metaPixel";
import { META_CUSTOM_EVENTS, META_EVENT_PLACEMENTS } from "@/lib/metaPixelEvents";
import SomaLogo from "./SomaLogo";

interface HeroProps {
  onOpenSimulacao: () => void;
}

const Hero = ({ onOpenSimulacao }: HeroProps) => {
  const handleWhatsappClick = () => {
    trackWhatsappCtaClick(META_EVENT_PLACEMENTS.HERO_PRIMARY_CTA);
  };

  const handleOpenSimulacao = () => {
    trackMetaEvent("Lead", {
      source: META_EVENT_PLACEMENTS.HERO_SIMULACAO_CARD,
    });
    trackMetaCustomEvent(META_CUSTOM_EVENTS.SIMULATION_STARTED, {
      source: META_EVENT_PLACEMENTS.HERO_SIMULACAO_CARD,
    });
    onOpenSimulacao();
  };

  return (
    <section
      id="inicio"
      className="pt-8 pb-16 bg-gradient-to-b from-primary/10 via-background to-background"
    >
      <div className="container grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-6 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="-ml-[3%]"
          >
            <SomaLogo />
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-secondary/10 border border-secondary/40 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary"
          >
            Crédito rápido e fácil
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-4xl lg:text-5xl font-display font-extrabold leading-tight md:leading-[2]"
          >
            Consignado do
            <span className="block mt-0.5 md:mt-2 text-inherit">Trabalhador</span>
            <span className="block text-secondary mt-1">
              com parcelas na folha
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl"
          >
            Crédito exclusivo para quem tem carteira assinada (CLT), com juros
            mais baixos e parcelas descontadas direto no contracheque.
          </motion.p>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-2 text-xs sm:text-sm md:text-base text-foreground/90"
          >
            <li className="flex items-center gap-2">
              <svg className="shrink-0 w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Pré-aprovação para negativados
            </li>
            <li className="flex items-center gap-2">
              <svg className="shrink-0 w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Pagamento direto na folha de pagamento, sem boletos
            </li>
            <li className="flex items-center gap-2">
              <svg className="shrink-0 w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              As melhores taxas e condições para o seu empréstimo
            </li>
          </motion.ul>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 pt-3"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappClick}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
              >
                Contrate pelo WhatsApp
                <i className="bi bi-whatsapp text-lg" />
              </button>
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hidden md:block"
        >
          <div className="rounded-3xl bg-card border border-border p-6 shadow-md space-y-4">
            <h3 className="text-lg font-display font-semibold">
              Simulação de Crédito
            </h3>
            <p className="text-xs text-muted-foreground">
              Cliente CLT com salário de R$ 3.500,00
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exemplo de valor solicitado</span>
                <span className="font-semibold text-foreground">
                  R$ 3.000,00
                </span>
              </div>
              <div className="flex justify-between">
                <span>Parcela aproximada</span>
                <span className="font-semibold text-foreground">
                  R$ 189,90 / mês
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                *Simulação hipotética apenas para ilustrar. O valor da parcela
                varia conforme taxa, prazo e margem disponível.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenSimulacao}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
            >
              De quanto você precisa?
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
