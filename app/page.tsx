'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, BookOpen, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Importa a conexão com o Supabase

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Validação real direto no Banco de Dados do Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error('Usuário não encontrado ou senha incorreta no banco de dados.');
      }

      if (data.session) {
        // Se estiver cadastrado e autenticado, vai para o painel de desempenho
        router.push('/desempenho');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao tentar realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">UpQuest-es</h1>
          <p className="text-sm text-slate-400 mt-2">
            Acesso Restrito - Concurso TJSP (VUNESP)
          </p>
        </div>

        {/* Mensagem de Erro caso não esteja no banco */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">E-mail Cadastrado</label>
            <input 
              type="email" 
              required
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? 'Validando acesso...' : 'Entrar na Plataforma'}</span>
          </button>
        </form>

        {/* Rodapé dos Módulos */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <span>Desempenho</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Redação</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Questões TJSP</span>
          </div>
        </div>

      </div>
    </div>
  );
}