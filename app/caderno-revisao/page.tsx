'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { BookMarked, Sparkles, Pin, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface PostIt {
  id: string;
  materia: string;
  categoria: 'Linguagens' | 'Direito' | 'TJSP' | 'Exatas' | 'Tecnologia' | 'Geral';
  titulo: string;
  conteudo: string;
  status: 'Pendente' | 'Revisando' | 'Dominada';
  cor: 'amarelo' | 'azul' | 'verde' | 'rosa' | 'laranja';
}

// Dados iniciais baseados nas matérias oficiais do TJSP (VUNESP)
const POSTITS_INICIAIS: PostIt[] = [
  {
    id: '1',
    materia: 'Língua Portuguesa',
    categoria: 'Linguagens',
    titulo: 'Língua Portuguesa',
    conteudo: 'Crase obrigatória antes de pronomes relativos "cuja" (nunca). Concordância com o verbo "haver" no sentido de existir (invariável no singular). Macete da IA: ...',
    status: 'Revisando',
    cor: 'amarelo'
  },
  {
    id: '2',
    materia: 'Direito Administrativo',
    categoria: 'Direito',
    titulo: 'Direito Administrativo',
    conteudo: 'Atos Administrativos: Requisitos (CO-FOR-MO-OB-FI). Licitações (Lei 14.133/21): Dispensa e Inexigibilidade de licitação. Macete da IA: Lembre-se que o silêncio da...',
    status: 'Pendente',
    cor: 'rosa'
  },
  {
    id: '3',
    materia: 'Direito Constitucional',
    categoria: 'Direito',
    titulo: 'Direito Constitucional',
    conteudo: 'Art. 5º da CF/88: Direitos e Garantias Fundamentais. Habeas Corpus (liberdade de locomoção) x Habeas Data (informações pessoais). Macete da IA: Ação popular é...',
    status: 'Dominada',
    cor: 'verde'
  },
  {
    id: '4',
    materia: 'Direito Penal',
    categoria: 'Direito',
    titulo: 'Direito Penal',
    conteudo: 'Crimes contra a Administração Pública (Art. 312 a 359). Peculato culposo extingue a punibilidade se reparar o dano antes da sentença irrecorrível. Macete da IA: ...',
    status: 'Pendente',
    cor: 'azul'
  },
  {
    id: '5',
    materia: 'Direito Processual Civil',
    categoria: 'Direito',
    titulo: 'Direito Processual Civil',
    conteudo: 'Atos processuais, prazos em dias úteis. Petição inicial e tutela provisória. Macete da IA: Recurso de Apelação tem prazo fatal de 15 dias úteis.',
    status: 'Pendente',
    cor: 'laranja'
  },
  {
    id: '6',
    materia: 'Direito Processual Penal',
    categoria: 'Direito',
    titulo: 'Direito Processual Penal',
    conteudo: 'Inquérito Policial: procedimento inquisitivo, escrito e dispensável. Prisões cautelares: Temporária (5+5 dias hediondos) e Preventiva (sem prazo fixo). Macete da IA: ...',
    status: 'Revisando',
    cor: 'amarelo'
  },
  {
    id: '7',
    materia: 'Normas da Corregedoria',
    categoria: 'TJSP',
    titulo: 'Normas da Corregedoria',
    conteudo: 'Essencial para o TJSP! Rotinas de cartório judicial e digital. Carga de autos, prazos para cartório e atos do escrivão/chefe de seção. Macete da IA: Decore os prazos d...',
    status: 'Pendente',
    cor: 'rosa'
  },
  {
    id: '8',
    materia: 'Matemática',
    categoria: 'Exatas',
    titulo: 'Matemática',
    conteudo: 'Regra de três simples e composta, porcentagem e juros simples. Média aritmética ponderada e razão/proporção. Macete da IA: Em aumentos sucessivos de...',
    status: 'Pendente',
    cor: 'azul'
  },
  {
    id: '9',
    materia: 'Raciocínio Lógico',
    categoria: 'Exatas',
    titulo: 'Raciocínio Lógico',
    conteudo: 'Tabelas verdade, equivalências lógicas, negação de proposições (De Morgan) e diagramas lógicos. Macete da IA: Para negar o "E", nega tudo e troca por "OU".',
    status: 'Revisando',
    cor: 'amarelo'
  },
  {
    id: '10',
    materia: 'Informática',
    categoria: 'Tecnologia',
    titulo: 'Informática',
    conteudo: 'Windows 10/11, Pacote Office/LibreOffice, atalhos de teclado, segurança da informação (phishing, malware, criptografia) e redes/internet.',
    status: 'Dominada',
    cor: 'verde'
  },
  {
    id: '11',
    materia: 'Atualidades',
    categoria: 'Geral',
    titulo: 'Atualidades',
    conteudo: 'Fatos políticos, econômicos e sociais do Brasil e do mundo divulgados nos últimos meses, focando em cidadania e grandes temas contemporâneos.',
    status: 'Pendente',
    cor: 'rosa'
  },
  {
    id: '12',
    materia: 'Pessoa com Deficiência (LBI)',
    categoria: 'Direito',
    titulo: 'Pessoa com Deficiência (LBI)',
    conteudo: 'Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência - Lei nº 13.146/2015). Conceitos e diretrizes fundamentais.',
    status: 'Pendente',
    cor: 'amarelo'
  }
];

export default function CadernoRevisaoPage() {
  const router = useRouter();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS AS MATÉRIAS');
  const [postits, setPostits] = useState<PostIt[]>(POSTITS_INICIAIS);
  const [loadingIA, setLoadingIA] = useState(false);

  useEffect(() => {
    async function verificarSessao() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    }
    verificarSessao();
  }, [router]);

  // Contagem de matérias dominadas
  const dominadasCount = postits.filter(p => p.status === 'Dominada').length;

  // Filtragem de post-its
  const postitsFiltrados = filtroCategoria === 'TODAS AS MATÉRIAS'
    ? postits
    : postits.filter(p => p.categoria.toUpperCase() === filtroCategoria.toUpperCase());

  // Simular ingestão de resumo por IA
  const handleIngerirResumoIA = () => {
    setLoadingIA(true);
    setTimeout(() => {
      setLoadingIA(false);
      alert('Resumos e pontos de melhoria otimizados com sucesso pela IA para o padrão VUNESP!');
    }, 1200);
  };

  // Mapeamento de cores dos post-its estilo UI da imagem
  const getCorPostIt = (cor: string) => {
    switch (cor) {
      case 'amarelo':
        return 'bg-amber-100 text-zinc-900 border-amber-300';
      case 'rosa':
        return 'bg-rose-100 text-zinc-900 border-rose-300';
      case 'verde':
        return 'bg-emerald-100 text-zinc-900 border-emerald-300';
      case 'azul':
        return 'bg-sky-100 text-zinc-900 border-sky-300';
      case 'laranja':
        return 'bg-orange-100 text-zinc-900 border-orange-300';
      default:
        return 'bg-amber-100 text-zinc-900 border-amber-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Dominada':
        return <span className="bg-emerald-900/90 text-emerald-100 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Dominada</span>;
      case 'Revisando':
        return <span className="bg-amber-900/90 text-amber-100 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"><Clock className="w-3 h-3" /> Revisando</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"><AlertCircle className="w-3 h-3" /> Pendente</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Cabeçalho Principal da Ferramenta */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-600/50 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50 shrink-0">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  CADERNO DE REVISÃO
                </h1>
                <span className="bg-red-950/80 border border-red-600/40 text-red-400 text-xs px-2.5 py-0.5 rounded-lg font-bold">
                  TJSP Escrevente
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Post-its Inteligentes & Pontos de Melhoria da IA
              </p>
            </div>
          </div>

          <button 
            onClick={handleIngerirResumoIA}
            disabled={loadingIA}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loadingIA ? 'A processar IA...' : 'Ingerir Resumo IA'}
          </button>
        </div>

        {/* Barra de Filtros de Matérias e Indicador */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['TODAS AS MATÉRIAS', 'Linguagens', 'Direito', 'TJSP', 'Exatas', 'Tecnologia', 'Geral'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filtroCategoria === cat
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Matérias Dominadas: <strong className="text-white">{dominadasCount} / {postits.length}</strong>
          </div>
        </div>

        {/* Grelha de Post-its Estilo Quadro */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {postitsFiltrados.map((item) => (
            <div 
              key={item.id}
              className={`rounded-2xl p-5 border shadow-xl flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${getCorPostIt(item.cor)}`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-70">
                    {item.categoria}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <h3 className="text-base font-black tracking-tight">
                  {item.titulo}
                </h3>

                <p className="text-xs leading-relaxed opacity-90 line-clamp-5">
                  {item.conteudo}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/10 flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-1 opacity-70 text-[11px]">
                  <Pin className="w-3 h-3 rotate-45" /> Post-it IA
                </span>
                <button className="flex items-center gap-1 hover:underline opacity-90 hover:opacity-100 cursor-pointer">
                  Abrir Resumo <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}