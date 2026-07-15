import React, { useState } from "react";
import { compressImageToDataUrl } from "../../lib/image";
import { fromTemplate, templates } from "../../lib/proposal";
import { useProposals } from "../../store/useProposals";
import { useNavigate } from "@tanstack/react-router";
import {
  TrendingUp,
  Target,
  Scale,
  Stethoscope,
  Code2,
  Rocket,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Target,
  Scale,
  Stethoscope,
  Code2,
  Rocket,
};

export const Wizard: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [accent, setAccent] = useState("#d9a94a");
  const [logo, setLogo] = useState<string | undefined>();
  const [consultantName, setConsultantName] = useState("");
  const [consultantRole, setConsultantRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { create } = useProposals();
  const navigate = useNavigate();

  const handleStartFromScratch = async () => {
    try {
      setIsSaving(true);
      setErrorMsg(null);
      const { id, createdAt, updatedAt, ...proposalData } = fromTemplate("consultoria");
      const newId = create(proposalData);
      navigate({ to: "/editor/$id", params: { id: newId } });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Não foi possível salvar a proposta. O armazenamento local pode estar cheio — tente remover propostas antigas e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = async () => {
    try {
      setIsSaving(true);
      setErrorMsg(null);
      const template = selectedTemplate ?? "agencia";
      const overrides: Record<string, string | undefined> = {
        accent,
        logoDataUrl: logo,
      };
      if (companyName.trim()) overrides.company = companyName.trim();
      if (consultantName.trim()) overrides.consultant = consultantName.trim();
      if (consultantRole.trim()) overrides.consultantRole = consultantRole.trim();

      const { id, createdAt, updatedAt, ...proposalData } = fromTemplate(
        template,
        overrides as Parameters<typeof fromTemplate>[1]
      );
      const newId = create(proposalData);
      navigate({ to: "/editor/$id", params: { id: newId } });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Não foi possível salvar a proposta. O armazenamento local pode estar cheio — tente remover propostas antigas e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#12141a] w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Criar nova proposta</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (step === 3) handleFinish();
          else if (step < 3) setStep(step + 1);
        }}>
          {errorMsg && (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-4 mx-6 mt-4 text-sm rounded">
              {errorMsg}
            </div>
          )}
          <div className="p-6">
            {step === 1 && (
              <div>
                <div className="text-sm text-gray-400 mb-4">Passo 1 de 3 · Escolha o seu segmento</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(templates).map(([key, t]) => {
                    const Icon = iconMap[t.icon];
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedTemplate(key as keyof typeof templates)}
                        className={`p-4 rounded-xl border text-left transition ${
                          selectedTemplate === key
                            ? "border-white bg-gray-800"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gray-800 rounded-lg">
                            <Icon size={20} style={{ color: selectedTemplate === key ? "#d9a94a" : "#9ca3af" }} />
                          </div>
                          <div className="font-semibold">{t.label}</div>
                        </div>
                        <div className="text-xs text-gray-400">{t.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <div className="text-sm text-gray-400 mb-4">Passo 2 de 3 · Sua marca</div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Nome da empresa</label>
                    <input
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Sua empresa"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Logo (opcional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressImageToDataUrl(file);
                            setLogo(compressed);
                          } catch (err) {
                            console.error(err);
                            setErrorMsg("Não foi possível carregar a imagem. Tente uma imagem diferente.");
                          }
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Cor de destaque</label>
                    <input
                      type="color"
                      className="w-full h-10 bg-transparent border-0 p-0"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <div className="text-sm text-gray-400 mb-4">Passo 3 de 3 · Quem está propondo?</div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Seu nome</label>
                    <input
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                      value={consultantName}
                      onChange={(e) => setConsultantName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Seu cargo</label>
                    <input
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                      value={consultantRole}
                      onChange={(e) => setConsultantRole(e.target.value)}
                      placeholder="Seu cargo"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between p-6 border-t border-gray-800">
            <button
              type="button"
              onClick={handleStartFromScratch}
              disabled={isSaving}
              className="text-sm text-gray-400 hover:text-white underline disabled:opacity-50"
            >
              Prefiro começar do zero
            </button>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Voltar
                </button>
              )}
              {step < 3 ? (
                <button
                  type="submit"
                  disabled={(step === 1 && !selectedTemplate) || isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold disabled:opacity-30"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold disabled:opacity-50"
                >
                  {isSaving ? "Criando..." : "Criar proposta"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
