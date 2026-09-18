'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('crystianjs09@gmail.com');
  const [senha, setSenha] = useState('********');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de login isolado
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/questoes';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-red-600 selection:text-white">
      
      {/* Card Principal */}
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-red-950/20 relative overflow-hidden">
        
        {/* Detalhe visual de luz vermelha superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-600 shadow-lg shadow-red-600"></div>

        {/* Ícone de Escudo / Segurança */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-red-950/40 border border-red-600/50 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
        </div>

        {/* Títulos */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-wider text-white">
            UPQUEST<span className="text-red-600">-ES</span>
          </h1>
          <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-widest">
            Acesso Restrito — Concurso TJSP (VUNESP)
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              E-mail Cadastrado
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Senha
            </label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-600/30 transition-all duration-200 text-sm tracking-wide mt-2 disabled:opacity-50"
          >
            {loading ? 'Entrando na Plataforma...' : 'Entrar na Plataforma'}
          </button>
        </form>

        {/* Links rápidos inferiores */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-around text-xs text-zinc-400">
          <Link href="/desempenho" className="hover:text-red-500 transition-colors flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Desempenho
          </Link>
          <Link href="/redacao" className="hover:text-red-500 transition-colors flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Redação
          </Link>
          <Link href="/questoes" className="hover:text-red-500 transition-colors flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Questões TJSP
          </Link>
        </div>

      </div>
    </div>
  );
}