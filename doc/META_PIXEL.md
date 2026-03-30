# Meta Pixel - SOMA Crédito Sales

## Conjunto de dados

- **ID:** `1606859223900261`
- **Token:** Não utilizado no front-end (segurança). Apenas o ID é necessário para o Pixel Web.

## Eventos padrão (Standard Events)

| Evento | Momento | Parâmetros |
|--------|---------|------------|
| `PageView` | Carregamento da página | — |
| `Lead` | Abertura da simulação (qualquer CTA) | `source` |
| `Contact` | Clique em qualquer CTA WhatsApp (wa.me) | `channel: whatsapp`, `placement` |
| `CompleteRegistration` | Finalização da simulação com opt-in WhatsApp | `flow`, `optin_whatsapp` |

## Eventos customizados (Custom Conversions)

| Evento | Momento |
|--------|---------|
| `WhatsAppCtaClicked_v1` | Clique em qualquer CTA de WhatsApp |
| `SimulationStarted_v1` | Início do fluxo de simulação |
| `SimulationCompleted_v1` | Simulação finalizada com autorização de contato |

### Placements (atributo `source` / `placement`)

- `hero_primary_cta` — CTA principal no Hero
- `bottom_strong_cta` — CTA forte no final da página
- `hero_simulacao_card` — Card de simulação no Hero (desktop)
- `benefits_mobile_card` — Card de simulação na seção Benefícios (mobile)
- `floating_top_cta` — Botão flutuante "CONTRATE AGORA" (abre simulação, não WhatsApp)
- `navbar_desktop_whatsapp` — Link WhatsApp na barra (desktop)
- `navbar_mobile_whatsapp` — Link WhatsApp no menu mobile
- `offer_details_whatsapp` — Card "Contrate agora!" na seção Oferta

Helper único no código: `trackWhatsappCtaClick(placement)` em `metaPixel.ts` dispara `Contact` + `WhatsAppCtaClicked_v1`.

## Versionamento

Os eventos customizados usam sufixo `_v1`. Em mudanças de estrutura ou nomenclatura:

1. Incrementar em `src/lib/metaPixelEvents.ts`: `META_CUSTOM_EVENT_VERSION = "v2"`
2. Manter `v1` ativo por período de transição, se necessário para comparação
3. Documentar alterações neste arquivo

## Arquivos relevantes

- `index.html` — Script e noscript do Pixel (init + PageView)
- `src/lib/metaPixel.ts` — Funções `trackMetaEvent` e `trackMetaCustomEvent`
- `src/lib/metaPixelEvents.ts` — Dicionário de constantes (eventos, placements, versionamento)
