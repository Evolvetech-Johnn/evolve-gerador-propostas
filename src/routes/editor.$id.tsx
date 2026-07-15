import { createRoute, useNavigate, Link, useParams } from '@tanstack/react-router'
import { useProposals } from '../store/useProposals';
import { EditorPanel } from '../components/proposal/EditorPanel';
import { ProposalPreview } from '../components/proposal/ProposalPreview';
import { useState } from 'react';
import { FileDown, ChevronLeft, Eye, Edit3 } from 'lucide-react';
import { slug } from '../lib/proposal';
import { rootRoute } from './__root';

export const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$id',
  component: Editor,
})

function Editor() {
  const { id } = editorRoute.useParams();
  const { proposals } = useProposals();
  const proposal = proposals[id];
  const navigate = useNavigate();
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [exporting, setExporting] = useState(false);

  const exportPdf = async () => {
    setExporting(true);
    document.body.classList.add('pdf-exporting');
    await document.fonts?.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const { toPng } = await import('html-to-image');
    const { jsPDF } = await import('jspdf');
    const pages = Array.from(document.querySelectorAll('.a4-page')) as HTMLElement[];
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const dataUrl = await toPng(pages[i], { pixelRatio: 2.5, cacheBust: true, backgroundColor: getComputedStyle(pages[i]).backgroundColor });
      if (i > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    }
    pdf.save(`proposta-${slug(proposal?.clientCompany || '')}.pdf`);
    document.body.classList.remove('pdf-exporting');
    setExporting(false);
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-2xl mb-4">Proposta não encontrada</div>
          <Link to="/" className="underline text-gray-400 hover:text-white">
            Criar nova proposta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <div className="lg:hidden sticky top-0 z-40 paper border-b border-gray-800 p-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-400">
          <ChevronLeft size={16} />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setMobileMode('edit')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${mobileMode === 'edit' ? 'bg-gray-800' : 'text-gray-400'}`}
          >
            <Edit3 size={14} />
            Editar
          </button>
          <button
            onClick={() => setMobileMode('preview')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${mobileMode === 'preview' ? 'bg-gray-800' : 'text-gray-400'}`}
          >
            <Eye size={14} />
            Preview
          </button>
        </div>
        <button onClick={exportPdf} disabled={exporting} className="bg-white text-black px-3 py-1.5 rounded text-sm flex items-center gap-2 disabled:opacity-50">
          <FileDown size={14} />
          PDF
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`${mobileMode === 'edit' || 'lg' ? 'block' : 'hidden'}`}>
          <EditorPanel proposal={proposal} />
        </div>
        <div className={`flex-1 overflow-x-auto p-4 lg:p-8 ${mobileMode === 'preview' || 'lg' ? 'block' : 'hidden lg:block'}`}>
          <div className="hidden lg:flex justify-end mb-4">
            <button onClick={exportPdf} disabled={exporting} className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50">
              <FileDown size={18} />
              {exporting ? 'Gerando...' : 'Exportar PDF'}
            </button>
          </div>
          <div className="flex justify-center">
            <div className="shadow-2xl">
              <ProposalPreview proposal={proposal} />
            </div>
          </div>
        </div>
      </div>

      {exporting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="paper rounded-xl p-8 text-center">
            <div className="text-xl font-semibold mb-2">Gerando PDF</div>
            <div className="text-gray-400 text-sm">Renderizando páginas com cores e fundos preservados...</div>
          </div>
        </div>
      )}
    </div>
  );
}
