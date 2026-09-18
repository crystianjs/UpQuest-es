'use client';

import Navbar from '../components/Navbar';

export default function DesempenhoPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Cabeçalho do Painel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Desempenho</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Ambiente individual vinculado à conta: <span className="text-red-400">crystianjs09@gmail.com</span>
            </p>
          </div>
          <div className="bg-red-950/40 border border-red-600/40 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Foco: Escrevente TJSP (VUNESP)
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Questões Resolvidas</p>
            <h3 className="text-4xl font-black text-white">0</h3>
            <p className="text-xs text-zinc-500 mt-2">Matérias do edital</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Taxa de Acerto Geral</p>
            <h3 className="text-4xl font-black text-white">0%</h3>
            <p className="text-xs text-zinc-500 mt-2">Baseado nas suas respostas</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Redações Praticadas</p>
            <h3 className="text-4xl font-black text-white">0</h3>
            <p className="text-xs text-zinc-500 mt-2">Padrão VUNESP</p>
          </div>
        </div>

        {/* Seção de Progresso por Matéria */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl text-center py-16">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Nenhum registro de questão encontrado</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Utilize o menu de <span className="text-red-400">Registro de Questões</span> para começar a alimentar seus gráficos e acompanhar seu avanço.
          </p>
        </div>

      </main>
    </div>
  );
}