'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { BookOpen, CheckCircle2, AlertCircle, Award, Filter } from 'lucide-react';

export default function DesempenhoPage() {
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [redacoesCount, setRedacoesCount] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState('TODAS');

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: qData, error: qError } = await supabase
          .from('user_questions')
          .select('*')
          .order('created_at', { ascending: false });

        if (qError) throw qError;
        if (qData) setQuestoes(qData);

        const { count, error: rError } = await supabase
          .from('redacoes')
          .select('*', { count: 'exact', head: true });

        if (!rError && count !== null) {
          setRedacoesCount(count);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do painel:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Cálculos de Métricas Gerais
  const totalResolvidas = questoes.reduce((acc, curr) => acc + (Number(curr.total_feitas) || 0), 0);
  const totalAcertos = questoes.reduce((acc, curr) => acc + (Number(curr.acertos) || 0), 0);
  const totalErros = questoes.reduce((acc, curr) => acc + (Number(curr.erros) || 0), 0);
  const taxaAcertoGeral = totalResolvidas > 0 ? Math.round((totalAcertos / totalResolvidas) * 100) : 0;

  // Agrupamento por Matéria
  const materiasMap: { [key: string]: { feitas: number; acertos: number; erros: number } } = {};
  questoes.forEach((q) => {
    if (!materiasMap[q.materia]) {
      materiasMap[q.materia] = { feitas: 0, acertos: 0, erros: 0 };
    }
    materiasMap[q.materia].feitas += Number(q.total_feitas) || 0;
    materiasMap[q.materia].acertos += Number(q.acertos) || 0;
    materiasMap[q.materia].erros += Number(q.erros) || 0;
  });

  // Lista de matérias únicas disponíveis nos registros para o filtro
  const materiasDisponiveis = Object.keys(materiasMap);

  // Filtragem dos dados se houver seleção específica
  const materiasFiltradas = filtroMateria === 'TODAS' 
    ? Object.entries(materiasMap) 
    : Object.entries(materiasMap).filter(([mat]) => mat === filtroMateria);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Cabeçalho do Painel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Desempenho</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Ambiente individual vinculado à conta: <span className="text-red-400">crystianjs09@gmail.com</span>
            </p>
          </div>
          <div className="bg-red-950/40 border border-red-600/40 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Foco: Escrevente TJSP (VUNESP)
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Questões Resolvidas</p>
            <h3 className="text-4xl font-black text-white">{carregando ? '...' : totalResolvidas}</h3>
            <p className="text-xs text-zinc-500 mt-2">Total acumulado no edital</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Taxa de Acerto Geral</p>
            <h3 className="text-4xl font-black text-white">{carregando ? '...' : `${taxaAcertoGeral}%`}</h3>
            <p className="text-xs text-zinc-500 mt-2">{totalAcertos} acertos / {totalErros} erros</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Redações Praticadas</p>
            <h3 className="text-4xl font-black text-white">{carregando ? '...' : redacoesCount}</h3>
            <p className="text-xs text-zinc-500 mt-2">Padrão VUNESP</p>
          </div>
        </div>

        {/* Seção de Progresso e Filtro por Matéria */}
        {Object.keys(materiasMap).length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl text-center py-16">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Nenhum registro de questão encontrado</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Utilize o menu de <span className="text-red-400">Registro de Questões</span> para começar a alimentar seus gráficos e acompanhar seu avanço.
            </p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-red-500" />
                Desempenho por Disciplina do Edital
              </h3>

              {/* Filtro por Matéria */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-red-500" />
                <select 
                  value={filtroMateria}
                  onChange={(e) => setFiltroMateria(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-600 transition-colors w-full md:w-64"
                >
                  <option value="TODAS">Todas as Disciplinas</option>
                  {materiasDisponiveis.map((mat) => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materiasFiltradas.map(([mat, stats]) => {
                const percentual = stats.feitas > 0 ? Math.round((stats.acertos / stats.feitas) * 100) : 0;
                return (
                  <div key={mat} className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-zinc-200">{mat}</span>
                      <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-600/30 px-2.5 py-1 rounded-md">
                        {percentual}% de acerto
                      </span>
                    </div>
                    
                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentual}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Resolvidas: <strong className="text-zinc-200">{stats.feitas}</strong></span>
                      <span>Acertos: <strong className="text-emerald-400">{stats.acertos}</strong></span>
                      <span>Erros: <strong className="text-red-500">{stats.erros}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}