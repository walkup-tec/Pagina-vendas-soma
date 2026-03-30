import { motion } from "framer-motion";

const steps = [
  {
    title: "1. Você solicita o crédito",
    description: "Clica no WhatsApp e informa de quanto precisa e onde trabalha.",
  },
  {
    title: "2. Análise do vínculo CLT",
    description: "Avaliamos seu vínculo empregatício e a margem consignável disponível.",
  },
  {
    title: "3. Proposta personalizada",
    description: "Apresentamos as opções de taxa, prazo e parcela para você escolher.",
  },
  {
    title: "4. Liberação e desconto em folha",
    description: "Após a aprovação, o valor é liberado e as parcelas vão direto na folha.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-14">
      <div className="container space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Como funciona na prática
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Um passo a passo simples para você entender exatamente como o crédito
            é contratado com a SOMA.
          </p>
        </motion.div>
        <div className="relative">
          {/* Linha vertical da timeline – carrega gradualmente de cima para baixo */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-px bg-gradient-to-b from-primary/60 via-secondary/50 to-primary/60 origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 4.2, ease: "linear" }}
          />

          <div className="space-y-8">
            {steps.map((step, i) => {
              const baseDelay = 0.1 + i * 1.05;
              const delay = i === 3 ? 0.1 + 2 * 1.05 + 0.2 : baseDelay;

              return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 1,
                  delay,
                  ease: "linear",
                }}
                className={`relative flex items-start gap-6 md:gap-8 min-h-[100px] ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Conteúdo */}
                <div
                  className={`flex-1 md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${
                    i % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                  }`}
                >
                  <div className="rounded-2xl border border-border bg-card p-5 text-sm space-y-2">
                    <h3 className="font-semibold text-primary">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Nó da timeline */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 flex items-center justify-center shrink-0 z-10">
                  <span className="text-xs font-bold text-secondary-foreground bg-secondary rounded-full w-8 h-8 flex items-center justify-center border-4 border-background shadow-md">
                    {i + 1}
                  </span>
                </div>

                {/* Espaço vazio do outro lado no desktop */}
                <div className="hidden md:block flex-1 md:w-[calc(50%-2.5rem)]" />
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

