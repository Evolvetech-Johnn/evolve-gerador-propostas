import React from 'react';
import { Check, Tag } from 'lucide-react';
import { CatalogItem, agruparPorCategoria } from '../data/servicesCatalog';

interface Props {
  catalogo: CatalogItem[];
  selecionados: string[]; // array de CatalogItem.id
  onToggle: (id: string) => void;
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export const ServiceSelector: React.FC<Props> = ({ catalogo, selecionados, onToggle }) => {
  const grupos = agruparPorCategoria(catalogo);

  return (
    <div className="space-y-5">
      {Object.entries(grupos).map(([categoria, itens]) => (
        <div key={categoria}>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={12} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {categoria}
            </span>
          </div>
          <div className="space-y-1.5">
            {itens.map((item) => {
              const selecionado = selecionados.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 ${
                    selecionado
                      ? 'border-amber-500/50 bg-amber-500/8'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  {/* Checkbox visual */}
                  <span
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      selecionado ? 'bg-amber-500 border-amber-500' : 'border-gray-600'
                    }`}
                  >
                    {selecionado && <Check size={10} strokeWidth={3} className="text-black" />}
                  </span>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium leading-tight ${selecionado ? 'text-white' : 'text-gray-300'}`}>
                        {item.nome}
                        {item.bonus && (
                          <span className="ml-2 text-xs text-amber-400 font-normal">(bônus)</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {fmtBRL(item.valorSugerido)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
