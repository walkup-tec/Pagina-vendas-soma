import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-background py-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        className="w-full px-4 flex flex-col items-center text-center gap-2 text-[10px] leading-normal text-muted-foreground/25"
      >
        <p className="w-full">
          A SOMA Promotora, de CNPJ 57.802.327/0001-02, não é uma instituição financeira. Atuamos como correspondente bancário, prestando serviços de intermediação e atendimento aos clientes e usuários de instituições financeiras. A atividade de correspondente bancário é regulada pelo Banco Central do Brasil, nos termos da Resolução nº 3.954, de fevereiro de 2011. As taxas de juros e prazos praticados observam as determinações da instituição financeira escolhida no ato da contratação. Os produtos estão sujeitos à aprovação de crédito e cadastro. Não solicitamos pagamento antecipado. Utilize o crédito de forma consciente.
        </p>
        <p className="w-full">
          Conteúdo ilustrativo. As condições reais dependem da análise de crédito e do parceiro financeiro.
        </p>
        <p className="w-full">© {new Date().getFullYear()} SOMA Crédito. Todos os direitos reservados.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;

