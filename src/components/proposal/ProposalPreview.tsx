import React from "react";
import {
  Proposal,
  fmtBRL,
  fmtDateLong,
  addDaysIso,
  valueStackSum,
  realPrice,
  pricePerDay,
  SectionId,
} from "../../lib/proposal";
import { ShieldCheck } from "lucide-react";

interface Props {
  proposal: Proposal;
}

const SectionHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold" style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>
        SEÇÃO {number}
      </span>
      <div className="h-px flex-1" style={{ background: "var(--border-soft)" }}></div>
    </div>
    <h2 className="mt-2 text-4xl font-bold wordmark">{title}</h2>
  </div>
);

export const ProposalPreview: React.FC<Props> = ({ proposal }) => {
  const enabledSections = proposal.sections.filter((s) => s.enabled).map((s) => s.id);

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case "diagnostico":
        return (
          <div className="a4-page">
            <SectionHeader number="01" title="Diagnóstico" />
            <p className="text-lg leading-relaxed" style={{ color: "var(--ink-dim)" }}>
              {proposal.diagnosisText}
            </p>
            {proposal.monthlyPainCost > 0 && (
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="paper rounded-xl p-6 border" style={{ borderColor: "var(--border-soft)" }}>
                  <div className="text-sm" style={{ color: "var(--ink-dim)" }}>Custo / mês</div>
                  <div className="mt-2 text-2xl font-bold">{fmtBRL(proposal.monthlyPainCost)}</div>
                </div>
                <div className="paper rounded-xl p-6 border" style={{ borderColor: "var(--border-soft)" }}>
                  <div className="text-sm" style={{ color: "var(--ink-dim)" }}>Em 6 meses</div>
                  <div className="mt-2 text-2xl font-bold">{fmtBRL(proposal.monthlyPainCost * 6)}</div>
                </div>
                <div className="paper rounded-xl p-6 border-2" style={{ borderColor: "var(--accent)" }}>
                  <div className="text-sm" style={{ color: "var(--accent)" }}>Em 12 meses</div>
                  <div className="mt-2 text-2xl font-bold" style={{ color: "var(--accent)" }}>
                    {fmtBRL(proposal.monthlyPainCost * 12)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "metodo":
        return (
          <div className="a4-page">
            <SectionHeader number="02" title="Como vamos chegar lá?" />
            <h3 className="text-2xl font-bold mb-4 wordmark">{proposal.methodName}</h3>
            <p className="text-lg mb-8" style={{ color: "var(--ink-dim)" }}>
              {proposal.methodIntro}
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {proposal.methodSteps.map((step, i) => (
                <div
                  key={step.id}
                  className="chip px-4 py-2 rounded-full text-sm border"
                >
                  <span className="font-bold mr-2" style={{ color: "var(--accent)" }}>
                    0{i + 1}
                  </span>
                  {step.title}
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--border-soft)" }}></div>
              {proposal.milestones.map((milestone, i) => (
                <div key={milestone.id} className="flex gap-4 items-start mb-4">
                  <div
                    className="w-6 h-6 rounded-full border-2 z-10"
                    style={{ borderColor: "var(--accent)", backgroundColor: "var(--paper)" }}
                  ></div>
                  <div className="pt-0.5">{milestone.title}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "valuestack":
        return (
          <div className="a4-page">
            <SectionHeader number="03" title="O que você vai receber" />
            <ul className="space-y-4 mb-10">
              {proposal.deliverables.filter((d) => !d.bonus).map((d) => (
                <li key={d.id} className="flex items-start gap-3">
                  <div className="mt-1 gold-check"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{d.title}</div>
                      <div className="dot-lead flex-1 h-1" style={{ color: "var(--border-soft)" }}></div>
                      <div className="chip-accent px-3 py-1 rounded-full text-sm border">
                        {fmtBRL(d.value)}
                      </div>
                    </div>
                    <div className="text-sm mt-1" style={{ color: "var(--ink-dim)" }}>
                      {d.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {proposal.deliverables.filter((d) => d.bonus).length > 0 && (
              <div className="space-y-3 mb-10">
                <div className="text-lg font-semibold wordmark" style={{ color: "var(--accent)" }}>
                  Bônus exclusivos
                </div>
                {proposal.deliverables.filter((d) => d.bonus).map((d) => (
                  <div key={d.id} className="bonus-card rounded-xl p-5 border">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold">{d.title}</div>
                      <div className="text-sm line-through" style={{ color: "var(--ink-dim)" }}>
                        {fmtBRL(d.value)}
                      </div>
                      <div className="chip-accent px-2 py-0.5 rounded text-xs border">Incluso</div>
                    </div>
                    <div className="text-sm" style={{ color: "var(--ink-dim)" }}>
                      {d.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="paper-2 rounded-xl p-6 border" style={{ borderColor: "var(--border-soft)" }}>
              <div className="text-sm" style={{ color: "var(--ink-dim)" }}>
                Valor total se contratado separadamente
              </div>
              <div className="text-4xl font-bold line-through mt-2" style={{ color: "var(--ink-dim)" }}>
                {fmtBRL(valueStackSum(proposal))}
              </div>
            </div>
          </div>
        );
      case "prova":
        return (
          <div className="a4-page">
            <SectionHeader number="04" title="Quem está com você?" />
            <div className="flex gap-6 items-start mb-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold paper-2" style={{ borderColor: "var(--accent)", border: "2px solid" }}>
                {proposal.consultant[0]}
              </div>
              <div>
                <div className="text-xl font-bold">{proposal.consultant}</div>
                <div style={{ color: "var(--ink-dim)" }}>{proposal.consultantRole}</div>
                <p className="mt-3" style={{ color: "var(--ink-dim)" }}>
                  {proposal.bioText}
                </p>
                <div className="mt-3 text-sm chip px-3 py-1 rounded-full border inline-block">
                  {proposal.bioCredentials}
                </div>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap mb-8">
              {proposal.metricsLine.split(" · ").map((metric, i) => (
                <div key={i} className="chip-accent px-4 py-2 rounded-full border text-sm font-semibold">
                  {metric}
                </div>
              ))}
            </div>
            {proposal.testimonials.length > 0 && (
              <div className="space-y-4">
                <div className="text-lg font-semibold wordmark">O que nossos clientes dizem</div>
                {proposal.testimonials.map((t) => (
                  <div key={t.id} className="paper-2 rounded-xl p-6 border" style={{ borderColor: "var(--border-soft)" }}>
                    <div className="italic mb-4" style={{ color: "var(--ink-dim)" }}>"{t.text}"</div>
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{t.name}</div>
                      <div style={{ color: "var(--ink-dim)" }}>·</div>
                      <div style={{ color: "var(--ink-dim)" }}>{t.company}</div>
                      <div className="ml-auto chip-accent px-3 py-1 rounded-full text-xs border">
                        {t.result}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "investimento":
        return (
          <div className="a4-page paper-radial">
            <SectionHeader number="05" title="Investimento" />
            <div className="text-sm mb-2" style={{ color: "var(--ink-dim)" }}>De</div>
            <div className="text-5xl font-bold line-through mb-6" style={{ color: "var(--ink-dim)" }}>
              {proposal.fullPriceText}
            </div>
            <div className="invest-card rounded-2xl p-8 border mb-6" style={{ borderColor: "var(--accent)" }}>
              <div className="text-sm mb-2" style={{ color: "var(--ink-dim)" }}>Investimento</div>
              <div className="text-5xl font-bold wordmark" style={{ color: "var(--accent)" }}>
                {proposal.payMode === "cartao"
                  ? `${proposal.cardCount}x de ${fmtBRL(proposal.cardInstallment)}`
                  : proposal.payMode === "pix"
                  ? fmtBRL(proposal.pixValue * (1 - proposal.pixDiscount / 100))
                  : `${proposal.boletoCount}x de ${fmtBRL(proposal.boletoInstallment)}`}
              </div>
              {proposal.payMode === "pix" && proposal.pixDiscount > 0 && (
                <div className="mt-2 chip-accent px-3 py-1 rounded-full text-sm border inline-block">
                  -{proposal.pixDiscount}% para pix à vista
                </div>
              )}
              <div className="mt-4 chip px-4 py-2 rounded-full border inline-block text-sm">
                Menos de {fmtBRL(pricePerDay(proposal))} por dia
              </div>
            </div>
            {proposal.guaranteeEnabled && (
              <div className="paper-2 rounded-xl p-6 border flex items-start gap-4 mb-6" style={{ borderColor: "var(--border-soft)" }}>
                <ShieldCheck size={28} style={{ color: "var(--accent)" }} />
                <div>
                  <div className="font-bold">Garantia</div>
                  <div className="text-sm mt-1" style={{ color: "var(--ink-dim)" }}>
                    {proposal.guaranteeText}
                  </div>
                </div>
              </div>
            )}
            <div className="paper-2 rounded-xl p-6 border" style={{ borderColor: "var(--border-soft)" }}>
              <div className="text-sm" style={{ color: "var(--ink-dim)" }}>Validade</div>
              <div className="font-bold mt-1">
                Válido até {fmtDateLong(addDaysIso(proposal.proposalDate, proposal.validityDays))}
              </div>
              <div className="mt-3 text-sm" style={{ color: "var(--ink-dim)" }}>
                Aviso: {proposal.urgencyReason}.
              </div>
            </div>
          </div>
        );
      case "fechamento":
        return (
          <div className="a4-page paper-radial flex flex-col justify-between">
            <div>
              <SectionHeader number="06" title="Próximos passos" />
              <p className="text-xl leading-relaxed mb-10" style={{ color: "var(--ink)" }}>
                {proposal.closingMessage}
              </p>
              <div className="inline-block chip-accent text-xl px-8 py-4 rounded-full border font-bold">
                {proposal.ctaText}
              </div>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-10 mb-10">
                <div>
                  <div className="h-px mb-3" style={{ background: "var(--ink-dim)" }}></div>
                  <div className="text-sm" style={{ color: "var(--ink-dim)" }}>
                    Pela {proposal.company}
                  </div>
                  <div className="font-bold">{proposal.consultant}</div>
                </div>
                <div>
                  <div className="h-px mb-3" style={{ background: "var(--ink-dim)" }}></div>
                  <div className="text-sm" style={{ color: "var(--ink-dim)" }}>De acordo</div>
                  <div className="font-bold">{proposal.clientName}</div>
                </div>
              </div>
              <div className="text-center text-sm" style={{ color: "var(--ink-dim)" }}>
                Proposta válida até {fmtDateLong(addDaysIso(proposal.proposalDate, proposal.validityDays))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="print-root" data-theme={proposal.theme} data-font={proposal.fontPair} style={{ "--accent": proposal.accent } as React.CSSProperties}>
      {/* Cover */}
      <div className="a4-page paper-radial flex flex-col justify-between">
        <div className="flex justify-between items-center">
          {proposal.logoDataUrl ? (
            <img src={proposal.logoDataUrl} alt={proposal.company} className="h-12" />
          ) : (
            <div className="text-2xl font-bold wordmark">{proposal.company}</div>
          )}
          <div className="chip px-4 py-2 rounded-full text-sm border">{proposal.coverEyebrow}</div>
        </div>
        <div>
          <h1 className="text-[52px] leading-tight font-bold wordmark">
            {proposal.coverHeadline}
          </h1>
          <p className="mt-4 text-xl" style={{ color: "var(--ink-dim)" }}>
            {proposal.coverSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div style={{ color: "var(--ink-dim)" }}>Preparado para</div>
            <div className="font-bold">{proposal.clientName}</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-dim)" }}>Empresa</div>
            <div className="font-bold">{proposal.clientCompany}</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-dim)" }}>Data</div>
            <div className="font-bold">{fmtDateLong(proposal.proposalDate)}</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-dim)" }}>Válida até</div>
            <div className="font-bold">{fmtDateLong(addDaysIso(proposal.proposalDate, proposal.validityDays))}</div>
          </div>
        </div>
      </div>
      {/* Content Sections */}
      {enabledSections.map((sectionId) => (
        <React.Fragment key={sectionId}>{renderSection(sectionId)}</React.Fragment>
      ))}
    </div>
  );
};
