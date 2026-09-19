'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { BookMarked, Plus, Pin, CheckCircle2, Clock, AlertCircle, Edit3, Trash2, Code, X, Save } from 'lucide-react';

interface PostIt {
  id: string;
  materia: string;
  categoria: 'Linguagens' | 'Direito' | 'TJSP' | 'Exatas' | 'Tecnologia' | 'Geral';
  titulo: string;
  conteudo: string;
  status: 'Pendente' | 'Revisando' | 'Dominada';
  cor: 'amarelo' | 'azul' | 'verde' | 'rosa' | 'laranja';
}

export default function CadernoRevisaoPage() {
  const router = useRouter();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS AS MATÉRIAS');
  const [postits, setPostits] = useState<PostIt[]>([]);

  // Estados dos Modais
  const [modalJsonOpen, setModalJsonOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  
  const [postitEmEdicao, setPostitEmEdicao] = useState<PostIt | null>(null);

  useEffect(() => {
    async function verificarSessao() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    }
    verificarSessao();
  }, [router]);

  const dominadasCount = postits.filter(p => p.status === 'Dominada').length;

  const postitsFiltrados = filtroCategoria === 'TODAS AS MATÉRIAS'
    ? postits
    : postits.filter(p => p.categoria.toUpperCase() === filtroCategoria.toUpperCase());

  // Adicionar via JSON
  const handleAdicionarJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const novoItem: PostIt = {
        id: Date.now().toString(),
        materia: parsed.materia || 'Nova Matéria',
        categoria: parsed.categoria || 'Geral',
        titulo: parsed.titulo || parsed.materia || 'Resumo IA',
        conteudo: parsed.conteudo || parsed.resumo || 'Sem conteúdo especificado.',
        status: parsed.status || 'Pendente',
        cor: parsed.cor || 'amarelo'
      };
      setPostits([novoItem, ...postits]);
      setJsonInput('');
      setModalJsonOpen(false);
      alert('Resumo adicionado com sucesso ao quadro!');
    } catch {
      alert('Erro no formato JSON. Certifique-se de inserir um JSON válido.');
    }
  };

  // Salvar alterações de edição
  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postitEmEdicao) return;

    setPostits(postits.map(p => p.id === postitEmEdicao.id ? postitEmEdicao : p));
    setPostitEmEdicao(null);
  };

  // Remover Post-it
  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover este post-it do caderno?')) {
      setPostits(postits.filter(p => p.id !== id));
    }
  };

  const getCorPostIt = (cor: string) => {
    switch (cor) {
      case 'amarelo': return 'bg-amber-100 text-zinc-900 border-amber-300';
      case 'rosa': return 'bg-rose-100 text-zinc-900 border-rose-300';
      case 'verde': return 'bg-emerald-100 text-zinc-900 border-emerald-300';
      case 'azul': return 'bg-sky-100 text-zinc-900 border-sky-300';
      case 'laranja': return 'bg-orange-100 text-zinc-900 border-orange-300';
      default: return 'bg-amber-100 text-zinc-900 border-amber-300';
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
        
        {/* Cabeçalho */}
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

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setModalJsonOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all cursor-pointer w-full md:w-auto justify-center"
            >
              <Code className="w-4 h-4" />
              Adicionar Resumo (JSON)
            </button>
          </div>
        </div>

        {/* Filtros e Indicador */}
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

        {/* Grelha de Post-its */}
        {postits.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Code className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Nenhum resumo no caderno ainda</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Clique no botão "Adicionar Resumo (JSON)" acima para colar os dados gerados pela IA e começar a testar.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {postitsFiltrados.map((item) => (
              <div 
                key={item.id}
                className={`rounded-2xl p-5 border shadow-xl flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 relative group ${getCorPostIt(item.cor)}`}
              >
                {/* Botões de Ação rápida no topo do card (Editar e Apagar) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setPostitEmEdicao(item)}
                    title="Editar Post-it / Status"
                    className="p-1.5 rounded-lg bg-black/10 hover:bg-black/25 text-zinc-900 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleRemover(item.id)}
                    title="Remover Resumo"
                    className="p-1.5 rounded-lg bg-black/10 hover:bg-rose-500 hover:text-white text-zinc-900 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 pr-12">
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
                  <span className="flex items-center gap-1 opacity-90 text-[11px]">
                    {item.materia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL: Adicionar Resumo via JSON */}
      {modalJsonOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-red-500" />
                Adicionar Novo Resumo (JSON)
              </h3>
              <button 
                onClick={() => setModalJsonOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Cole abaixo o objeto JSON gerado pela IA com os campos: <code className="text-red-400">materia</code>, <code className="text-red-400">categoria</code>, <code className="text-red-400">titulo</code>, <code className="text-red-400">conteudo</code>, <code className="text-red-400">status</code> (Pendente, Revisando, Dominada) e <code className="text-red-400">cor</code> (amarelo, rosa, verde, azul, laranja).
            </p>

            <textarea 
              rows={8}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "materia": "Direito Constitucional",\n  "categoria": "Direito",\n  "titulo": "Controle de Constitucionalidade",\n  "conteudo": "Resumo detalhado gerado pela IA...",\n  "status": "Revisando",\n  "cor": "verde"\n}`}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
            />

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalJsonOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdicionarJson}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Ingerir no Quadro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Lápis de Edição (Alterar status, conteúdo e cor) */}
      {postitEmEdicao && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-500" />
                Editar Resumo / Post-it
              </h3>
              <button 
                onClick={() => setPostitEmEdicao(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Título</label>
                <input 
                  type="text"
                  value={postitEmEdicao.titulo}
                  onChange={(e) => setPostitEmEdicao({...postitEmEdicao, titulo: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold">Status de Aprendizado</label>
                  <select 
                    value={postitEmEdicao.status}
                    onChange={(e) => setPostitEmEdicao({...postitEmEdicao, status: e.target.value as any})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Revisando">Revisando</option>
                    <option value="Dominada">Dominada</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold">Cor do Post-it</label>
                  <select 
                    value={postitEmEdicao.cor}
                    onChange={(e) => setPostitEmEdicao({...postitEmEdicao, cor: e.target.value as any})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="amarelo">Amarelo</option>
                    <option value="rosa">Rosa</option>
                    <option value="verde">Verde</option>
                    <option value="azul">Azul</option>
                    <option value="laranja">Laranja</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Conteúdo / Macete da IA</label>
                <textarea 
                  rows={5}
                  value={postitEmEdicao.conteudo}
                  onChange={(e) => setPostitEmEdicao({...postitEmEdicao, conteudo: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-red-600 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setPostitEmEdicao(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800 font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}