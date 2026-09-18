'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, BookOpen, CheckSquare, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { name: 'Desempenho & Gráficos', href: '/desempenho', icon: BarChart3 },
    { name: 'Registro de Questões', href: '/questoes', icon: CheckSquare },
    { name: 'Treinar Redação', href: '/redacao', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Título */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-emerald-400 tracking-tight">UpQuest-es</span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
            TJSP / VUNESP
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botão de Sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Encerrar Sessão"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>

      </div>
    </header>
  );
}