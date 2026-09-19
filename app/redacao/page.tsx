'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { Play, Square, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

export default function RedacaoPage() {
  const router = useRouter();
  const [tema, setTema] = useState('');
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Gestão do Cronômetro
  useEffect(() => {
    if (cronometroAtivo) {
      timerRef.current = setInterval(() => {
        setTempoSegundos((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cronometroAtivo]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const iniciarTreino = () => {
    if (!tema.trim()) {
      setErro('Por favor, insira o tema da redação antes de iniciar o cronómetro.');
      return;
    }
    setErro('');
    setCronometroAtivo(true);
  };

  const pararEGuardarTreino = async () => {
    if (!userId) return;
    setCronometroAtivo(false);

    if (tempoSegundos === 0) {
      setErro('O cronómetro não registou tempo suficiente.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso(false);

    try {
      const { error } = await supabase.from('redaccoes').insert([
        {
          tema: tema,
          texto: 'Treino prático cronometrado em papel/digital externo.',
          tempo_gasto_segundos: tempoSegundos,
          user_id: userId
        }
      ]);

      if (error) throw error;

      setSucesso(true);
      setTema('');
      setTempoSegundos(0);
    } catch (err: any) {
      console.error('Erro ao guardar treino de redação:', err);
      setErro('Erro ao guardar redação. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
              <FileText className="w-6 h-6 text-red-500" />
              Treino de Redação Padrão VUNESP — Cronómetro
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Insira o tema, inicie o cronómetro enquanto redige o seu texto e guarde o tempo total dedicado.
            </p>
          </div>
        </div>

        {sucesso && (
          <div className="bg-emerald-950/40 border border-emerald-600/40 p-4 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Treino de redação guardado com sucesso! Consulte o tempo no Painel de Desempenho.
          </div>
        )}

        {erro && (
          <div className="bg-red-950/40 border border-red-600/40 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {erro}
          </div>
        )}

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl space-y-8 text-center">
          
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tema da Redação</label>
            <input 
              type="text" 
              disabled={cronometroAtivo || salvando}
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Os impactos da tecnologia nas relações sociais contemporâneas"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-60"
            />
          </div>

          {/* Display Gigante do Cronómetro */}
          <div className="py-8 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <Clock className={`w-10 h-10 ${cronometroAtivo ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`} />
            <span className="text-5xl md:text-6xl font-black tracking-widest text-white font-mono">
              {formatarTempo(tempoSegundos)}
            </span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              {cronometroAtivo ? 'Cronómetro a correr...' : 'Pronto para iniciar'}
            </span>
          </div>

          {/* Botões de Ação do Cronómetro */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!cronometroAtivo ? (
              <button 
                onClick={iniciarTreino}
                disabled={salvando}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base"
              >
                <Play className="w-5 h-5 fill-current" />
                Iniciar Treino & Cronómetro
              </button>
            ) : (
              <button 
                onClick={pararEGuardarTreino}
                disabled={salvando}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base animate-pulse"
              >
                <Square className="w-5 h-5 fill-current" />
                Parar & Guardar Redação
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}