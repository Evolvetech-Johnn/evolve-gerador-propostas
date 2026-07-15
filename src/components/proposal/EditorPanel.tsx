import React, { useState } from "react";
import { Proposal, ThemeId, FontPairId, PayMode } from "../../lib/proposal";
import { useProposals } from "../../store/useProposals";
import { ChevronDown, ChevronRight, Plus, X, ArrowLeft, Save } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  proposal: Proposal;
}

const Group: React.FC<{ label: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  label,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 border-b border-gray-800 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left font-semibold"
      >
        <span>{label}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
};

export const EditorPanel: React.FC<Props> = ({ proposal }) => {
  const { update } = useProposals();
  const set = (patch: Partial<Proposal>) => update(proposal.id, patch);

  return (
    <div className="w-full lg:w-[380px] lg:sticky lg:top-0 h-screen overflow-y-auto paper p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={16} />
          Nova proposta
        </Link>
        <div className="flex items-center gap-1 text-xs text-green-400">
          <Save size={12} />
          Auto-salvo
        </div>
      </div>

      <Group label="A · Sua marca" defaultOpen>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Nome da empresa</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.company}
            onChange={(e) => set({ company: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Logo (opcional)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => set({ logoDataUrl: e.target?.result as string });
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Cor de destaque</label>
          <input
            type="color"
            className="w-full h-10 bg-transparent border-0 p-0"
            value={proposal.accent}
            onChange={(e) => set({ accent: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Tema</label>
          <div className="grid grid-cols-2 gap-2">
            {(["dark-gold", "dark-indigo", "light-editorial", "minimal-mono"] as ThemeId[]).map((t) => (
              <button
                key={t}
                onClick={() => set({ theme: t })}
                className={`p-3 rounded text-left text-sm border ${
                  proposal.theme === t ? "border-white" : "border-gray-700"
                }`}
              >
                {t === "dark-gold" && "Escuro · Dourado"}
                {t === "dark-indigo" && "Escuro · Índigo"}
                {t === "light-editorial" && "Claro · Editorial"}
                {t === "minimal-mono" && "Minimal · Mono"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Fonte</label>
          <div className="grid grid-cols-2 gap-2">
            {(["modern", "editorial", "classic", "tech", "minimal", "serif-bold"] as FontPairId[]).map((f) => (
              <button
                key={f}
                onClick={() => set({ fontPair: f })}
                className={`p-2 rounded text-left text-xs border ${
                  proposal.fontPair === f ? "border-white" : "border-gray-700"
                }`}
              >
                {f === "modern" && "Modern"}
                {f === "editorial" && "Editorial"}
                {f === "classic" && "Classic"}
                {f === "tech" && "Tech"}
                {f === "minimal" && "Minimal"}
                {f === "serif-bold" && "Serif Bold"}
              </button>
            ))}
          </div>
        </div>
      </Group>

      <Group label="B · Cliente">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Nome do cliente</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.clientName}
            onChange={(e) => set({ clientName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Empresa do cliente</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.clientCompany}
            onChange={(e) => set({ clientCompany: e.target.value })}
          />
        </div>
      </Group>

      <Group label="C · Proposta">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Oferta</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.offer}
            onChange={(e) => set({ offer: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Data</label>
            <input
              type="date"
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              value={proposal.proposalDate}
              onChange={(e) => set({ proposalDate: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Validade (dias)</label>
            <input
              type="number"
              min="1"
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              value={proposal.validityDays}
              onChange={(e) => set({ validityDays: parseInt(e.target.value || "0") })}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Quem está propondo</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.consultant}
            onChange={(e) => set({ consultant: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Cargo</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.consultantRole}
            onChange={(e) => set({ consultantRole: e.target.value })}
          />
        </div>
      </Group>

      <Group label="D · Seções do documento">
        {proposal.sections.map((section, i) => (
          <div key={section.id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={(e) => {
                const newSections = [...proposal.sections];
                newSections[i] = { ...section, enabled: e.target.checked };
                set({ sections: newSections });
              }}
              className="accent-white"
            />
            <div className="flex-1 text-sm">
              {section.id === "diagnostico" && "Diagnóstico"}
              {section.id === "metodo" && "Método"}
              {section.id === "valuestack" && "O que você recebe"}
              {section.id === "prova" && "Prova"}
              {section.id === "investimento" && "Investimento"}
              {section.id === "fechamento" && "Fechamento"}
            </div>
            <button
              onClick={() => {
                if (i > 0) {
                  const newSections = [...proposal.sections];
                  [newSections[i - 1], newSections[i]] = [newSections[i], newSections[i - 1]];
                  set({ sections: newSections });
                }
              }}
              disabled={i === 0}
              className="text-gray-500 hover:text-white disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={() => {
                if (i < proposal.sections.length - 1) {
                  const newSections = [...proposal.sections];
                  [newSections[i + 1], newSections[i]] = [newSections[i], newSections[i + 1]];
                  set({ sections: newSections });
                }
              }}
              disabled={i === proposal.sections.length - 1}
              className="text-gray-500 hover:text-white disabled:opacity-30"
            >
              ↓
            </button>
          </div>
        ))}
      </Group>

      <Group label="Capa">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Texto pequeno (eyebrow)</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.coverEyebrow}
            onChange={(e) => set({ coverEyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Título principal</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            rows={3}
            value={proposal.coverHeadline}
            onChange={(e) => set({ coverHeadline: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Subtítulo</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.coverSubtitle}
            onChange={(e) => set({ coverSubtitle: e.target.value })}
          />
        </div>
      </Group>

      <Group label="Diagnóstico">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Texto do diagnóstico</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            rows={4}
            value={proposal.diagnosisText}
            onChange={(e) => set({ diagnosisText: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            Custo mensal do problema (0 para desativar a seção de valores)
          </label>
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.monthlyPainCost}
            onChange={(e) => set({ monthlyPainCost: parseFloat(e.target.value || "0") })}
          />
        </div>
      </Group>

      <Group label="O Método">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Nome do método</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.methodName}
            onChange={(e) => set({ methodName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Texto do método</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            rows={3}
            value={proposal.methodIntro}
            onChange={(e) => set({ methodIntro: e.target.value })}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-400">Passos do método</label>
            <button
              onClick={() => set({ methodSteps: [...proposal.methodSteps, { id: crypto.randomUUID(), title: "" }] })}
              className="text-xs text-green-400 flex items-center gap-1"
            >
              <Plus size={12} /> Adicionar
            </button>
          </div>
          {proposal.methodSteps.map((step, i) => (
            <div key={step.id} className="flex gap-2 mb-2">
              <input
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                value={step.title}
                onChange={(e) => {
                  const newSteps = [...proposal.methodSteps];
                  newSteps[i] = { ...step, title: e.target.value };
                  set({ methodSteps: newSteps });
                }}
              />
              <button
                onClick={() => {
                  const newSteps = proposal.methodSteps.filter((_, idx) => idx !== i);
                  set({ methodSteps: newSteps });
                }}
                className="text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-400">Milestones</label>
            <button
              onClick={() => set({ milestones: [...proposal.milestones, { id: crypto.randomUUID(), title: "" }] })}
              className="text-xs text-green-400 flex items-center gap-1"
            >
              <Plus size={12} /> Adicionar
            </button>
          </div>
          {proposal.milestones.map((m, i) => (
            <div key={m.id} className="flex gap-2 mb-2">
              <input
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                value={m.title}
                onChange={(e) => {
                  const newMs = [...proposal.milestones];
                  newMs[i] = { ...m, title: e.target.value };
                  set({ milestones: newMs });
                }}
              />
              <button
                onClick={() => {
                  const newMs = proposal.milestones.filter((_, idx) => idx !== i);
                  set({ milestones: newMs });
                }}
                className="text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Value Stack">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-gray-400">Itens</label>
          <button
            onClick={() =>
              set({
                deliverables: [
                  ...proposal.deliverables,
                  { id: crypto.randomUUID(), title: "", desc: "", value: 0, bonus: false },
                ],
              })
            }
            className="text-xs text-green-400 flex items-center gap-1"
          >
            <Plus size={12} /> Adicionar
          </button>
        </div>
        {proposal.deliverables.map((d, i) => (
          <div key={d.id} className="p-3 bg-gray-900 border border-gray-700 rounded mb-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-gray-400">Item {i + 1}</label>
              <button
                onClick={() => {
                  const newDeliverables = proposal.deliverables.filter((_, idx) => idx !== i);
                  set({ deliverables: newDeliverables });
                }}
                className="text-red-400 text-xs"
              >
                <X size={14} />
              </button>
            </div>
            <input
              placeholder="Título"
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm mb-2"
              value={d.title}
              onChange={(e) => {
                const newDeliverables = [...proposal.deliverables];
                newDeliverables[i] = { ...d, title: e.target.value };
                set({ deliverables: newDeliverables });
              }}
            />
            <input
              placeholder="Descrição"
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm mb-2"
              value={d.desc}
              onChange={(e) => {
                const newDeliverables = [...proposal.deliverables];
                newDeliverables[i] = { ...d, desc: e.target.value };
                set({ deliverables: newDeliverables });
              }}
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Valor"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                value={d.value}
                onChange={(e) => {
                  const newDeliverables = [...proposal.deliverables];
                  newDeliverables[i] = { ...d, value: parseFloat(e.target.value || "0") };
                  set({ deliverables: newDeliverables });
                }}
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={!!d.bonus}
                  onChange={(e) => {
                    const newDeliverables = [...proposal.deliverables];
                    newDeliverables[i] = { ...d, bonus: e.target.checked };
                    set({ deliverables: newDeliverables });
                  }}
                  className="accent-white"
                />
                Bônus
              </label>
            </div>
          </div>
        ))}
      </Group>

      <Group label="Prova e autoridade">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Bio</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            rows={2}
            value={proposal.bioText}
            onChange={(e) => set({ bioText: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Credenciais</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.bioCredentials}
            onChange={(e) => set({ bioCredentials: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Métricas (separadas por " · ")</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.metricsLine}
            onChange={(e) => set({ metricsLine: e.target.value })}
          />
        </div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-gray-400">Depoimentos</label>
          <button
            onClick={() =>
              set({
                testimonials: [
                  ...proposal.testimonials,
                  { id: crypto.randomUUID(), name: "", company: "", result: "", text: "" },
                ],
              })
            }
            className="text-xs text-green-400 flex items-center gap-1"
          >
            <Plus size={12} /> Adicionar
          </button>
        </div>
        {proposal.testimonials.map((t, i) => (
          <div key={t.id} className="p-3 bg-gray-900 border border-gray-700 rounded mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Depoimento {i + 1}</span>
              <button
                onClick={() => {
                  const newTs = proposal.testimonials.filter((_, idx) => idx !== i);
                  set({ testimonials: newTs });
                }}
                className="text-red-400 text-xs"
              >
                <X size={14} />
              </button>
            </div>
            <input
              placeholder="Nome"
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm mb-1"
              value={t.name}
              onChange={(e) => {
                const newTs = [...proposal.testimonials];
                newTs[i] = { ...t, name: e.target.value };
                set({ testimonials: newTs });
              }}
            />
            <input
              placeholder="Empresa"
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm mb-1"
              value={t.company}
              onChange={(e) => {
                const newTs = [...proposal.testimonials];
                newTs[i] = { ...t, company: e.target.value };
                set({ testimonials: newTs });
              }}
            />
            <input
              placeholder="Resultado (ex: 3x em 90 dias)"
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm mb-1"
              value={t.result}
              onChange={(e) => {
                const newTs = [...proposal.testimonials];
                newTs[i] = { ...t, result: e.target.value };
                set({ testimonials: newTs });
              }}
            />
            <textarea
              placeholder="Texto do depoimento"
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
              rows={2}
              value={t.text}
              onChange={(e) => {
                const newTs = [...proposal.testimonials];
                newTs[i] = { ...t, text: e.target.value };
                set({ testimonials: newTs });
              }}
            />
          </div>
        ))}
      </Group>

      <Group label="Investimento">
        {/* Seletor de modo de pagamento */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Forma de pagamento</label>
          <div className="flex flex-wrap gap-2">
            {(["mensal", "cartao", "pix", "boleto"] as PayMode[]).map((pm) => (
              <button
                key={pm}
                onClick={() => set({ payMode: pm })}
                className={`px-3 py-1 rounded text-sm border ${
                  proposal.payMode === pm ? "border-white bg-gray-800" : "border-gray-700"
                }`}
              >
                {pm === "mensal" && "Mensal"}
                {pm === "cartao" && "Cartão"}
                {pm === "pix" && "Pix"}
                {pm === "boleto" && "Boleto"}
              </button>
            ))}
          </div>
        </div>

        {/* Campos específicos por modo */}
        {proposal.payMode === "mensal" && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Valor mensal (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              value={proposal.monthlyValue}
              onChange={(e) => set({ monthlyValue: parseFloat(e.target.value || "0") })}
            />
            <div className="text-xs text-gray-500 mt-1">
              Dica: soma automática dos serviços não-bônus ={" "}
              {proposal.deliverables
                .filter((d) => !d.bonus)
                .reduce((s, d) => s + d.value, 0)
                .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
        )}

        {proposal.payMode === "cartao" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Número de parcelas</label>
              <input
                type="number"
                min="1"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                value={proposal.cardCount}
                onChange={(e) => set({ cardCount: parseInt(e.target.value || "0") })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Valor da parcela</label>
              <input
                type="number"
                min="0"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                value={proposal.cardInstallment}
                onChange={(e) => set({ cardInstallment: parseFloat(e.target.value || "0") })}
              />
            </div>
          </div>
        )}

        {proposal.payMode === "pix" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Valor total</label>
              <input
                type="number"
                min="0"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                value={proposal.pixValue}
                onChange={(e) => set({ pixValue: parseFloat(e.target.value || "0") })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Desconto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                value={proposal.pixDiscount}
                onChange={(e) => set({ pixDiscount: parseFloat(e.target.value || "0") })}
              />
            </div>
          </div>
        )}

        {proposal.payMode === "boleto" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Número de parcelas</label>
              <input
                type="number"
                min="1"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                value={proposal.boletoCount}
                onChange={(e) => set({ boletoCount: parseInt(e.target.value || "0") })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Valor da parcela</label>
              <input
                type="number"
                min="0"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                value={proposal.boletoInstallment}
                onChange={(e) => set({ boletoInstallment: parseFloat(e.target.value || "0") })}
              />
            </div>
          </div>
        )}

        {/* Campo "De" — controla exibição do valor percebido (value stack total) */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="show-from-price"
            checked={proposal.showFromPrice}
            onChange={(e) => set({ showFromPrice: e.target.checked })}
            className="accent-white"
          />
          <label htmlFor="show-from-price" className="text-sm">
            Exibir campo "De" (valor percebido total)
          </label>
        </div>
        <div className="text-xs text-gray-500 ml-5">
          Exibe o total do value stack riscado acima do preço.
        </div>

        {/* Garantia */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            id="guarantee-enabled"
            checked={proposal.guaranteeEnabled}
            onChange={(e) => set({ guaranteeEnabled: e.target.checked })}
            className="accent-white"
          />
          <label htmlFor="guarantee-enabled" className="text-sm">Usar garantia</label>
        </div>
        {proposal.guaranteeEnabled && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Texto da garantia</label>
            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              rows={2}
              value={proposal.guaranteeText}
              onChange={(e) => set({ guaranteeText: e.target.value })}
            />
            <div className="text-xs text-gray-500 mt-1">
              Deixe vazio para ocultar a seção de garantia na proposta.
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Motivo de urgência</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.urgencyReason}
            onChange={(e) => set({ urgencyReason: e.target.value })}
          />
        </div>
      </Group>

      <Group label="Fechamento">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Mensagem de fechamento</label>
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            rows={3}
            value={proposal.closingMessage}
            onChange={(e) => set({ closingMessage: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">CTA</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            value={proposal.ctaText}
            onChange={(e) => set({ ctaText: e.target.value })}
          />
        </div>
      </Group>
    </div>
  );
};
