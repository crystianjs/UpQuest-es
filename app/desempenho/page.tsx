'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../../lib/supabase';
import { BarChart3, TrendingUp, Award, AlertCircle } from 'lucide-react';

export default function DesempenhoPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<any[]>([]);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        
        // Exemplo de busca de dados específicos deste user_id na tabela do Supabase
        const { data, error } = await supabase
          .from('user_questions')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data) {
          setEstatisticas(data);
        }
      }
      setLoading(false);
    }
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-emerald-400 animate-pulse">Carregando seu ambiente exclusivo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Boas-vindas personalizado */}
        <div className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Painel de Desempenho</h1>
            <p className="text-sm text-slate-400 mt-1">
              Ambiente individual vinculado à conta: <span className="text-emerald-400 font-medium">{userEmail}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Foco: Escrevente TJSP (VUNESP)</span>
          </div>
        </div>

        {/* Cards de Métricas / Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Questões Resolvidas</span>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">0</p>
            <span className="text-xs text-slate-500 mt-1 block">Matérias do edital</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Taxa de Acerto Geral</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">0%</p>
            <span className="text-xs text-slate-500 mt-1 block">Baseado nas suas respostas</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Redações Praticadas</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">0</p>
            <span className="text-xs text-slate-500 mt-1 block">Padrão VUNESP</span>
          </div>
        </div>

        {/* Seção de Matérias do Edital TJSP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Progresso por Matéria do Edital</h2>
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Nenhum registro de questão encontrado para a sua conta ainda.</p>
            <p className="text-xs text-slate-500 mt-1">Utilize o menu de Registro de Questões para começar a alimentar seus gráficos.</p>
          </div>
        </div>
      </main>
    </div>
  );
}