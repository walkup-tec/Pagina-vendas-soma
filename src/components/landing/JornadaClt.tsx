import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { WHATSAPP_URL } from "@/config/whatsapp";
import { supabase } from "@/lib/supabase";
import { trackMetaCustomEvent, trackMetaEvent, trackWhatsappCtaClick } from "@/lib/metaPixel";
import { META_CUSTOM_EVENTS, META_EVENT_FLOWS, META_EVENT_PLACEMENTS } from "@/lib/metaPixelEvents";

// Utilities de máscaras/normalização (mantidas consistentes com o modal existente)
const unmask = (v: string) => v.replace(/\D/g, "");

const maskCPF = (v: string) => {
  const d = unmask(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const maskData = (v: string) => {
  const d = unmask(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

const maskPhone = (v: string) => {
  const d = unmask(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const normalizePhoneToWhatsApp = (v: string): string => {
  const digits = unmask(v);
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
};

const safeUUID = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};

type BlockReason = "clt" | "tres_meses" | null;

interface JornadaCltProps {
  onExit: () => void;
}

const JornadaClt = ({ onExit }: JornadaCltProps) => {
  const [step, setStep] = useState<number>(0);
  const [blockedReason, setBlockedReason] = useState<BlockReason>(null);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [cpf, setCpf] = useState("");
  const leadRef = useRef<string>(safeUUID());
  const nomeCompletoInputRef = useRef<HTMLInputElement | null>(null);
  const whatsappInputRef = useRef<HTMLInputElement | null>(null);
  const dataNascimentoInputRef = useRef<HTMLInputElement | null>(null);
  const nomeMaeInputRef = useRef<HTMLInputElement | null>(null);
  const cpfInputRef = useRef<HTMLInputElement | null>(null);
  const nomeCompletoTimerRef = useRef<number | null>(null);
  const nomeMaeTimerRef = useRef<number | null>(null);
  const scheduledFocusStepRef = useRef<number | null>(null);

  const scheduleFocusForStep = useCallback((targetStep: number) => {
    scheduledFocusStepRef.current = targetStep;
  }, []);

  const goToStepAndFocus = useCallback(
    (targetStep: number) => {
      const focusMap: Record<number, React.RefObject<HTMLInputElement | null>> = {
        2: nomeCompletoInputRef,
        3: whatsappInputRef,
        4: dataNascimentoInputRef,
        5: nomeMaeInputRef,
        6: cpfInputRef,
      };
      scheduleFocusForStep(targetStep);
      flushSync(() => {
        setStep(targetStep);
      });
      const targetRef = focusMap[targetStep]?.current;
      if (!targetRef) return;
      targetRef.focus();
      targetRef.setSelectionRange(targetRef.value.length, targetRef.value.length);
    },
    [scheduleFocusForStep]
  );

  const saveLead = useCallback(
    async (overrides: Record<string, unknown> = {}) => {
      if (!supabase) return;
      const row = {
        lead_ref: leadRef.current,
        nome_completo: nomeCompleto.trim() || null,
        cpf: cpf ? unmask(cpf) : null,
        data_nascimento: dataNascimento || null,
        whatsapp: whatsapp ? normalizePhoneToWhatsApp(whatsapp) : null,
        carteira_assinada: null,
        tres_meses: null,
        optin: "NAO",
        finalizado: "NAO",
        vendeai: null,
        updated_at: new Date().toISOString(),
        ...overrides,
      };
      const { error } = await supabase
        .from("leads_emprestimo_clt")
        .upsert(row, { onConflict: "lead_ref" });
      if (error) console.error("[Leads] Erro ao salvar jornada:", error.message);
    },
    [cpf, dataNascimento, nomeCompleto, whatsapp]
  );

  const handleCarteiraAssinada = useCallback((sim: boolean) => {
    if (sim) {
      void saveLead({ carteira_assinada: "SIM" });
      setStep(1);
      return;
    }
    void saveLead({ carteira_assinada: "NAO", finalizado: "NAO" });
    setBlockedReason("clt");
  }, [saveLead]);

  const handleCarteira90Dias = useCallback((sim: boolean) => {
    if (sim) {
      void saveLead({ tres_meses: "SIM" });
      goToStepAndFocus(2);
      return;
    }
    void saveLead({ tres_meses: "NAO", finalizado: "NAO" });
    setBlockedReason("tres_meses");
  }, [goToStepAndFocus, saveLead]);

  const canContinue = useMemo(() => {
    if (blockedReason) return false;
    if (step === 2) return nomeCompleto.trim().length >= 3;
    if (step === 3) return unmask(whatsapp).length === 11;
    if (step === 4) return unmask(dataNascimento).length === 8;
    if (step === 5) return nomeMae.trim().length >= 3;
    if (step === 6) return unmask(cpf).length === 11;
    return false;
  }, [blockedReason, step, nomeCompleto, whatsapp, dataNascimento, nomeMae, cpf]);

  const tryGoNext = useCallback(() => {
    if (!canContinue) return;
    if (step === 2 || step === 5) void saveLead();
    setStep((s) => s + 1);
  }, [canContinue, saveLead, step]);

  useEffect(() => {
    if (step !== 2) return;
    if (nomeCompletoTimerRef.current) {
      window.clearTimeout(nomeCompletoTimerRef.current);
      nomeCompletoTimerRef.current = null;
    }
    if (!nomeCompleto.trim()) return;
    nomeCompletoTimerRef.current = window.setTimeout(() => {
      void saveLead();
      scheduleFocusForStep(3);
      setStep((s) => (s === 2 ? 3 : s));
    }, 3000);

    return () => {
      if (nomeCompletoTimerRef.current) {
        window.clearTimeout(nomeCompletoTimerRef.current);
        nomeCompletoTimerRef.current = null;
      }
    };
  }, [step, nomeCompleto, saveLead, scheduleFocusForStep]);

  useEffect(() => {
    if (step !== 5) return;
    if (nomeMaeTimerRef.current) {
      window.clearTimeout(nomeMaeTimerRef.current);
      nomeMaeTimerRef.current = null;
    }
    if (!nomeMae.trim()) return;
    nomeMaeTimerRef.current = window.setTimeout(() => {
      void saveLead();
      setStep((s) => (s === 5 ? 6 : s));
    }, 3000);

    return () => {
      if (nomeMaeTimerRef.current) {
        window.clearTimeout(nomeMaeTimerRef.current);
        nomeMaeTimerRef.current = null;
      }
    };
  }, [step, nomeMae, saveLead]);

  useLayoutEffect(() => {
    const focusMap: Record<number, React.RefObject<HTMLInputElement | null>> = {
      2: nomeCompletoInputRef,
      3: whatsappInputRef,
      4: dataNascimentoInputRef,
      5: nomeMaeInputRef,
      6: cpfInputRef,
    };
    const ref = focusMap[step];
    if (!ref?.current) return;
    const shouldForce = scheduledFocusStepRef.current === step || step === 2 || step === 3;
    let raf1 = 0;
    let raf2 = 0;
    let intervalId = 0;
    let timeoutId = 0;
    const tryFocus = () => {
      ref.current?.focus();
      ref.current?.setSelectionRange(ref.current.value.length, ref.current.value.length);
    };
    raf1 = window.requestAnimationFrame(() => {
      tryFocus();
      raf2 = window.requestAnimationFrame(() => {
        tryFocus();
      });
    });
    if (shouldForce) {
      timeoutId = window.setTimeout(() => {
        let attempts = 0;
        intervalId = window.setInterval(() => {
          attempts += 1;
          tryFocus();
          if (document.activeElement === ref.current || attempts >= 10) {
            window.clearInterval(intervalId);
          }
        }, 120);
      }, 80);
    }
    scheduledFocusStepRef.current = null;
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [step]);

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Olá! Quero fazer uma simulação da minha proposta.",
      "",
      `3 - Informe seu nome completo: ${nomeCompleto.trim()}`,
      `4 - Informe seu whatsapp: ${whatsapp.trim()}`,
      `5 - Data de nascimento: ${dataNascimento.trim()}`,
      `6 - Nome da mãe: ${nomeMae.trim()}`,
      `7 - Informe seu CPF: ${cpf.trim()}`,
    ];
    return lines.join("\n");
  }, [cpf, dataNascimento, nomeCompleto, nomeMae, whatsapp]);

  const whatsappLink = useMemo(() => {
    const url = new URL(WHATSAPP_URL);
    url.searchParams.set("text", whatsappMessage);
    return url.toString();
  }, [whatsappMessage]);

  const handleWhatsappClick = useCallback(() => {
    void saveLead({ optin: "SIM", finalizado: "SIM" });
    trackWhatsappCtaClick(META_EVENT_PLACEMENTS.HERO_PRIMARY_CTA);
    trackMetaEvent("CompleteRegistration", {
      flow: META_EVENT_FLOWS.SIMULACAO_CREDITO_CLT,
      optin_whatsapp: true,
    });
    trackMetaCustomEvent(META_CUSTOM_EVENTS.SIMULATION_COMPLETED, {
      flow: META_EVENT_FLOWS.SIMULACAO_CREDITO_CLT,
      optin_whatsapp: true,
    });
  }, [saveLead]);

  const titleByStep: Record<number, string> = {
    0: "Você possui carteira assinada?",
    1: "A sua carteira está assinada a mais de 90 dias?",
    2: "Informe seu nome completo",
    3: "Informe seu whatsapp",
    4: "Data de aniversário",
    5: "Nome da mãe",
    6: "Informe seu CPF",
    7: "Parabéns!",
  };

  return (
    <div className="relative space-y-3 p-4 md:p-5">
      <div
        className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-secondary/10 via-transparent to-transparent pointer-events-none"
        aria-hidden
      />

      <h3
        className={`text-lg font-display font-semibold ${
          blockedReason ? "text-destructive" : ""
        }`}
      >
        {blockedReason ? "Ops! Você não atende aos requisitos" : titleByStep[step] ?? ""}
      </h3>

      {blockedReason ? (
          <div key="blocked" className="space-y-2 journey-step-enter">
            <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <i className="bi bi-x-circle text-3xl text-destructive shrink-0" aria-hidden />
              <p className="text-sm font-medium text-destructive">
                {blockedReason === "clt" &&
                  "Infelizmente esta modalidade de empréstimo é somente para trabalhadores CLT"}
                {blockedReason === "tres_meses" &&
                  "Infelizmente esta modalidade de empréstimo é somente para quem tem mais de 90 dias de carteira assinada"}
              </p>
            </div>
            <button
              type="button"
              onClick={onExit}
              className="w-full py-3 rounded-full bg-destructive text-destructive-foreground font-bold hover:opacity-90 transition-colors"
            >
              Entendi
            </button>
          </div>
        ) : (
          <div key={`step-${step}`} className="journey-step-enter">
            {step === 0 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleCarteiraAssinada(true)}
                  className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => handleCarteiraAssinada(false)}
                  className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Não
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleCarteira90Dias(true)}
                  className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => handleCarteira90Dias(false)}
                  className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Não
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Como consta nos documentos
                </p>
                <input
                  ref={nomeCompletoInputRef}
                  autoFocus={step === 2}
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  onBlur={tryGoNext}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (canContinue) {
                        void saveLead();
                        goToStepAndFocus(3);
                        return;
                      }
                      tryGoNext();
                    }
                  }}
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Usaremos seu WhatsApp para enviar a simulação
                </p>
                <input
                  ref={whatsappInputRef}
                  autoFocus={step === 3}
                  type="text"
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={(e) => {
                    const next = maskPhone(e.target.value);
                    setWhatsapp(next);
                    if (unmask(next).length === 11) {
                      void saveLead({ whatsapp: normalizePhoneToWhatsApp(next) });
                      setTimeout(() => setStep((s) => (s === 3 ? 4 : s)), 120);
                    }
                  }}
                  placeholder="(00) 00000-0000"
                  maxLength={16}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Informe sua data no formato DD/MM/AAAA
                </p>
                <input
                  ref={dataNascimentoInputRef}
                  autoFocus={step === 4}
                  type="text"
                  inputMode="numeric"
                  value={dataNascimento}
                  onChange={(e) => {
                    const next = maskData(e.target.value);
                    setDataNascimento(next);
                    if (unmask(next).length === 8) {
                      void saveLead({ data_nascimento: next });
                      setTimeout(() => setStep((s) => (s === 4 ? 5 : s)), 120);
                    }
                  }}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Para conferência cadastral
                </p>
                <input
                  ref={nomeMaeInputRef}
                  autoFocus={step === 5}
                  type="text"
                  value={nomeMae}
                  onChange={(e) => setNomeMae(e.target.value)}
                  onBlur={tryGoNext}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void saveLead();
                      tryGoNext();
                    }
                  }}
                  placeholder="Nome da mãe"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
                />
              </div>
            )}

            {step === 6 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Somente números (sem pontos ou traços)
                </p>
                <input
                  ref={cpfInputRef}
                  autoFocus={step === 6}
                  type="text"
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => {
                    const next = maskCPF(e.target.value);
                    setCpf(next);
                    if (unmask(next).length === 11) {
                      void saveLead({ cpf: unmask(next) });
                      setTimeout(() => setStep((s) => (s === 6 ? 7 : s)), 120);
                    }
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
                />
              </div>
            )}

            {step === 7 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Parabéns! Agora você pode chamar no WhatsApp para fazer a simulação da sua proposta.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsappClick}
                  className="block pt-4"
                >
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#22c55e] transition-colors floating-cta-wave-whatsapp"
                  >
                    Chamar no WhatsApp
                    <i className="bi bi-whatsapp text-base" />
                  </button>
                </a>
              </>
            )}
          </div>
        )}
    </div>
  );
};

export default JornadaClt;

