import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { LeadSearchForm } from '../features/leads/components/LeadSearchForm';
import { LeadsList } from '../features/leads/components/LeadsList';
import { useLeadsSearch } from '../features/leads/hooks/useLeadsSearch';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Users } from 'lucide-react';

export const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leads',
  component: LeadsPage,
});

function LeadsPage() {
  const { leads, total, fonte, loading, error, searched, buscar } = useLeadsSearch();

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0a0b0f]/90 backdrop-blur-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Users size={16} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none">Busca de Leads</h1>
                <p className="text-xs text-gray-500 mt-0.5">Encontre prospects qualificados</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Formulário de busca */}
        <div className="paper rounded-2xl border border-gray-800 p-6 mb-8">
          <LeadSearchForm loading={loading} onSearch={buscar} />
        </div>

        {/* Resultados */}
        <LeadsList
          leads={leads}
          loading={loading}
          error={error}
          searched={searched}
          total={total}
          fonte={fonte}
        />
      </main>
    </div>
  );
}
