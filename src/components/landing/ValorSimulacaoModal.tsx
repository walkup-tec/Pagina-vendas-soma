import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { trackMetaCustomEvent, trackMetaEvent } from "@/lib/metaPixel";
import { META_CUSTOM_EVENTS, META_EVENT_FLOWS } from "@/lib/metaPixelEvents";

/* Máscaras e normalização */
const unmask = (v: string) => v.replace(/\D/g, "");

const formatCurrency = (value: string): string => {
  let numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";
  numbers = numbers.replace(/^0+/, "") || "0";
  const cents = numbers.slice(-2).padStart(2, "0");
  const integers = numbers.slice(0, -2) || "0";
  const formatted = integers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted},${cents}`;
};

const maskCPF = (v: string) => {
  const d = unmask(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const maskDataNascimento = (v: string) => {
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

/** UUID compatível com HTTP (crypto.randomUUID falha em contextos não seguros) */
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

type AvisoType = "clt" | "tres_meses" | null;

interface ValorSimulacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ValorSimulacaoModal = ({ isOpen, onClose }: ValorSimulacaoModalProps) => {
  const leadRef = useRef<string | null>(null);
  const [step, setStep] = useState(0);
  const [valor, setValor] = useState("");
  const [displayValor, setDisplayValor] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aviso, setAviso] = useState<AvisoType>(null);

  const buildLeadRow = useCallback(
    (overrides: Record<string, unknown> = {}) => {
      const ref = leadRef.current;
      if (!ref) return null;
      return {
        lead_ref: ref,
        valor: valor ? formatCurrency(valor) : null,
        nome_completo: nome.trim() || null,
        cpf: cpf ? unmask(cpf) : null,
        rg: rg.trim() || null,
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
    },
    [valor, nome, cpf, rg, dataNascimento, whatsapp]
  );

  const saveLead = useCallback(
    async (overrides: Record<string, unknown> = {}) => {
      const row = buildLeadRow(overrides);
      if (!row) return;
      if (!supabase) {
        const msg = "Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env e reinicie o servidor.";
        console.warn("[Leads]", msg);
        alert(msg);
        return;
      }
      const { data, error } = await supabase
        .from("leads_emprestimo_clt")
        .upsert(row, { onConflict: "lead_ref" })
        .select();
      if (error) {
        console.error("[Leads] Erro Supabase:", error);
        alert(`Erro ao salvar: ${error.message}`);
        return;
      }
      console.log("[Leads] Salvo com sucesso", data?.[0]?.lead_ref);
    },
    [buildLeadRow]
  );

  const handleValorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 10) return;
    setValor(raw);
    setDisplayValor(formatCurrency(raw));
  }, []);

  const handleCpfChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(maskCPF(e.target.value));
  }, []);

  const handleDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDataNascimento(maskDataNascimento(e.target.value));
  }, []);

  const handleWhatsappChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(maskPhone(e.target.value));
  }, []);

  useEffect(() => {
    if (isOpen) {
      leadRef.current = safeUUID();
    } else {
      leadRef.current = null;
      setStep(0);
      setValor("");
      setDisplayValor("");
      setNome("");
      setCpf("");
      setRg("");
      setDataNascimento("");
      setWhatsapp("");
      setAviso(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const canContinue = () => {
    if (step === 0) return valor.length >= 3;
    if (step === 1) return nome.trim().length >= 3;
    if (step === 2) return unmask(cpf).length === 11;
    if (step === 3) return rg.trim().length >= 2;
    if (step === 4) return unmask(dataNascimento).length === 8;
    if (step === 5) return unmask(whatsapp).length >= 10;
    return false;
  };

  const handleContinue = async () => {
    await saveLead();
    if (step < 6) setStep((s) => s + 1);
  };

  const handleCarteiraResposta = async (sim: boolean) => {
    if (sim) {
      await saveLead({ carteira_assinada: "SIM" });
      setStep(7);
    } else setAviso("clt");
  };

  const handleTresMesesResposta = async (sim: boolean) => {
    if (sim) {
      await saveLead({ tres_meses: "SIM" });
      setStep(8);
    } else setAviso("tres_meses");
  };

  const handleAutorizaWhatsapp = async (sim: boolean) => {
    if (sim) {
      await saveLead({ optin: "SIM", finalizado: "SIM" });
      trackMetaEvent("CompleteRegistration", {
        flow: META_EVENT_FLOWS.SIMULACAO_CREDITO_CLT,
        optin_whatsapp: true,
      });
      trackMetaCustomEvent(META_CUSTOM_EVENTS.SIMULATION_COMPLETED, {
        flow: META_EVENT_FLOWS.SIMULACAO_CREDITO_CLT,
        optin_whatsapp: true,
      });
      onClose();
    }
  };

  const renderModal = (content: React.ReactNode) =>
    createPortal(
      <AnimatePresence>
        {isOpen && content}
      </AnimatePresence>,
      document.body
    );

  if (aviso === "clt") {
    return renderModal(
      <motion.div
        key="aviso-clt"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-foreground text-center">
            Infelizmente é necessário ter vínculo CLT para simular uma proposta
          </p>
          <button type="button" onClick={onClose} className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90">
            Entendi
          </button>
        </motion.div>
      </motion.div>
    );
  }
  if (aviso === "tres_meses") {
    return renderModal(
      <motion.div
        key="aviso-tres-meses"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-foreground text-center">
            Infelizmente é necessário ter 3 meses de vínculo CLT para simular uma proposta
          </p>
          <button type="button" onClick={onClose} className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90">
            Entendi
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const stepTitles: Record<number, string> = {
    0: "De quanto você precisa?",
    1: "Qual o seu nome completo?",
    2: "Informe seu CPF",
    3: "Informe seu RG",
    4: "Informe sua data de nascimento",
    5: "Informe seu WhatsApp",
    6: "Você possui carteira de trabalho assinada?",
    7: "Possui mais de 3 meses de carteira assinada?",
    8: "Parabéns!",
  };

  const progressSteps = 9;

  return renderModal(
    <motion.div
      key="modal-simulacao"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1 mb-4">
          {Array.from({ length: progressSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-muted"}`} />
          ))}
        </div>
        <h3 className="text-lg font-display font-semibold">{stepTitles[step]}</h3>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
        {step === 0 && (
          <>
            <p className="text-sm text-muted-foreground">Informe o valor desejado para simular seu crédito</p>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={displayValor}
                onChange={handleValorChange}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-input text-foreground font-semibold text-lg focus:outline-none focus:border-2 focus:border-primary"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-sm text-muted-foreground">Nome completo como consta nos documentos</p>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
            />
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground">CPF será utilizado para consulta de crédito</p>
            <input
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
            />
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-muted-foreground">RG (número e órgão expedidor)</p>
            <input
              type="text"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              placeholder="Ex: 1234567"
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
            />
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-muted-foreground">Data de nascimento</p>
            <input
              type="text"
              inputMode="numeric"
              value={dataNascimento}
              onChange={handleDataChange}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
            />
          </>
        )}

        {step === 5 && (
          <>
            <p className="text-sm text-muted-foreground">Receberemos sua simulação por WhatsApp</p>
            <input
              type="text"
              inputMode="numeric"
              value={whatsapp}
              onChange={handleWhatsappChange}
              placeholder="(00) 00000-0000"
              maxLength={16}
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground font-medium focus:outline-none focus:border-2 focus:border-primary"
            />
          </>
        )}

        {step === 6 && (
          <div className="flex gap-3">
            <button type="button" onClick={() => handleCarteiraResposta(true)} className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Sim
            </button>
            <button type="button" onClick={() => handleCarteiraResposta(false)} className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Não
            </button>
          </div>
        )}

        {step === 7 && (
          <div className="flex gap-3">
            <button type="button" onClick={() => handleTresMesesResposta(true)} className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Sim
            </button>
            <button type="button" onClick={() => handleTresMesesResposta(false)} className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Não
            </button>
          </div>
        )}

        {step === 8 && (
          <>
            <p className="text-foreground">
              Parabéns, você já está pré-aprovado! Agora um de nossos consultores entrará em contato via WhatsApp para finalizar sua proposta.
            </p>
            <div className="rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 p-4 flex items-center gap-3">
              <i className="bi bi-whatsapp text-3xl text-[#25D366] shrink-0" aria-hidden />
              <p className="text-base font-semibold text-foreground">
                Você autoriza contato via WhatsApp?
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => handleAutorizaWhatsapp(true)} className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Sim
              </button>
              <button type="button" onClick={() => handleAutorizaWhatsapp(false)} className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Não
              </button>
            </div>
          </>
        )}

        {step < 6 && (
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue()}
            className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ValorSimulacaoModal;
