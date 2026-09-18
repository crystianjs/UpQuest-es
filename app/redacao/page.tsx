'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, BookOpen, CheckCircle2 } from 'lucide-react';

export default function RedacaoPage() {
  const router = useRouter();
  const [tema, setTema] = useState('');
  const [texto, setTexto] = useState('');
  
  // Estados do Cronômetro
  const [iniciou, setIniciou] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);

  // Efeito do cronômetro
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

  // Formatar tempo (MM:SS)
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Botão de Voltar e Cabeçalho */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/desempenho')}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel</span>
          </button>
          
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <BookOpen className="w-4 h-4" />
            <span>Treino de Redação Padrão VUNESP</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Treinador de Redação</h1>

        {/* Bloco 1: Inserir Tema */}
        {!iniciou ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Qual é o tema da redação de hoje?</h2>
            <form onSubmit={handleAdicionarTema} className="space-y-4">
              <input 
                type="text"
                required
                placeholder="Ex: Os desafios da cidadania digital na sociedade moderna..."
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Definir Tema e Iniciar</span>
              </button>
            </form>
          </div>
        ) : (
          /* Bloco 2: Cronômetro Ativo & Área de Texto */
          <div className="space-y-6">
            
            {/* Barra de Status e Cronômetro ("Podemos iniciar") */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Podemos iniciar! Bom treino de redação.</span>
                </div>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500 font-medium">Tema:</span> {tema}
                </p>
              </div>

              {/* Visor do Cronômetro */}
              <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl">
                <div className="flex items-center gap-2 text-2xl font-mono font-bold text-emerald-400">
                  <Clock className="w-6 h-6 text-emerald-400 animate-pulse" />
                  <span>{formatarTempo(segundos)}</span>
                </div>
                <div className="flex items-center gap-1 border-l border-slate-800 pl-4">
                  <button 
                    onClick={() => setAtivo(!ativo)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                    title={ativo ? "Pausar" : "Retomar"}
                  >
                    {ativo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => { setSegundos(0); setAtivo(false); }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Zerar Cronômetro"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor de Texto da Redação */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-200">Escreva sua Redação</h3>
                <span className="text-xs text-slate-400">
                  {texto.trim().split(/\s+/).filter(Boolean).length} palavras
                </span>
              </div>
              <textarea 
                rows={15}
                placeholder="Comece a redigir seu texto dissertativo-argumentativo padrão VUNESP aqui..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed resize-y"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => { setIniciou(false); setTexto(''); setSegundos(0); setAtivo(false); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Mudar Tema
                </button>
                <button 
                  onClick={() => alert('Redação salva com sucesso!')}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg cursor-pointer"
                >
                  Salvar Redação
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}