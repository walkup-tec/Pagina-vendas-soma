const META_CUSTOM_EVENT_VERSION = "v1";

const withVersion = (eventName: string) => `${eventName}_${META_CUSTOM_EVENT_VERSION}`;

export const META_CUSTOM_EVENTS = {
  WHATSAPP_CTA_CLICKED: withVersion("WhatsAppCtaClicked"),
  SIMULATION_STARTED: withVersion("SimulationStarted"),
  SIMULATION_COMPLETED: withVersion("SimulationCompleted"),
} as const;

export const META_EVENT_PLACEMENTS = {
  HERO_PRIMARY_CTA: "hero_primary_cta",
  BOTTOM_STRONG_CTA: "bottom_strong_cta",
  HERO_SIMULACAO_CARD: "hero_simulacao_card",
  BENEFITS_MOBILE_CARD: "benefits_mobile_card",
  FLOATING_TOP_CTA: "floating_top_cta",
  NAVBAR_DESKTOP_WHATSAPP: "navbar_desktop_whatsapp",
  NAVBAR_MOBILE_WHATSAPP: "navbar_mobile_whatsapp",
  OFFER_DETAILS_WHATSAPP: "offer_details_whatsapp",
} as const;

export const META_EVENT_FLOWS = {
  SIMULACAO_CREDITO_CLT: "simulacao_credito_clt",
} as const;

export const META_EVENT_CHANNELS = {
  WHATSAPP: "whatsapp",
} as const;
