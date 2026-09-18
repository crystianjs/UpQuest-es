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
    <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-10 font-sans selection:bg-red-600 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Botão de Voltar e Cabeçalho */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/desempenho')}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel Geral</span>
          </button>
          
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium bg-red-950/40 border border-red-600/30 px-3 py-1.5 rounded-lg">
            <BookOpen className="w-4 h-4 text-red-500" />
            <span>Treino de Redação Padrão VUNESP</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">Treinador de Redação</h1>

        {/* Bloco 1: Inserir Tema */}
        {!iniciou ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Qual é o tema da redação de hoje?</h2>
            <form onSubmit={handleAdicionarTema} className="space-y-4">
              <input 
                type="text"
                required
                placeholder="Ex: Os desafios da cidadania digital na sociedade moderna..."
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
              />
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Definir Tema e Iniciar</span>
              </button>
            </form>
          </div>
        ) : (
          /* Bloco 2: Cronômetro Ativo & Área de Texto */
          <div className="space-y-6">
            
            {/* Barra de Status e Cronômetro */}
            <div className="bg-zinc-950 border border-red-600/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <div>
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                  <span>Podemos iniciar! Bom treino de redação.</span>
                </div>
                <p className="text-sm text-zinc-300">
                  <span className="text-zinc-500 font-medium">Tema:</span> {tema}
                </p>
              </div>

              {/* Visor do Cronômetro */}
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

            {/* Editor de Texto da Redação */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-200">Escreva sua Redação</h3>
                <span className="text-xs text-zinc-400">
                  {texto.trim().split(/\s+/).filter(Boolean).length} palavras
                </span>
              </div>
              <textarea 
                rows={15}
                placeholder="Comece a redigir seu texto dissertativo-argumentativo padrão VUNESP aqui..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors leading-relaxed resize-y"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => { setIniciou(false); setTexto(''); setSegundos(0); setAtivo(false); }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Mudar Tema
                </button>
                <button 
                  onClick={() => alert('Redação salva com sucesso!')}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
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