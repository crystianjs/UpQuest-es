'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { PenTool, CheckCircle, AlertCircle } from 'lucide-react';

export default function RedacaoPage() {
  const router = useRouter();
  const [tema, setTema] = useState('');
  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function verificarSessao() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUserId(session.user.id);
      }
    }
    verificarSessao();
  }, [router]);

  const palavrasCount = texto.trim() ? texto.trim().split(/\s+/).length : 0;

  async function handleSalvarRedacao(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    if (!tema.trim() || !texto.trim()) {
      setErro('Por favor, preencha o tema e o texto da redação.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso(false);

    try {
      const { error } = await supabase.from('redaccoes').insert([
        {
          tema: tema,
          texto: texto,
          tempo_gasto_segundos: 0,
          user_id: userId // Vincula rigorosamente ao UUID do utilizador autenticado
        }
      ]);

      if (error) throw error;

      setSucesso(true);
      setTema('');
      setTexto('');
    } catch (err: any) {
      console.error('Erro ao guardar redação:', err);
      setErro('Erro ao guardar redação. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PenTool className="w-6 h-6 text-red-500" />
            Treino de Redação Padrão VUNESP — UPQUESTOS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Treine e guarde as suas redações de forma totalmente isolada.
          </p>
        </div>

        {sucesso && (
          <div className="bg-emerald-950/40 border border-emerald-600/40 p-4 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Redação guardada com sucesso! Consulte-a no Painel de Desempenho.
          </div>
        )}

        {erro && (
          <div className="bg-red-950/40 border border-red-600/40 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {erro}
          </div>
        )}

        <form onSubmit={handleSalvarRedacao} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tema da Redação</label>
            <input 
              type="text" 
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Os impactos da tecnologia nas relações sociais contemporâneas"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Texto Dissertativo-Argumentativo</label>
              <span className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-zinc-300">
                Palavras: <strong className="text-white">{palavrasCount}</strong>
              </span>
            </div>
            <textarea 
              rows={12}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Introdução, desenvolvimento e conclusão estruturados conforme o padrão VUNESP..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors leading-relaxed resize-y"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={salvando}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 cursor-pointer"
          >
            {salvando ? 'A guardar...' : 'Guardar Redação'}
          </button>

        </form>

      </main>
    </div>
  );
}