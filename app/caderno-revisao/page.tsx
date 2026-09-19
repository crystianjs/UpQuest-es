'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { BookMarked, Plus, Pin, CheckCircle2, Clock, AlertCircle, Edit3, Trash2, Code, X, Save, Copy, Check, Loader2, Square, CheckSquare } from 'lucide-react';

interface CheckItem {
  texto: string;
  concluido: boolean;
}

interface PostIt {
  id: string;
  user_id?: string;
  materia: string;
  categoria: string;
  titulo: string;
  conteudo: string;
  checklist?: CheckItem[];
  status: 'Pendente' | 'Revisando' | 'Dominada';
  cor: 'amarelo' | 'azul' | 'verde' | 'rosa' | 'laranja';
}

const MATERIAS_TJSP = [
  'TODAS AS MATÉRIAS',
  'Língua Portuguesa',
  'Direito Penal',
  'Direito Processual Penal',
  'Direito Processual Civil',
  'Direito Constitucional',
  'Direito Administrativo',
  'Normas da Corregedoria',
  'Matemática',
  'Raciocínio Lógico',
  'Informática',
  'Atualidades',
  'Estatuto da Pessoa com Deficiência'
];

export default function CadernoRevisaoPage() {
  const router = useRouter();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS AS MATÉRIAS');
  const [postits, setPostits] = useState<PostIt[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Estados dos Modais
  const [modalJsonOpen, setModalJsonOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [postitEmEdicao, setPostitEmEdicao] = useState<PostIt | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/');
          return;
        }
        setUserId(session.user.id);

        const { data, error } = await supabase
          .from('caderno_revisao')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setPostits(data);
      } catch (err) {
        console.error('Erro ao carregar caderno:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [router]);

  const dominadasCount = postits.filter(p => p.status === 'Dominada').length;

  const postitsFiltrados = filtroCategoria === 'TODAS AS MATÉRIAS'
    ? postits
    : postits.filter(p => p.materia.toLowerCase() === filtroCategoria.toLowerCase() || p.categoria.toLowerCase() === filtroCategoria.toLowerCase());

  // Adicionar via JSON
  const handleAdicionarJson = async () => {
    if (!userId) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const novoItem = {
        user_id: userId,
        materia: parsed.materia || 'Direito Constitucional',
        categoria: parsed.categoria || 'TJSP',
        titulo: parsed.titulo || 'Resumo de Erros',
        conteudo: parsed.conteudo || parsed.resumo || 'Sem conteúdo especificado.',
        checklist: parsed.checklist || [],
        status: parsed.status || 'Pendente',
        cor: parsed.cor || 'amarelo'
      };

      const { data, error } = await supabase
        .from('caderno_revisao')
        .insert([novoItem])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setPostits([data[0], ...postits]);
      }

      setJsonInput('');
      setModalJsonOpen(false);
      alert('Resumo com checklist salvo com sucesso no Banco!');
    } catch (err) {
      console.error(err);
      alert('Erro no formato JSON. Verifique se copiou corretamente.');
    }
  };

  // Alternar Checkbox interativo no card
  const handleToggleCheck = async (postId: string, index: number) => {
    const postAlvo = postits.find(p => p.id === postId);
    if (!postAlvo || !postAlvo.checklist) return;

    const novoChecklist = [...postAlvo.checklist];
    novoChecklist[index].concluido = !novoChecklist[index].concluido;

    // Atualiza estado local otimista
    const atualizados = postits.map(p => p.id === postId ? { ...p, checklist: novoChecklist } : p);
    setPostits(atualizados);

    // Salva no banco
    await supabase
      .from('caderno_revisao')
      .update({ checklist: novoChecklist })
      .eq('id', postId);
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postitEmEdicao) return;

    try {
      const { error } = await supabase
        .from('caderno_revisao')
        .update({
          titulo: postitEmEdicao.titulo,
          conteudo: postitEmEdicao.conteudo,
          status: postitEmEdicao.status,
          cor: postitEmEdicao.cor
        })
        .eq('id', postitEmEdicao.id);

      if (error) throw error;

      setPostits(postits.map(p => p.id === postitEmEdicao.id ? postitEmEdicao : p));
      setPostitEmEdicao(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar post-it.');
    }
  };

  // Remover Post-it
  const handleRemover = async (id: string) => {
    if (confirm('Deseja excluir permanentemente este resumo?')) {
      try {
        const { error } = await supabase.from('caderno_revisao').delete().eq('id', id);
        if (error) throw error;
        setPostits(postits.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const promptIaRecomendado = `Com base nos meus erros nas questões de [INSERIR MATÉRIA AQUI], crie um resumo objetivo em formato estrito de objeto JSON puro, contendo exatamente estas chaves:
{
  "materia": "Nome exato da matéria do TJSP",
  "categoria": "TJSP",
  "titulo": "Título curto focado no ponto de erro",
  "conteudo": "Explicação direta do conceito cobrado, pegadinha da banca VUNESP e o motivo do erro",
  "checklist": [
    { "texto": "Primeiro ponto crítico ou macete para lembrar", "concluido": false },
    { "texto": "Segundo ponto crítico ou pegadinha da banca", "concluido": false }
  ],
  "status": "Pendente",
  "cor": "amarelo"
}
O campo cor pode ser: "amarelo", "azul", "verde", "rosa" ou "laranja". Traga apenas o JSON.`;

  const copiarPrompt = () => {
    navigator.clipboard.writeText(promptIaRecomendado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
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
                Post-its Inteligentes com Checklists & Banco de Dados
              </p>
            </div>
          </div>

          <button 
            onClick={() => setModalJsonOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all cursor-pointer w-full md:w-auto justify-center"
          >
            <Code className="w-4 h-4" />
            Adicionar Resumo (JSON)
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-thin">
            {MATERIAS_TJSP.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  filtroCategoria === cat
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 flex items-center gap-2 shrink-0 w-full lg:w-auto justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Matérias Dominadas: <strong className="text-white">{dominadasCount} / {postits.length}</strong>
          </div>
        </div>

        {/* Listagem / Loading */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            <p className="text-xs text-zinc-400">Carregando seus post-its...</p>
          </div>
        ) : postits.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Code className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Nenhum post-it cadastrado</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Clique em "Adicionar Resumo (JSON)" para injetar resumos com checklist inteligente.
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
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity bg-black/10 p-1 rounded-lg backdrop-blur-xs">
                  <button 
                    onClick={() => setPostitEmEdicao(item)}
                    title="Editar Post-it"
                    className="p-1 rounded hover:bg-black/20 text-zinc-900 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleRemover(item.id)}
                    title="Remover Resumo"
                    className="p-1 rounded hover:bg-rose-600 hover:text-white text-zinc-900 transition-colors cursor-pointer"
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

                  {/* Scroll interno com o texto e o checklist */}
                  <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                    <p className="text-xs leading-relaxed opacity-90 whitespace-pre-wrap">
                      {item.conteudo}
                    </p>

                    {item.checklist && item.checklist.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-black/10">
                        <span className="text-[10px] uppercase font-bold opacity-60 block">Checklist de Revisão</span>
                        {item.checklist.map((check, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleToggleCheck(item.id, idx)}
                            className="flex items-start gap-2 cursor-pointer group/check bg-black/5 hover:bg-black/10 p-1.5 rounded-lg transition-colors"
                          >
                            <button type="button" className="mt-0.5 shrink-0 text-zinc-900">
                              {check.concluido ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700" />
                              ) : (
                                <Square className="w-4 h-4 opacity-70" />
                              )}
                            </button>
                            <span className={`text-[11px] leading-tight ${check.concluido ? 'line-through opacity-50' : 'opacity-90'}`}>
                              {check.texto}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-black/10 flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1 opacity-70 text-[11px]">
                    <Pin className="w-3 h-3 rotate-45" /> Post-it IA
                  </span>
                  <span className="flex items-center gap-1 opacity-90 text-[11px] truncate max-w-[140px]" title={item.materia}>
                    {item.materia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL: Adicionar via JSON */}
      {modalJsonOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-red-500" />
                Adicionar Resumo com Checklists (JSON)
              </h3>
              <button 
                onClick={() => setModalJsonOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                  1. Copie o prompt otimizado com checklist:
                </span>
                <button
                  onClick={copiarPrompt}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiado ? 'Copiado!' : 'Copiar Prompt'}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-zinc-300 bg-black/40 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {promptIaRecomendado}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                2. Cole o JSON gerado abaixo:
              </span>
              <textarea 
                rows={8}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`{\n  "materia": "Direito Constitucional",\n  "categoria": "TJSP",\n  "titulo": "Direitos e Garantias",\n  "conteudo": "Explicação do erro...",\n  "checklist": [\n    { "texto": "Ponto 1", "concluido": false }\n  ],\n  "status": "Revisando",\n  "cor": "verde"\n}`}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-900">
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
                <Plus className="w-4 h-4" /> Salvar no Banco
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edição */}
      {postitEmEdicao && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-500" />
                Editar Resumo
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
                  <label className="text-zinc-400 font-semibold">Status</label>
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
                  <label className="text-zinc-400 font-semibold">Cor</label>
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
                <label className="text-zinc-400 font-semibold">Conteúdo / Explicação</label>
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