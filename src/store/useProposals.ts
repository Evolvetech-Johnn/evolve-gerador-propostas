import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Proposal } from "../lib/proposal";

interface ProposalsStore {
  proposals: Record<string, Proposal>;
  create: (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">) => string;
  update: (id: string, patch: Partial<Proposal>) => void;
  remove: (id: string) => void;
}

/**
 * Garante que uma proposta salva em versões antigas do app
 * tenha todos os campos necessários com valores padrão.
 */
function migrateProposal(p: Record<string, unknown>): Proposal {
  const raw = p as unknown as (Proposal & { fullPriceText?: string });

  // Campos adicionados na correção da Seção 05 — Investimento
  const monthlyValue =
    typeof raw.monthlyValue === "number"
      ? raw.monthlyValue
      : // Fallback: se payMode era mensal via cartão, tenta calcular; senão 0
        0;

  const showFromPrice =
    typeof raw.showFromPrice === "boolean"
      ? raw.showFromPrice
      : // Se havia fullPriceText com conteúdo, mantém ativo
        typeof raw.fullPriceText === "string" && raw.fullPriceText.trim() !== "";

  // Remove campo legado
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fullPriceText: _removed, ...rest } = raw;

  return {
    ...rest,
    monthlyValue,
    showFromPrice,
  } as Proposal;
}

export const useProposals = create<ProposalsStore>()(
  persist(
    (set, get) => ({
      proposals: {},
      create: (proposalData) => {
        const id = nanoid();
        const newProposal: Proposal = {
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...proposalData,
        };
        set((state) => ({
          proposals: { ...state.proposals, [id]: newProposal }
        }));
        return id;
      },
      update: (id, patch) => {
        const state = get();
        if (!state.proposals[id]) return;
        set((prev) => ({
          proposals: {
            ...prev.proposals,
            [id]: { ...prev.proposals[id], ...patch, updatedAt: new Date().toISOString() }
          }
        }));
      },
      remove: (id) => {
        set((prev) => {
          const newProposals = { ...prev.proposals };
          delete newProposals[id];
          return { proposals: newProposals };
        });
      }
    }),
    {
      name: "proposals-v2",          // chave nova para forçar leitura limpa
      storage: createJSONStorage(() => localStorage),
      // Migra dados da versão anterior (proposals-v1)
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Garante que cada proposta carregada do storage tem todos os campos atuais
        const migrated: Record<string, Proposal> = {};
        for (const [id, proposal] of Object.entries(state.proposals)) {
          migrated[id] = migrateProposal(proposal as unknown as Record<string, unknown>);
        }
        state.proposals = migrated;

        // Importa propostas salvas na chave antiga (v1) se v2 estiver vazia
        if (Object.keys(migrated).length === 0) {
          try {
            const oldRaw = localStorage.getItem("proposals-v1");
            if (oldRaw) {
              const oldData = JSON.parse(oldRaw) as { state?: { proposals?: Record<string, unknown> } };
              const oldProposals = oldData?.state?.proposals ?? {};
              const imported: Record<string, Proposal> = {};
              for (const [id, p] of Object.entries(oldProposals)) {
                imported[id] = migrateProposal(p as Record<string, unknown>);
              }
              state.proposals = imported;
            }
          } catch {
            // Se falhar a leitura legada, ignora silenciosamente
          }
        }
      },
    }
  )
);
