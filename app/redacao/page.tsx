'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FraseMotivadora from '../components/FraseMotivadora';
import { PenTool, CheckCircle2 } from 'lucide-react';

export default function RedacaoPage() {
  const [tema, setTema] = useState('');
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  // Contagem de palavras para exibição visual
  const totalPalavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema || !texto) {
      setErroMsg('Preencha o tema e o texto da redação.');
      return;
    }

    setCarregando(true);
    setErroMsg('');

    try {
      // Nome correto da tabela no Supabase: redaccoes
      const { error } = await supabase.from('redaccoes').insert([
        {
          tema: tema,
          texto: texto,
          tempo_gasto_segundos: 0 // Valor padrão caso a coluna seja obrigatória na base de dados
        }
      ]);

      if (error) throw error;

      setTema('');
      setTexto('');
      setSucesso(true);
      setTimeout(() => setSucesso(false), 4000);

    } catch (err: any) {
      console.error('Erro ao salvar redação:', err);
      setErroMsg(err.message || 'Erro ao salvar redação no banco.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-8 bg-red-600 rounded-sm shadow-lg shadow-red-600/50"></div>
          <h1 className="text-xl font-black tracking-wider text-white">
            UPQUESTO<span className="text-red-600">ES</span> <span className="text-xs font-normal text-zinc-400 ml-2">| Treinador de Redação VUNESP</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/desempenho" className="text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors">
            Desempenho & Gráficos
          </Link>
          <Link href="/desempenho" className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-red-600/30 transition-all">
            ← Voltar ao Painel Geral
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <PenTool className="w-6 h-6 text-red-500" />
            Prática Dissertativa Padrão VUNESP
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Treine a sua argumentação, gerencie suas ideias e salve suas redações para compor o seu painel de estatísticas.
          </p>
        </div>

        {/* Caixa de Reflexão Diária */}
        <FraseMotivadora />

        {sucesso && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-600/50 text-red-200 text-sm flex items-center justify-between">
            <span>Redação salva com sucesso e contabilizada no painel!</span>
            <CheckCircle2 className="w-5 h-5 text-red-400" />
          </div>
        )}

        {erroMsg && (
          <div className="p-4 rounded-lg bg-red-900/50 border border-red-500 text-red-100 text-sm">
            <span>{erroMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Tema da Redação</label>
            <input 
              type="text"
              required
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Os impactos da tecnologia na sociedade moderna..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Texto Dissertativo</label>
              <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-600/30 px-2.5 py-1 rounded-md">
                Palavras: {totalPalavras}
              </span>
            </div>
            <textarea 
              rows={12}
              required
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Desenvolva sua introdução, argumentos e conclusão aqui..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors leading-relaxed"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              disabled={carregando}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-red-600/20 transition-all duration-200 text-sm tracking-wide cursor-pointer flex items-center gap-2"
            >
              {carregando ? 'Salvando Redação...' : 'Salvar Redação no Sistema'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}