'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function QuestoesPage() {
  const [materia, setMateria] = useState('Língua Portuguesa');
  const [totalFeitas, setTotalFeitas] = useState('');
  const [acertos, setAcertos] = useState('');
  const [erros, setErros] = useState('');
  const [pontoMelhoria, setPontoMelhoria] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  const listaMaterias = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErroMsg('');

    try {
      const { error } = await supabase.from('user_questions').insert([
        {
          materia: materia,
          total_feitas: Number(totalFeitas) || 0,
          acertos: Number(acertos) || 0,
          erros: Number(erros) || 0,
          ponto_melhoria: pontoMelhoria || ''
        }
      ]);

      if (error) throw error;

      // Limpa todos os inputs automaticamente após salvar com sucesso
      setTotalFeitas('');
      setAcertos('');
      setErros('');
      setPontoMelhoria('');
      
      setSucesso(true);
      setTimeout(() => setSucesso(false), 4000);

    } catch (err: any) {
      console.error('Erro detalhado Supabase:', err);
      setErroMsg(err.message || 'Erro ao salvar no banco de dados.');
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
            UPQUEST<span className="text-red-600">-ES</span> <span className="text-xs font-normal text-zinc-400 ml-2">| TJSP 2026</span>
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
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-10">
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-pulse"></span>
            Registro de Desempenho em Questões
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Lance seus blocos de estudo diários por disciplina oficial, quantidade, acertos, erros e pontos de melhoria.
          </p>
        </div>

        {sucesso && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-600/50 text-red-200 text-sm flex items-center justify-between">
            <span>Desempenho registrado e limpo com sucesso!</span>
            <span className="text-xs font-bold text-red-400">SALVO</span>
          </div>
        )}

        {erroMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/50 border border-red-500 text-red-100 text-sm">
            <span>{erroMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl">
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Matéria / Disciplina (Edital TJSP)</label>
            <select 
              value={materia} 
              onChange={(e) => setMateria(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
            >
              {listaMaterias.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Qtd. Feitas</label>
              <input 
                type="number" 
                required
                min="1"
                value={totalFeitas}
                onChange={(e) => setTotalFeitas(e.target.value)}
                placeholder="Ex: 24"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Acertos</label>
              <input 
                type="number" 
                required
                min="0"
                value={acertos}
                onChange={(e) => setAcertos(e.target.value)}
                placeholder="Ex: 20"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-emerald-400 font-bold focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Erros</label>
              <input 
                type="number" 
                required
                min="0"
                value={erros}
                onChange={(e) => setErros(e.target.value)}
                placeholder="Ex: 4"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-red-500 font-bold focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Ponto de Melhoria / Dificuldade Encontrada</label>
            <textarea 
              rows={4}
              value={pontoMelhoria}
              onChange={(e) => setPontoMelhoria(e.target.value)}
              placeholder="Ex: Revisar crase e regras de colocação pronominal..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={carregando}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-red-600/20 transition-all duration-200 text-sm tracking-wide cursor-pointer flex items-center gap-2"
            >
              {carregando ? 'Salvando...' : 'Salvar Registro de Desempenho'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}