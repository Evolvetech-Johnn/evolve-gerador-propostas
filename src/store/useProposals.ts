import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Proposal } from "../lib/proposal";

interface ProposalsStore {
  proposals: Record<string, Proposal>;
  create: (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">) => string;
  update: (id: string, patch: Partial<Proposal>) => void;
  remove: (id: string) => void;
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
      name: "proposals-v1"
    }
  )
);
