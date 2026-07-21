/**
 * useLeadsSearch.ts
 * Hook com a lógica de busca de leads: estado, loading, erro.
 * Sem lógica de UI — apenas gerenciamento de estado e chamada à API.
 */
import { useState, useCallback } from 'react';
import { buscarLeads, BuscarLeadsParams, Lead, BuscarLeadsResponse } from '../services/leadsApi';

interface UseLeadsSearchReturn {
  leads: Lead[];
  total: number;
  fonte: BuscarLeadsResponse['fonte'] | null;
  loading: boolean;
  error: string | null;
  searched: boolean;
  buscar: (params: BuscarLeadsParams) => Promise<void>;
  limpar: () => void;
}

export function useLeadsSearch(): UseLeadsSearchReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [fonte, setFonte] = useState<BuscarLeadsResponse['fonte'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const buscar = useCallback(async (params: BuscarLeadsParams) => {
    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const data = await buscarLeads(params);
      setLeads(data.leads);
      setTotal(data.total);
      setFonte(data.fonte);
      setSearched(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido na busca';
      setError(msg);
      setLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setLeads([]);
    setTotal(0);
    setFonte(null);
    setError(null);
    setSearched(false);
  }, []);

  return { leads, total, fonte, loading, error, searched, buscar, limpar };
}
