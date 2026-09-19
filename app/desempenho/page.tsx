'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { BarChart3, Award, CheckCircle2, XCircle, FileText } from 'lucide-react';

interface QuestaoRegistro {
  id: string;
  materia: string;
  total_feitas: number;
  acertos: number;
  erros: number;
  created_at: string;
}

interface RedacaoRegistro {
  id: string;
  tema: string;
  texto: string;
  created_at: string;
}

export default function DesempenhoPage() {
  const router = useRouter();
  const [questoes, setQuestoes] = useState<QuestaoRegistro[]>([]);
  const [redacoes, setRedacoes] = useState<RedacaoRegistro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const userId = session.user.id;

      // Buscar questões do utilizador logado
      const { data: qData } = await supabase
        .from('user_questions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Buscar redações do utilizador logado
      const { data: rData } = await supabase
        .from('redaccoes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (qData) setQuestoes(qData);
      if (rData) setRedacoes(rData);
      setLoading(false);
    }

    carregarDados();
  }, [router]);

  // Totais gerais
  const totalFeitasGeral = questoes.reduce((acc, q) => acc + q.total_feitas, 0);
  const totalAcertosGeral = questoes.reduce((acc, q) => acc + q.acertos, 0);
  const aproveitamentoGeral = totalFeitasGeral > 0 ? ((totalAcertosGeral / totalFeitasGeral) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-500" />
              Desempenho & Gráficos — UPQUESTOES
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Acompanhe a sua evolução para o concurso do TJSP (VUNESP).
            </p>
          </div>
          <div className="bg-red-950/30 border border-red-600/30 px-4 py-2 rounded-xl text-xs font-semibold text-red-400">
            Conta Ativa Isolada
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500 text-sm">A carregar métricas...</div>
        ) : (
          <>
            {/* Cards de Métricas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total de Questões</p>
                <h3 className="text-3xl font-black text-white mt-2">{totalFeitasGeral}</h3>
                <span className="text-xs text-zinc-500 mt-1 block">Resolvidas na plataforma</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Taxa de Acerto</p>
                <h3 className="text-3xl font-black text-white mt-2">{aproveitamento%}%</h3>
                <span className="text-xs text-zinc-500 mt-1 block">{totalAcertosGeral} acertos corretos</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Redações Guardadas</p>
                <h3 className="text-3xl font-black text-white mt-2">{redacoes.length}</h3>
                <span className="text-xs text-zinc-500 mt-1 block">Treinos VUNESP realizados</span>
              </div>

            </div>

            {/* Listas Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Histórico de Questões */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-500" />
                  Últimos Registos de Questões
                </h2>

                {questoes.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">Nenhum registo de questão encontrado ainda.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {questoes.map((q) => (
                      <div key={q.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-bold text-white">{q.materia}</h4>
                          <span className="text-[10px] text-zinc-500">{new Date(q.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="bg-zinc-800 px-2.5 py-1 rounded-lg text-zinc-300">Total: {q.total_feitas}</span>
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" />{q.acertos}</span>
                          <span className="text-red-400 flex items-center gap-1 font-semibold"><XCircle className="w-3.5 h-3.5" />{q.erros}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Histórico de Redações */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  Redações Treinadas
                </h2>

                {redacoes.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">Nenhuma redação guardada ainda.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {redacoes.map((r) => (
                      <div key={r.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{r.tema}</h4>
                          <span className="text-[10px] text-zinc-500 shrink-0">{new Date(r.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2">{r.texto}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}