import { nanoid } from "nanoid";

export type ThemeId = "dark-gold" | "dark-indigo" | "light-editorial" | "minimal-mono";
export type FontPairId = "modern" | "editorial" | "classic" | "tech" | "minimal" | "serif-bold";
export type PayMode = "cartao" | "pix" | "boleto";
export type SectionId = "diagnostico" | "metodo" | "valuestack" | "prova" | "investimento" | "fechamento";

export interface MethodStep { id: string; title: string }
export interface Milestone { id: string; title: string }
export interface Deliverable { id: string; title: string; desc: string; value: number; bonus?: boolean }
export interface Testimonial { id: string; name: string; company: string; result: string; text: string }
export interface Section { id: SectionId; enabled: boolean }

export interface Proposal {
  id: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  logoDataUrl?: string;
  accent: string;
  theme: ThemeId;
  fontPair: FontPairId;
  clientName: string;
  clientCompany: string;
  offer: string;
  proposalDate: string;
  validityDays: number;
  consultant: string;
  consultantRole: string;
  sections: Section[];
  coverEyebrow: string;
  coverHeadline: string;
  coverSubtitle: string;
  diagnosisText: string;
  monthlyPainCost: number;
  methodName: string;
  methodIntro: string;
  methodSteps: MethodStep[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  bioText: string;
  bioCredentials: string;
  metricsLine: string;
  testimonials: Testimonial[];
  payMode: PayMode;
  cardInstallment: number;
  cardCount: number;
  pixValue: number;
  pixDiscount: number;
  boletoInstallment: number;
  boletoCount: number;
  guaranteeEnabled: boolean;
  guaranteeText: string;
  urgencyReason: string;
  fullPriceText: string;
  closingMessage: string;
  ctaText: string;
}

export const fmtBRL = (n: number): string => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
export const fmtDateLong = (iso: string): string => new Date(iso).toLocaleDateString("pt-BR", { weekday: undefined, year: "numeric", month: "long", day: "numeric" });
export const addDaysIso = (iso: string, days: number): string => { const d = new Date(iso); d.setDate(d.getDate() + days); return d.toISOString().split('T')[0]; }
export const todayIso = (): string => new Date().toISOString().split('T')[0];
export const valueStackSum = (p: Proposal): number => p.deliverables.reduce((sum, d) => sum + d.value, 0);

export const realPrice = (p: Proposal): number => {
  if (p.payMode === "cartao") return p.cardInstallment * p.cardCount;
  if (p.payMode === "pix") return p.pixValue * (1 - p.pixDiscount / 100);
  if (p.payMode === "boleto") return p.boletoInstallment * p.boletoCount;
  return 0;
}

export const pricePerDay = (p: Proposal): number => realPrice(p) / 365;

const defaultSections: Section[] = [
  { id: "diagnostico", enabled: true },
  { id: "metodo", enabled: true },
  { id: "valuestack", enabled: true },
  { id: "prova", enabled: true },
  { id: "investimento", enabled: true },
  { id: "fechamento", enabled: true }
];

const agencia = (): Omit<Proposal, "id" | "createdAt" | "updatedAt"> => ({
  company: "Evolve Marketing", logoDataUrl: undefined, accent: "#d9a94a", theme: "dark-gold", fontPair: "modern",
  clientName: "João da Silva", clientCompany: "Loja Moderna",
  offer: "Gestão de Tráfego Pago", proposalDate: todayIso(), validityDays: 15,
  consultant: "Maria Souza", consultantRole: "Diretora de Crescimento",
  sections: [...defaultSections],
  coverEyebrow: "PROPOSTA EXCLUSIVA",
  coverHeadline: "O caminho para triplicar o faturamento em 90 dias, sem depender de sorte.",
  coverSubtitle: "Uma estratégia sob medida para o seu negócio, com foco em resultados tangíveis.",
  diagnosisText: "Hoje você investe em tráfego sem clareza de ROI, e a maioria das campanhas não se paga. Esse cenário custa em média R$ 5.000 por mês. Em 12 meses, isso representa R$ 60.000 jogados fora.",
  monthlyPainCost: 5000,
  methodName: "Método Fluxo de Clientes",
  methodIntro: "A maioria tenta anunciar em tudo ao mesmo tempo e falha porque não sabe medir o que funciona. O Método Fluxo é diferente: vamos concentrar orçamento nas campanhas que realmente trazem clientes.",
  methodSteps: [
    { id: nanoid(), title: "Auditoria de Contas" },
    { id: nanoid(), title: "Estratégia de Ofertas" },
    { id: nanoid(), title: "Criação de Criativos" },
    { id: nanoid(), title: "Otimização Contínua" }
  ],
  milestones: [
    { id: nanoid(), title: "1ª Semana: Auditoria e Planejamento" },
    { id: nanoid(), title: "4ª Semana: Primeiras Campanhas Ativas" },
    { id: nanoid(), title: "8ª Semana: Otimização Avançada" },
    { id: nanoid(), title: "12ª Semana: Relatório de ROI" }
  ],
  deliverables: [
    { id: nanoid(), title: "Auditoria completa de tráfego", desc: "Análise detalhada de todas as contas de anúncios.", value: 3000 },
    { id: nanoid(), title: "Estratégia de ofertas", desc: "Definição de ofertas irresistíveis para cada etapa do funil.", value: 4000 },
    { id: nanoid(), title: "Criação de 10 criativos", desc: "Peças gráficas otimizadas para conversão.", value: 5000 },
    { id: nanoid(), title: "Gestão por 3 meses", desc: "Otimização semanal e relatórios de performance.", value: 12000 },
    { id: nanoid(), title: "Treinamento da equipe", desc: "Capacitação para manter os resultados.", value: 4000, bonus: true }
  ],
  bioText: "Eu ajudo negócios a transformar tráfego em clientes fiéis há mais de 7 anos.",
  bioCredentials: "Certificado Google Ads · Meta Blueprint · +R$20M em orçamento gerenciado",
  metricsLine: "+120% ROAS médio · +35% ticket médio · -22% CAC",
  testimonials: [
    { id: nanoid(), name: "Carlos Mendes", company: "Café & Cia", result: "2,8x em 90 dias", text: "Tínhamos tentado 3 agências antes. A Evolve foi a única que entregou o que prometeu." }
  ],
  payMode: "cartao", cardInstallment: 2490, cardCount: 12,
  pixValue: 24900, pixDiscount: 10,
  boletoInstallment: 2590, boletoCount: 12,
  guaranteeEnabled: true, guaranteeText: "Se em 30 dias não ver progresso real, devolvemos o seu dinheiro.",
  urgencyReason: "trabalhamos com no máximo 8 clientes por trimestre para manter a qualidade",
  fullPriceText: "R$ 28.000",
  closingMessage: "Essa proposta foi desenhada sob medida para Loja Moderna. O próximo passo é um só: confirmar de acordo abaixo.",
  ctaText: "VAMOS COMEÇAR"
});

const consultoria = (): Omit<Proposal, "id" | "createdAt" | "updatedAt"> => ({
  company: "Ativa Consultoria", logoDataUrl: undefined, accent: "#7075f0", theme: "dark-indigo", fontPair: "minimal",
  clientName: "Ana Costa", clientCompany: "Inova Solutions",
  offer: "Consultoria de Processos", proposalDate: todayIso(), validityDays: 10,
  consultant: "Lucas Almeida", consultantRole: "Consultor Sênior",
  sections: [...defaultSections],
  coverEyebrow: "PLANO DE OTIMIZAÇÃO",
  coverHeadline: "O caminho para reduzir custos em 25% em 6 meses, sem demitir ninguém.",
  coverSubtitle: "Melhore a produtividade sem sacrificar a cultura da sua empresa.",
  diagnosisText: "Hoje processos são repetitivos, informações se perdem em planilhas, e a equipe gasta 30% do tempo com retrabalho. Esse cenário custa em média R$ 15.000 por mês. Em 12 meses, isso representa R$ 180.000.",
  monthlyPainCost: 15000,
  methodName: "Método Clareza Operacional",
  methodIntro: "A maioria tenta implementar ferramentas complexas primeiro e falha porque não arruma os processos antes. O Método Clareza é diferente: otimizamos o que já existe antes de adicionar algo novo.",
  methodSteps: [
    { id: nanoid(), title: "Mapeamento de Processos" },
    { id: nanoid(), title: "Identificação de Gargalos" },
    { id: nanoid(), title: "Redesenho de Fluxos" },
    { id: nanoid(), title: "Implementação e Treinamento" }
  ],
  milestones: [
    { id: nanoid(), title: "1ª Semana: Diagnóstico" },
    { id: nanoid(), title: "3ª Semana: Relatório Final" },
    { id: nanoid(), title: "6ª Semana: Implementação" },
    { id: nanoid(), title: "12ª Semana: Acompanhamento" }
  ],
  deliverables: [
    { id: nanoid(), title: "Diagnóstico completo", desc: "Relatório com todos os gargalos identificados.", value: 8000 },
    { id: nanoid(), title: "Redesenho de processos", desc: "Fluxos claros e documentados.", value: 12000 },
    { id: nanoid(), title: "SOPs detalhados", desc: "Procedimentos operacionais padrão para cada área.", value: 6000 },
    { id: nanoid(), title: "Acompanhamento de 3 meses", desc: "Reuniões quinzenais para garantir resultados.", value: 10000 },
    { id: nanoid(), title: "Modelo de gestão", desc: "Sistema de métricas para manter a evolução.", value: 6000, bonus: true }
  ],
  bioText: "Trabalho com otimização de processos há mais de 10 anos, já ajudei 50+ empresas.",
  bioCredentials: "Lean Six Sigma Black Belt · MBA em Gestão de Operações",
  metricsLine: "-25% custos médios · +40% produtividade · -60% retrabalho",
  testimonials: [
    { id: nanoid(), name: "Fernanda Lima", company: "Logistica Rápida", result: "-31% de custos", text: "O resultado veio mais rápido do que esperávamos. Excelente trabalho." }
  ],
  payMode: "pix", cardInstallment: 3490, cardCount: 12,
  pixValue: 36000, pixDiscount: 12,
  boletoInstallment: 3590, boletoCount: 12,
  guaranteeEnabled: true, guaranteeText: "Garantia de satisfação: se não ficar feliz com o diagnóstico, não paga.",
  urgencyReason: "temos capacidade para apenas 4 projetos simultâneos",
  fullPriceText: "R$ 42.000",
  closingMessage: "Essa proposta foi desenhada sob medida para Inova Solutions. O próximo passo é um só: confirmar de acordo abaixo.",
  ctaText: "QUERO OTIMIZAR"
});

const juridico = (): Omit<Proposal, "id" | "createdAt" | "updatedAt"> => ({
  company: "Martins & Associados", logoDataUrl: undefined, accent: "#a37918", theme: "light-editorial", fontPair: "classic",
  clientName: "Paulo Ribeiro", clientCompany: "Construtora Horizonte",
  offer: "Assessoria Jurídica Empresarial", proposalDate: todayIso(), validityDays: 20,
  consultant: "Dra. Carla Martins", consultantRole: "Sócia Fundadora",
  sections: [...defaultSections],
  coverEyebrow: "PROPOSTA DE ASSESSORIA",
  coverHeadline: "O caminho para operar com total segurança jurídica, sem surpresas.",
  coverSubtitle: "Prevenção é sempre mais barato do que litigar.",
  diagnosisText: "Hoje você lida com contratos sem revisão, riscos trabalhistas desconhecidos, e um problema pode paralisar tudo. Um processo trabalhista pode custar em média R$ 40.000. Imagine 3 casos em 12 meses: R$ 120.000.",
  monthlyPainCost: 0,
  methodName: "Método Proteção Total",
  methodIntro: "A maioria só procura advogado quando já tem problema e falha porque a prevenção é negligenciada. O Método Proteção é diferente: trabalhamos proativamente para evitar conflitos.",
  methodSteps: [
    { id: nanoid(), title: "Auditoria Jurídica Completa" },
    { id: nanoid(), title: "Revisão de Contratos" },
    { id: nanoid(), title: "Adequação Trabalhista" },
    { id: nanoid(), title: "Suporte Contínuo" }
  ],
  milestones: [
    { id: nanoid(), title: "1ª Quinzena: Auditoria" },
    { id: nanoid(), title: "3ª Quinzena: Relatório de Riscos" },
    { id: nanoid(), title: "2º Mês: Adequação" },
    { id: nanoid(), title: "Mensal: Suporte Contínuo" }
  ],
  deliverables: [
    { id: nanoid(), title: "Auditoria jurídica", desc: "Análise de todos os processos e documentos.", value: 10000 },
    { id: nanoid(), title: "Revisão de 20 contratos", desc: "Ajustes para minimizar riscos.", value: 8000 },
    { id: nanoid(), title: "Adequação trabalhista", desc: "Ajustes em contratos e políticas.", value: 12000 },
    { id: nanoid(), title: "Suporte por 12 meses", desc: "Consultas ilimitadas por e-mail/telefone.", value: 24000 },
    { id: nanoid(), title: "Modelos de contrato", desc: "Biblioteca com mais de 50 modelos editáveis.", value: 6000, bonus: true }
  ],
  bioText: "Advogada há 15 anos, especializada em direito empresarial e consultiva preventiva.",
  bioCredentials: "OAB-SP 123.456 · Pós-Graduação em Direito Empresarial",
  metricsLine: "+120 clientes assessorados · -90% riscos mitigados",
  testimonials: [
    { id: nanoid(), name: "Roberto Nunes", company: "Comercial Nunes", result: "Zero processos em 2 anos", text: "Desde que trabalhamos com a Dra. Carla, dormimos tranquilos." }
  ],
  payMode: "boleto", cardInstallment: 4900, cardCount: 12,
  pixValue: 49000, pixDiscount: 8,
  boletoInstallment: 4900, boletoCount: 12,
  guaranteeEnabled: false, guaranteeText: "",
  urgencyReason: "a agenda é limitada a 15 clientes mensais para atendimento de qualidade",
  fullPriceText: "R$ 60.000",
  closingMessage: "Essa proposta foi desenhada sob medida para Construtora Horizonte. O próximo passo é um só: confirmar de acordo abaixo.",
  ctaText: "GARANTIR SEGURANÇA"
});

const saude = (): Omit<Proposal, "id" | "createdAt" | "updatedAt"> => ({
  company: "Vita Saúde", logoDataUrl: undefined, accent: "#2d3a8c", theme: "light-editorial", fontPair: "editorial",
  clientName: "Patricia Gomes", clientCompany: "Clínica Bem Estar",
  offer: "Gestão de Crescimento de Clínica", proposalDate: todayIso(), validityDays: 15,
  consultant: "Dr. Ricardo Mendes", consultantRole: "Consultor em Saúde",
  sections: [...defaultSections],
  coverEyebrow: "PLANO DE CRESCIMENTO",
  coverHeadline: "O caminho para aumentar o fluxo de pacientes em 50%, sem perder o atendimento humano.",
  coverSubtitle: "Crescimento sustentável com foco na experiência do paciente.",
  diagnosisText: "Hoje a agenda tem horários vazios, o fluxo depende de indicações, e você investe em marketing sem retorno claro. Uma consulta vazia custa em média R$ 200. Se 10 consultas ficam vazias por semana: R$ 8.000/mês, R$ 96.000/ano.",
  monthlyPainCost: 8000,
  methodName: "Método Paciente em Primeiro Lugar",
  methodIntro: "A maioria tenta anúncios genéricos e falha porque não diferencia a experiência. O Método Paciente é diferente: transformamos cada paciente em um divulgador da clínica.",
  methodSteps: [
    { id: nanoid(), title: "Experiência do Paciente" },
    { id: nanoid(), title: "Fluxo de Agendamento" },
    { id: nanoid(), title: "Indicações Estruturadas" },
    { id: nanoid(), title: "Marketing Local" }
  ],
  milestones: [
    { id: nanoid(), title: "1ª Semana: Diagnóstico" },
    { id: nanoid(), title: "4ª Semana: Novo Fluxo" },
    { id: nanoid(), title: "8ª Semana: Programa de Indicações" },
    { id: nanoid(), title: "12ª Semana: Resultados" }
  ],
  deliverables: [
    { id: nanoid(), title: "Auditoria de experiência", desc: "Análise de todo o jornada do paciente.", value: 4000 },
    { id: nanoid(), title: "Redesenho do fluxo", desc: "Processos para otimizar agendamento e atendimento.", value: 6000 },
    { id: nanoid(), title: "Programa de indicações", desc: "Sistema para incentivar indicações.", value: 5000 },
    { id: nanoid(), title: "Consultoria por 6 meses", desc: "Acompanhamento mensal para garantir resultados.", value: 18000 },
    { id: nanoid(), title: "Material de marketing", desc: "Artes e textos prontos para redes sociais.", value: 4000, bonus: true }
  ],
  bioText: "Médico e gestor de clínicas há 12 anos, já ajudei 30+ clínicas a crescer.",
  bioCredentials: "CRM-SP 12.345 · MBA em Gestão de Serviços de Saúde",
  metricsLine: "+60% pacientes médios · +45% taxa de retorno",
  testimonials: [
    { id: nanoid(), name: "Dra. Juliana", company: "Clínica Vida Plena", result: "+72% em 6 meses", text: "O método funcionou muito melhor do que esperávamos." }
  ],
  payMode: "cartao", cardInstallment: 2990, cardCount: 12,
  pixValue: 29900, pixDiscount: 10,
  boletoInstallment: 3090, boletoCount: 12,
  guaranteeEnabled: true, guaranteeText: "Se em 4 meses o fluxo não aumentar, continuamos trabalhando gratuitamente até aumentar.",
  urgencyReason: "atendemos apenas 6 clínicas por semestre para manter a qualidade",
  fullPriceText: "R$ 37.000",
  closingMessage: "Essa proposta foi desenhada sob medida para Clínica Bem Estar. O próximo passo é um só: confirmar de acordo abaixo.",
  ctaText: "AUMENTAR FLUXO"
});

const tech = (): Omit<Proposal, "id" | "createdAt" | "updatedAt"> => ({
  company: "DevScale", logoDataUrl: undefined, accent: "#ffffff", theme: "minimal-mono", fontPair: "tech",
  clientName: "Marcos Ferreira", clientCompany: "StartupX",
  offer: "Desenvolvimento de Produto Digital", proposalDate: todayIso(), validityDays: 12,
  consultant: "André Costa", consultantRole: "CTO & Founder",
  sections: [...defaultSections],
  coverEyebrow: "PLANO DE PRODUTO",
  coverHeadline: "O caminho para lançar seu produto em 3 meses, sem rework.",
  coverSubtitle: "Processo ágil com foco em validação e qualidade de código.",
  diagnosisText: "Hoje você tem ideias, mas o desenvolvimento demora, o produto sai cheio de bugs, e o escopo só aumenta. Um mês de atraso custa em média R$ 10.000. Em 6 meses, isso é R$ 60.000.",
  monthlyPainCost: 10000,
  methodName: "Método Build Fast Right",
  methodIntro: "A maioria tenta construir tudo de uma vez e falha porque não valida cedo. O Método Build Fast Right é diferente: construímos o MVP primeiro, validamos, e iteramos.",
  methodSteps: [
    { id: nanoid(), title: "Discovery & Product Strategy" },
    { id: nanoid(), title: "Design de UX/UI" },
    { id: nanoid(), title: "Desenvolvimento MVP" },
    { id: nanoid(), title: "Validação & Iteração" }
  ],
  milestones: [
    { id: nanoid(), title: "1ª Semana: Discovery" },
    { id: nanoid(), title: "4ª Semana: Design" },
    { id: nanoid(), title: "10ª Semana: MVP" },
    { id: nanoid(), title: "12ª Semana: Lançamento" }
  ],
  deliverables: [
    { id: nanoid(), title: "Product Strategy", desc: "Documento de visão, persona, roadmap.", value: 8000 },
    { id: nanoid(), title: "Design de UX/UI", desc: "Protótipos navegáveis e design system.", value: 12000 },
    { id: nanoid(), title: "Desenvolvimento MVP", desc: "Código limpo e documentado.", value: 35000 },
    { id: nanoid(), title: "Suporte por 2 meses", desc: "Correções e ajustes pós-lançamento.", value: 10000 },
    { id: nanoid(), title: "Documentação técnica", desc: "Tudo o que precisa para manter o produto.", value: 6000, bonus: true }
  ],
  bioText: "Desenvolvedor há 10 anos, já construí mais de 40 produtos digitais.",
  bioCredentials: "Ex-engenheiro em grandes tech · Especialista em React e Node.js",
  metricsLine: "40+ produtos lançados · -40% tempo de lançamento médio",
  testimonials: [
    { id: nanoid(), name: "Luiza Oliveira", company: "Fintech Y", result: "Lançamos em 11 semanas", text: "Equipe fantástica. O código está impecável." }
  ],
  payMode: "pix", cardInstallment: 5900, cardCount: 12,
  pixValue: 65000, pixDiscount: 8,
  boletoInstallment: 6000, boletoCount: 12,
  guaranteeEnabled: true, guaranteeText: "Entregamos o MVP no prazo ou devolvemos 50%.",
  urgencyReason: "aceitamos apenas 2 projetos de desenvolvimento por mês",
  fullPriceText: "R$ 71.000",
  closingMessage: "Essa proposta foi desenhada sob medida para StartupX. O próximo passo é um só: confirmar de acordo abaixo.",
  ctaText: "INICIAR PROJETO"
});

const infoproduto = (): Omit<Proposal, "id" | "createdAt" | "updatedAt"> => ({
  company: "LaunchLab", logoDataUrl: undefined, accent: "#d9a94a", theme: "dark-gold", fontPair: "serif-bold",
  clientName: "Juliana Rocha", clientCompany: "Autoridade X",
  offer: "Lançamento de Infoproduto", proposalDate: todayIso(), validityDays: 10,
  consultant: "Thiago Santos", consultantRole: "Launch Specialist",
  sections: [...defaultSections],
  coverEyebrow: "PLANO DE LANÇAMENTO",
  coverHeadline: "O caminho para o seu primeiro R$ 100k em lançamento, sem depender de sorte.",
  coverSubtitle: "Estratégia completa de posicionamento, oferta e lançamento.",
  diagnosisText: "Hoje você tem conhecimento, mas não sabe transformar em um produto que vende. Você vê outros lançando e se pergunta \"por que não eu?\". Um lançamento mal feito pode deixar R$ 50.000 em dinheiro na mesa.",
  monthlyPainCost: 0,
  methodName: "Método Autoridade Digital",
  methodIntro: "A maioria tenta gravar o curso primeiro e falha porque não valida a oferta. O Método Autoridade é diferente: construímos a audiência e a oferta antes de gravar uma aula.",
  methodSteps: [
    { id: nanoid(), title: "Posicionamento e Nicho" },
    { id: nanoid(), title: "Construção de Oferta" },
    { id: nanoid(), title: "Warm-up de Audiência" },
    { id: nanoid(), title: "Lançamento" }
  ],
  milestones: [
    { id: nanoid(), title: "1ª Semana: Posicionamento" },
    { id: nanoid(), title: "4ª Semana: Oferta Validada" },
    { id: nanoid(), title: "8ª Semana: Warm-up" },
    { id: nanoid(), title: "12ª Semana: Lançamento" }
  ],
  deliverables: [
    { id: nanoid(), title: "Consultoria de posicionamento", desc: "Definição clara do seu nicho e mensagem.", value: 5000 },
    { id: nanoid(), title: "Criação da oferta", desc: "Definição do produto, preço e garantia.", value: 6000 },
    { id: nanoid(), title: "Estratégia de conteúdo", desc: "Calendário de 60 dias de conteúdo.", value: 4000 },
    { id: nanoid(), title: "Acompanhamento de lançamento", desc: "Criação de peças e estratégia de vendas.", value: 15000 },
    { id: nanoid(), title: "Modelos de copy", desc: "Biblioteca de textos prontos para vendas.", value: 5000, bonus: true }
  ],
  bioText: "Já ajudei 20+ especialistas a fazerem o seu primeiro lançamento de infoproduto.",
  bioCredentials: "+R$2M em lançamentos · Especialista em copy e estratégia",
  metricsLine: "+20 lançamentos · +R$100k médio por lançamento",
  testimonials: [
    { id: nanoid(), name: "Renata Carvalho", company: "Nutri Renata", result: "R$ 117k no 1º lançamento", text: "O Thiago me guiou do zero ao lançamento. Sem ele, eu não teria conseguido." }
  ],
  payMode: "cartao", cardInstallment: 2990, cardCount: 12,
  pixValue: 29900, pixDiscount: 12,
  boletoInstallment: 3090, boletoCount: 12,
  guaranteeEnabled: true, guaranteeText: "Se você aplicar tudo e não fizer pelo menos 30 vendas, continuamos trabalhando juntos até fazer.",
  urgencyReason: "abrimos apenas 5 vagas por mês para acompanhamento de lançamento",
  fullPriceText: "R$ 35.000",
  closingMessage: "Essa proposta foi desenhada sob medida para Autoridade X. O próximo passo é um só: confirmar de acordo abaixo.",
  ctaText: "LANÇAR MEU PRODUTO"
});

export const templates = {
  agencia: { key: "agencia", label: "Agência de Marketing", icon: "TrendingUp", description: "Para agências de tráfego, branding e marketing digital", data: agencia },
  consultoria: { key: "consultoria", label: "Consultoria", icon: "Target", description: "Para consultores de negócios, processos e gestão", data: consultoria },
  juridico: { key: "juridico", label: "Serviços Jurídicos", icon: "Scale", description: "Para advogados e escritórios de advocacia empresarial", data: juridico },
  saude: { key: "saude", label: "Saúde e Clínicas", icon: "Stethoscope", description: "Para clínicas, consultórios e profissionais da saúde", data: saude },
  tech: { key: "tech", label: "Tecnologia / Software", icon: "Code2", description: "Para devs, agências de software e produtos digitais", data: tech },
  infoproduto: { key: "infoproduto", label: "Infoproduto / Curso", icon: "Rocket", description: "Para criadores de infoprodutos e especialistas", data: infoproduto },
};

export const fromTemplate = (key: keyof typeof templates, overrides: Partial<Omit<Proposal, "id" | "createdAt" | "updatedAt">> = {}): Proposal => {
  const templateData = templates[key].data();
  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...templateData,
    ...overrides
  };
};

export const slug = (s: string): string => s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
