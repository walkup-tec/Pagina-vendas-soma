import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        className="container flex flex-col gap-4 text-xs text-muted-foreground max-w-4xl"
      >
        <p className="text-[11px] leading-relaxed">
          A SOMA Promotora não é uma instituição financeira. Atuamos como correspondente bancário, prestando serviços de intermediação e atendimento aos clientes e usuários de instituições financeiras. A atividade de correspondente bancário é regulada pelo Banco Central do Brasil, nos termos da Resolução nº 3.954, de fevereiro de 2011. As taxas de juros e prazos praticados observam as determinações da instituição financeira escolhida no ato da contratação. Os produtos estão sujeitos à aprovação de crédito e cadastro. Não solicitamos pagamento antecipado. Utilize o crédito de forma consciente.
        </p>
        <p className="text-[11px] leading-relaxed">
          Conteúdo ilustrativo. As condições reais dependem da análise de crédito e do parceiro financeiro.
        </p>
        <p>© {new Date().getFullYear()} SOMA Crédito. Todos os direitos reservados.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;

