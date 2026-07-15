import { createRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Wizard } from '../components/proposal/Wizard';
import { fromTemplate, templates } from '../lib/proposal';
import { useProposals } from '../store/useProposals';
import { TrendingUp, Target, Scale, Stethoscope, Code2, Rocket } from 'lucide-react';
import { rootRoute } from './__root';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Target, Scale, Stethoscope, Code2, Rocket
};

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

function Home() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { create } = useProposals();
  const navigate = useNavigate();

  const handleTemplateClick = (key: keyof typeof templates) => {
    const { id, createdAt, updatedAt, ...proposalData } = fromTemplate(key);
    const newId = create(proposalData);
    navigate({ to: '/editor/$id', params: { id: newId } });
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white p-6">
      <header className="max-w-4xl mx-auto mb-16">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold wordmark">
            Gerador de Propostas Comerciais
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold wordmark mb-4">
            Propostas que vendem. Em minutos.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ferramenta open source para criar propostas comerciais premium, com preview em tempo real e exportação em PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {Object.entries(templates).map(([key, t]) => {
            const Icon = iconMap[t.icon];
            return (
              <button
                key={key}
                onClick={() => handleTemplateClick(key as keyof typeof templates)}
                className="paper rounded-2xl p-6 border border-gray-800 text-left hover:border-gray-700 transition"
              >
                <div className="p-3 bg-gray-800 rounded-xl w-fit mb-4">
                  <Icon size={24} style={{ color: '#d9a94a' }} />
                </div>
                <div className="font-semibold mb-1">{t.label}</div>
                <div className="text-sm text-gray-400">{t.description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setWizardOpen(true)}
            className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90"
          >
            Nova proposta
          </button>
          <button
            onClick={() => setWizardOpen(true)}
            className="text-gray-400 underline hover:text-white"
          >
            Prefiro o wizard guiado
          </button>
        </div>
      </main>

      <Wizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
