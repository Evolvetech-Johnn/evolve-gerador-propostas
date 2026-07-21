import React from 'react';
import { SearchX, Loader2, ServerOff } from 'lucide-react';
import { Lead } from '../services/leadsApi';
import { LeadCard } from './LeadCard';

interface Props {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  total: number;
  fonte: 'google_places' | 'nominatim' | null;
}

export const LeadsList: React.FC<Props> = ({ leads, loading, error, searched, total, fonte }) => {
  // Estado: carregando
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
        <Loader2 size={40} className="animate-spin text-amber-400" />
        <div className="text-center">
          <p className="font-medium text-white">Buscando leads...</p>
          <p className="text-sm mt-1">Isso pode levar alguns segundos — estamos raspando informações de contato.</p>
        </div>
      </div>
    );
  }

  // Estado: erro
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-red-400">
        <ServerOff size={40} />
        <div className="text-center">
          <p className="font-medium text-white">Falha na busca</p>
          <p className="text-sm mt-1 text-gray-400 max-w-sm">{error}</p>
          <p className="text-xs mt-3 text-gray-600">
            Verifique se o servidor backend está rodando na porta 3333.
          </p>
        </div>
      </div>
    );
  }

  // Estado: nenhuma busca ainda
  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
        <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center">
          <SearchX size={28} className="text-gray-700" />
        </div>
        <p className="text-sm">Preencha o formulário acima e clique em <strong className="text-gray-400">Buscar Leads</strong>.</p>
      </div>
    );
  }

  // Estado: resultado vazio
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
        <SearchX size={40} className="text-gray-700" />
        <div className="text-center">
          <p className="font-medium text-white">Nenhum lead encontrado</p>
          <p className="text-sm mt-1">Tente ampliar os critérios de busca ou use um nicho diferente.</p>
        </div>
      </div>
    );
  }

  // Estado: resultados
  return (
    <div>
      {/* Header de resultados */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          <span className="text-white font-semibold">{total}</span> leads encontrados
          {fonte && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700 bg-gray-900">
              via {fonte === 'google_places' ? '🟢 Google Places' : '🔵 OpenStreetMap'}
            </span>
          )}
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <LeadCard key={lead.placeId} lead={lead} />
        ))}
      </div>
    </div>
  );
};
