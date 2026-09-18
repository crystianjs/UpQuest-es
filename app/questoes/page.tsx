'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuestoesPage() {
  const [bloco, setBloco] = useState('Bloco II: Conhecimentos em Direito');
  const [materia, setMateria] = useState('Direito Constitucional');
  const [totalFeitas, setTotalFeitas] = useState('');
  const [acertos, setAcertos] = useState('');
  const [erros, setErros] = useState('');
  const [pontoMelhoria, setPontoMelhoria] = useState('');
  const [statusMelhoria, setStatusMelhoria] = useState<'pendente' | 'melhoria feita'>('pendente');
  const [sucesso, setSucesso] = useState(false);

  const materiasPorBloco: Record<string, string[]> = {
    'Bloco I: Língua Portuguesa': ['Língua Portuguesa (24 questões)'],
    'Bloco II: Conhecimentos em Direito': [
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Penal',
      'Direito Processual Penal',
      'Direito Processual Civil',
      'Normas da Corregedoria Geral da Justiça'
    ],
    'Bloco III: Conhecimentos Gerais': [
      'Atualidades',
      'Informática',
      'Raciocínio Lógico'
    ]
  };

  const handleBlocoChange = (novoBloco: string) => {
    setBloco(novoBloco);
    setMateria(materiasPorBloco[novoBloco][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso(true);
    setTimeout(() => setSucesso(false), 4000);
    setTotalFeitas('');
    setAcertos('');
    setErros('');
    setPontoMelhoria('');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-8 bg-red-600 rounded-sm"></div>
          <h1 className="text-xl font-black tracking-wider text-white">
            UPQUEST<span className="text-red-600">-ES</span> <span className="text-xs font-normal text-zinc-400 ml-2">| TJSP 2026</span>
          </h1>
        </div>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors">
          ← Voltar ao Dashboard
        </Link>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-10">
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Registro de Desempenho em Questões
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Lance seus blocos de estudo diários por quantidade, acertos, erros e pontos de melhoria.
          </p>
        </div>

        {sucesso && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-600/50 text-red-200 text-sm flex items-center justify-between">
            <span>Desempenho registrado e vinculado com sucesso!</span>
            <span className="text-xs font-bold text-red-400">SALVO</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Bloco do Edital</label>
            <select 
              value={bloco} 
              onChange={(e) => handleBlocoChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
            >
              {Object.keys(materiasPorBloco).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Matéria / Disciplina</label>
            <select 
              value={materia} 
              onChange={(e) => setMateria(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
            >
              {materiasPorBloco[bloco].map((mat) => (
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
                placeholder="Ex: 20"
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
                placeholder="Ex: 16"
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
              rows={3}
              value={pontoMelhoria}
              onChange={(e) => setPontoMelhoria(e.target.value)}
              placeholder="Ex: Confundido prazo de interposição de embargos de declaração..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Status da Revisão / Melhoria</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStatusMelhoria('melhoria feita')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm border transition-all ${statusMelhoria === 'melhoria feita' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/30' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                Melhoria Feita
              </button>
              <button
                type="button"
                onClick={() => setStatusMelhoria('pendente')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm border transition-all ${statusMelhoria === 'pendente' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                Pendente
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-red-600/20 transition-all duration-200 text-sm tracking-wide"
            >
              Salvar Registro de Desempenho
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}