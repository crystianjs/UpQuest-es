'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuestõesPage() {
  const [materia, setMateria] = useState('Direito Constitucional');
  const [banca, setBanca] = useState('VUNESP');
  const [enunciado, setEnunciado] = useState('');
  const [gabarito, setGabarito] = useState('C');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de salvamento isolado por usuário
    setSucesso(true);
    setTimeout(() => setSucesso(false), 4000);
    setEnunciado('');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Registro de Questões & Simulados
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Cadastre e gerencie o seu banco de questões focado no padrão VUNESP.
          </p>
        </div>

        {sucesso && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-600/50 text-red-200 text-sm flex items-center justify-between">
            <span>Questão cadastrada e vinculada ao seu perfil com sucesso!</span>
            <span className="text-xs font-bold text-red-400">SALVO</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Matéria / Disciplina</label>
              <select 
                value={materia} 
                onChange={(e) => setMateria(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
              >
                <option>Direito Constitucional</option>
                <option>Direito Administrativo</option>
                <option>Direito Processual Civil</option>
                <option>Direito Penal</option>
                <option>Língua Portuguesa</option>
                <option>Raciocínio Lógico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Banca Examinadora</label>
              <select 
                value={banca} 
                onChange={(e) => setBanca(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
              >
                <option>VUNESP</option>
                <option>CESPE / CEBRASPE</option>
                <option>FGV</option>
                <option>FCC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Enunciado da Questão</label>
            <textarea 
              rows={5}
              required
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              placeholder="Cole o enunciado da questão aqui..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Gabarito Oficial</label>
            <div className="flex gap-4">
              {['A', 'B', 'C', 'D', 'E'].map((alt) => (
                <label key={alt} className={`flex-1 flex items-center justify-center py-3 rounded-lg border cursor-pointer font-bold text-sm transition-all ${gabarito === alt ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                  <input 
                    type="radio" 
                    name="gabarito" 
                    value={alt} 
                    checked={gabarito === alt} 
                    onChange={() => setGabarito(alt)}
                    className="sr-only" 
                  />
                  {alt}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-red-600/20 transition-all duration-200 text-sm tracking-wide"
            >
              Salvar Questão no Banco
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}