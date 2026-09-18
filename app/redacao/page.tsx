'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, RotateCcw, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RedacaoPage() {
  const [tema, setTema] = useState('');
  const [texto, setTexto] = useState('');
  
  const [iniciou, setIniciou] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    let intervalo: any = null;
    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos((seg) => seg + 1);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [ativo]);

  const formatarTempo = (totalSegundos: number) => {
    const mins = Math.floor(totalSegundos / 60);
    const segs = totalSegundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  const handleAdicionarTema = (e: React.FormEvent) => {
    e.preventDefault();
    if (tema.trim() !== '') {
      setIniciou(true);
      setAtivo(true);
    }
  };

  const handleSalvarRedacao = async () => {
    if (!texto.trim()) return;
    setCarregando(true);

    try {
      // Salva na tabela 'redacoes' do Supabase
      const { error } = await supabase.from('redacoes').insert([
        {
          tema,
          texto,
          tempo_gasto_segundos: segundos,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      setSucesso(true);
      setTimeout(() => setSucesso(false), 4000);
    } catch (err) {
      console.error('Erro ao salvar redação:', err);
      alert('Erro ao salvar redação no banco. Verifique se a tabela "redacoes" existe no Supabase.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Header Padronizado */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-8 bg-red-600 rounded-sm shadow-lg shadow-red-600/50"></div>
          <h1 className="text-xl font-black tracking-wider text-white">
            UPQUEST<span className="text-red-600">-ES</span> <span className="text-xs font-normal text-zinc-400 ml-2">| TJSP 2026</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/desempenho" className="text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors">
            Desempenho & Gráficos
          </Link>
          <Link href="/desempenho" className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-red-600/30 transition-all">
            ← Voltar ao Painel Geral
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-6">
        
        <div className="mb-2 border-b border-zinc-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-pulse"></span>
              Treinador de Redação
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Pratique dissertações argumentativas cronometradas sob os critérios da banca VUNESP.
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-red-400 text-xs font-medium bg-red-950/40 border border-red-600/30 px-3 py-1.5 rounded-lg">
            <BookOpen className="w-4 h-4 text-red-500" />
            <span>Padrão VUNESP</span>
          </div>
        </div>

        {sucesso && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-600/50 text-red-200 text-sm flex items-center justify-between">
            <span>Redação salva e gravada no banco com sucesso!</span>
            <span className="text-xs font-bold text-red-400">SALVO</span>
          </div>
        )}

        {!iniciou ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-zinc-200">Qual é o tema da redação de hoje?</h3>
            <form onSubmit={handleAdicionarTema} className="space-y-4">
              <input 
                type="text"
                required
                placeholder="Ex: Os desafios da cidadania digital na sociedade moderna..."
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors text-sm"
              />
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Definir Tema e Iniciar</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            
            <div className="bg-zinc-950 border border-red-600/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <div>
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-1 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                  <span>Podemos iniciar! Bom treino de redação.</span>
                </div>
                <p className="text-sm text-zinc-300">
                  <span className="text-zinc-500 font-medium">Tema:</span> {tema}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl">
                <div className="flex items-center gap-2 text-2xl font-mono font-bold text-red-400">
                  <Clock className="w-6 h-6 text-red-500 animate-pulse" />
                  <span>{formatarTempo(segundos)}</span>
                </div>
                <div className="flex items-center gap-1 border-l border-zinc-800 pl-4">
                  <button 
                    onClick={() => setAtivo(!ativo)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors cursor-pointer"
                    title={ativo ? "Pausar" : "Retomar"}
                  >
                    {ativo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => { setSegundos(0); setAtivo(false); }}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Zerar Cronômetro"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-200 text-sm uppercase tracking-wider">Escreva sua Redação</h3>
                <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-600/30 px-2.5 py-1 rounded-md">
                  {texto.trim().split(/\s+/).filter(Boolean).length} palavras
                </span>
              </div>
              <textarea 
                rows={14}
                placeholder="Comece a redigir seu texto dissertativo-argumentativo padrão VUNESP aqui..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors leading-relaxed resize-y text-sm"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => { setIniciou(false); setTexto(''); setSegundos(0); setAtivo(false); }}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Mudar Tema
                </button>
                <button 
                  onClick={handleSalvarRedacao}
                  disabled={carregando}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  {carregando ? 'Salvando...' : 'Salvar Redação'}
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}