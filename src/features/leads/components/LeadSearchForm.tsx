import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { BuscarLeadsParams } from '../services/leadsApi';

const UF_LIST = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
];

interface Props {
  loading: boolean;
  onSearch: (params: BuscarLeadsParams) => void;
}

export const LeadSearchForm: React.FC<Props> = ({ loading, onSearch }) => {
  const [nicho, setNicho] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [avaliacaoMinima, setAvaliacaoMinima] = useState('');
  const [minimoAvaliacoes, setMinimoAvaliacoes] = useState('');
  const [exigirTelefone, setExigirTelefone] = useState(true);
  const [exigirSite, setExigirSite] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicho.trim() || !cidade.trim() || !estado) return;
    onSearch({
      nicho: nicho.trim(),
      cidade: cidade.trim(),
      estado,
      avaliacaoMinima: avaliacaoMinima ? Number(avaliacaoMinima) : undefined,
      minimoAvaliacoes: minimoAvaliacoes ? Number(minimoAvaliacoes) : undefined,
      exigirTelefone,
      exigirSite,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Linha principal */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Nicho / Segmento *</label>
          <input
            id="lead-nicho"
            type="text"
            placeholder="Ex: salão de beleza, academia, restaurante..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition"
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Cidade *</label>
          <input
            id="lead-cidade"
            type="text"
            placeholder="Ex: São Paulo, Campinas..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>
        <div className="w-full md:w-28">
          <label className="text-xs text-gray-400 mb-1 block">Estado *</label>
          <select
            id="lead-estado"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition appearance-none"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            {UF_LIST.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros avançados */}
      <div>
        <button
          type="button"
          onClick={() => setShowFiltros(!showFiltros)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
        >
          <SlidersHorizontal size={14} />
          {showFiltros ? 'Ocultar filtros avançados' : 'Filtros avançados'}
        </button>

        {showFiltros && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Avaliação mínima</label>
              <input
                id="lead-avaliacao-min"
                type="number"
                min="1"
                max="5"
                step="0.5"
                placeholder="Ex: 4.0"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                value={avaliacaoMinima}
                onChange={(e) => setAvaliacaoMinima(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Mínimo de avaliações</label>
              <input
                id="lead-min-avaliacoes"
                type="number"
                min="0"
                placeholder="Ex: 20"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                value={minimoAvaliacoes}
                onChange={(e) => setMinimoAvaliacoes(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="relative inline-block w-9 h-5">
                  <input
                    id="lead-exigir-telefone"
                    type="checkbox"
                    checked={exigirTelefone}
                    onChange={(e) => setExigirTelefone(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`block w-9 h-5 rounded-full transition-colors ${exigirTelefone ? 'bg-amber-500' : 'bg-gray-700'}`}
                  />
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${exigirTelefone ? 'translate-x-4' : ''}`}
                  />
                </span>
                <span className="text-xs text-gray-300">Exigir telefone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="relative inline-block w-9 h-5">
                  <input
                    id="lead-exigir-site"
                    type="checkbox"
                    checked={exigirSite}
                    onChange={(e) => setExigirSite(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`block w-9 h-5 rounded-full transition-colors ${exigirSite ? 'bg-amber-500' : 'bg-gray-700'}`}
                  />
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${exigirSite ? 'translate-x-4' : ''}`}
                  />
                </span>
                <span className="text-xs text-gray-300">Exigir site</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Botão buscar */}
      <button
        id="lead-buscar-btn"
        type="submit"
        disabled={loading || !nicho.trim() || !cidade.trim()}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-all"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            Buscando leads...
          </>
        ) : (
          <>
            <Search size={16} />
            Buscar Leads
          </>
        )}
      </button>
    </form>
  );
};
