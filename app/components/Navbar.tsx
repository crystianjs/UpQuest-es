'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUsuarioAtivo, setUsuarioAtivo } from '@/lib/auth';
import { User, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const usuarioAtual = getUsuarioAtivo();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      
      {/* Logotipo / Título */}
      <div className="flex items-center gap-6">
        <Link href="/desempenho" className="font-black text-red-600 tracking-wider text-lg flex items-center gap-2">
          UPQUESTO<span className="text-white">ES</span>
        </Link>
        <div className="hidden lg:flex items-center gap-2 bg-red-950/30 border border-red-600/30 px-3 py-1 rounded-lg text-xs font-semibold text-red-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          TJSP / VUNESP
        </div>
      </div>

      {/* Links de Navegação */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto max-w-full pb-2 md:pb-0 text-xs md:text-sm font-medium">
        <Link 
          href="/desempenho" 
          className={`px-4 py-2 rounded-xl transition-all ${isActive('/desempenho') ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
        >
          Desempenho & Gráficos
        </Link>
        <Link 
          href="/questoes" 
          className={`px-4 py-2 rounded-xl transition-all ${isActive('/questoes') ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
        >
          Registo de Questões
        </Link>
        <Link 
          href="/redacao" 
          className={`px-4 py-2 rounded-xl transition-all ${isActive('/redacao') ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
        >
          Treinar Redação
        </Link>
      </div>

      {/* Seletor Rápido de Utilizador (Para testes de isolamento) */}
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl shadow-inner">
        <User className="w-4 h-4 text-red-500 shrink-0" />
        <select
          value={usuarioAtual}
          onChange={(e) => setUsuarioAtivo(e.target.value)}
          className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer font-medium"
        >
          <option value="crystianjs09@gmail.com" className="bg-zinc-900 text-white">Crystian (Principal)</option>
          <option value="teste@gmail.com.br" className="bg-zinc-900 text-white">Teste (teste@gmail.com.br)</option>
        </select>
      </div>

    </nav>
  );
}