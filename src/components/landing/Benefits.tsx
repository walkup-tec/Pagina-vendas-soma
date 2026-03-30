import { motion } from "framer-motion";
import { trackMetaCustomEvent, trackMetaEvent } from "@/lib/metaPixel";
import { META_CUSTOM_EVENTS, META_EVENT_PLACEMENTS } from "@/lib/metaPixelEvents";

const benefits = [
  {
    title: "As melhores taxas e condições para o seu empréstimo",
    description:
      "Por ser descontado em folha, o consignado para trabalhadores CLT costuma ter taxas menores.",
  },
  {
    title: "Pagamento direto na folha de pagamento, sem boletos",
    description: "As parcelas são fixas e descontadas direto do seu salário todo mês.",
  },
  {
    title: "Pré-aprovação para negativados",
    description: "Mesmo com restrição no nome, é possível ter o crédito aprovado conforme análise.",
  },
  {
    title: "Atendimento 100% online",
    description: "Você faz tudo pelo WhatsApp, com suporte humano da equipe SOMA.",
  },
];

interface BenefitsProps {
  onOpenSimulacao: () => void;
}

const Benefits = ({ onOpenSimulacao }: BenefitsProps) => {
  const handleOpenSimulacao = () => {
    trackMetaEvent("Lead", {
      source: META_EVENT_PLACEMENTS.BENEFITS_MOBILE_CARD,
    });
    trackMetaCustomEvent(META_CUSTOM_EVENTS.SIMULATION_STARTED, {
      source: META_EVENT_PLACEMENTS.BENEFITS_MOBILE_CARD,
    });
    onOpenSimulacao();
  };

  return (
    <section id="beneficios" className="py-14 bg-muted">
      <div className="container space-y-8">
        {/* Card Simulação de Crédito - apenas mobile */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="block md:hidden pb-10 md:pb-0"
        >
          <div className="rounded-3xl bg-card border border-border p-6 shadow-md space-y-4">
            <h3 className="text-lg font-display font-semibold">Simulação de Crédito</h3>
            <p className="text-xs text-muted-foreground">Cliente CLT com salário de R$ 3.500,00</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exemplo de valor solicitado</span>
                <span className="font-semibold text-foreground">R$ 3.000,00</span>
              </div>
              <div className="flex justify-between">
                <span>Parcela aproximada</span>
                <span className="font-semibold text-foreground">R$ 189,90 / mês</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                *Simulação hipotética apenas para ilustrar. O valor da parcela varia conforme taxa, prazo e margem disponível.
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
          <div className="flex justify-center pt-8">
            <div className="w-[80%] h-px bg-border" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl pl-5 md:pl-6 border-l-4 border-secondary/60"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Porque escolher o crédito da SOMA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
          Uma oferta pensada para quem busca crédito com segurança, clareza e
          suporte de verdade.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl bg-card border border-border p-6 shadow-sm relative overflow-hidden group hover:border-secondary/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-12 bg-secondary/50 rounded-r" />
              <h3 className="font-semibold mb-2 text-foreground pl-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

