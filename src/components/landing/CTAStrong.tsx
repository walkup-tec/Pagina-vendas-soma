import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/config/whatsapp";
import { trackWhatsappCtaClick } from "@/lib/metaPixel";
import { META_EVENT_PLACEMENTS } from "@/lib/metaPixelEvents";

const CTAStrong = () => {
  const handleWhatsappClick = () => {
    trackWhatsappCtaClick(META_EVENT_PLACEMENTS.BOTTOM_STRONG_CTA);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary via-secondary to-primary">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="container text-center text-primary-foreground space-y-8"
      >
        <h2 className="text-2xl md:text-3xl font-display font-extrabold">
          Pronto para dar o próximo passo?
        </h2>
        <p className="text-sm md:text-base max-w-2xl mx-auto text-primary-foreground/90">
          Toda a sua contratação de forma 100% digital, através do WhatsApp. Clique no botão abaixo e confira!
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4"
          onClick={handleWhatsappClick}
        >
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full bg-accent px-10 py-4 text-sm font-bold text-accent-foreground shadow-xl hover:bg-accent/90 transition-colors"
          >
            Contrate agora pelo WhatsApp
            <i className="bi bi-whatsapp text-lg" />
          </button>
        </a>
      </motion.div>
    </section>
  );
};

export default CTAStrong;

