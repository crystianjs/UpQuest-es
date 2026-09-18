'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Timer, FileText, LogOut } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-lg text-emerald-400">UpQuest - TJSP / VUNESP</div>
      <div className="flex gap-6 items-center">
        <Link href="/desempenho" className={`flex items-center gap-2 hover:text-emerald-400 transition ${pathname === '/desempenho' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
          <LayoutDashboard size={18} /> Desempenho
        </Link>
        <Link href="/cronometro" className={`flex items-center gap-2 hover:text-emerald-400 transition ${pathname === '/cronometro' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
          <Timer size={18} /> Cronômetro / Questões
        </Link>
        <Link href="/redacao" className={`flex items-center gap-2 hover:text-emerald-400 transition ${pathname === '/redacao' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
          <FileText size={18} /> Redação (VUNESP)
        </Link>
        <Link href="/login" className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm">
          <LogOut size={16} /> Sair
        </Link>
      </div>
    </nav>
  )
}