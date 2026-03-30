import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/config/whatsapp";
import { trackWhatsappCtaClick } from "@/lib/metaPixel";
import { META_EVENT_PLACEMENTS } from "@/lib/metaPixelEvents";

const OfferDetails = () => {
  return (
    <section id="oferta" className="py-16 bg-muted">
      <div className="container grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Consignado do Trabalhador CLT
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            empréstimo consignado privado para trabalhadores de carteira assinada,
            com parcelas descontadas diretamente da folha de pagamento.
          </p>
          <ul className="space-y-3 text-xs sm:text-sm md:text-base text-foreground/90">
            <li className="flex items-center gap-3">
              <i className="bi bi-check2-circle text-secondary shrink-0 text-lg" />
              <span>Pré-aprovação para negativados</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="bi bi-bank2 text-secondary shrink-0 text-lg" />
              <span>Pagamento direto na folha de pagamento, sem boletos</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="bi bi-graph-up-arrow text-secondary shrink-0 text-lg" />
              <span>As melhores taxas e condições para o seu empréstimo</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="bi bi-person-badge text-secondary shrink-0 text-lg" />
              <span>Público-alvo: trabalhadores CLT com registro em carteira</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="bi bi-shield-check text-secondary shrink-0 text-lg" />
              <span>Consignado facilitado sem comprometer seu crédito</span>
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl border border-border shadow-xl w-full aspect-[4/3] group"
        >
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <img
              src="/consignado-clt-atendimento.webp"
              alt="Pessoa feliz sendo atendida online pelo celular"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
          </div>
          <div className="absolute right-[-35px] bottom-[-30px] z-20 rounded-2xl bg-card/95 backdrop-blur-sm border border-border shadow-xl p-3.5 w-[min(257px,85.5vw)] min-h-[99px] flex flex-col justify-between gap-2.5">
              <p className="text-xs font-medium text-card-foreground leading-snug">
                Pronto para simular seu empréstimo com as melhores condições?
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsappCtaClick(META_EVENT_PLACEMENTS.OFFER_DETAILS_WHATSAPP)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-secondary/90 transition-all duration-300"
              >
                <i className="bi bi-whatsapp text-base" />
                <span>Contrate agora!</span>
              </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferDetails;

