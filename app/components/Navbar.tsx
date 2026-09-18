'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-3 h-8 bg-red-600 rounded-sm shadow-lg shadow-red-600/50"></div>
        <span className="text-xl font-black tracking-wider text-white">
          UPQUEST<span className="text-red-600">-ES</span>
        </span>
        <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-red-950/60 text-red-400 border border-red-600/30">
          TJSP / VUNESP
        </span>
      </div>

      <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
        <Link 
          href="/desempenho" 
          className={`px-3 py-2 rounded-lg transition-all ${isActive('/desempenho') ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
        >
          Desempenho & Gráficos
        </Link>
        
        <Link 
          href="/questoes" 
          className={`px-3 py-2 rounded-lg transition-all ${isActive('/questoes') ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
        >
          Registro de Questões
        </Link>

        <Link 
          href="/redacao" 
          className={`px-3 py-2 rounded-lg transition-all ${isActive('/redacao') ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
        >
          Treinar Redação
        </Link>

        <Link 
          href="/" 
          className="ml-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-900 transition-all border border-zinc-800"
          title="Sair / Trocar Conta"
        >
          Sair
        </Link>
      </nav>
    </header>
  );
}