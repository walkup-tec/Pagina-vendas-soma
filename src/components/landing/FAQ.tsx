import { motion } from "framer-motion";

const faqs = [
  {
    q: "Quem pode contratar o consignado para trabalhadores?",
    a: "Trabalhadores maiores de 18 anos, com carteira assinada (CLT) e margem consignável disponível no salário.",
  },
  {
    q: "Quanto da minha renda posso comprometer?",
    a: "Em geral, até 35% do salário líquido pode ser utilizado para o valor da parcela, seguindo as regras do produto.",
  },
  {
    q: "Preciso ter o nome limpo para ser aprovado?",
    a: "Em muitos casos é possível a aprovação mesmo com restrição, desde que o vínculo empregatício e a margem permitam.",
  },
  {
    q: "O processo é todo online?",
    a: "Sim. Você faz tudo pelo WhatsApp, envia seus dados e documentos e acompanha cada etapa com a equipe SOMA.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16">
      <div className="container space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Dúvidas frequentes
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Algumas respostas rápidas sobre o crédito. Podemos atualizar este
            conteúdo com as perguntas mais comuns             dos seus clientes.
          </p>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <details className="group rounded-2xl border border-border bg-card p-4 text-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-semibold text-foreground">{item.q}</span>
                  <span className="text-xs text-muted-foreground group-open:hidden">
                    +
                  </span>
                  <span className="text-xs text-muted-foreground hidden group-open:inline">
                    -
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground">{item.a}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

