'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '@/lib/supabase';
import { getUsuarioAtivo } from '@/lib/auth';
import { CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

const MATERIAS_TJSP = [
  'Língua Portuguesa',
  'Direito Penal',
  'Direito Processual Penal',
  'Direito Processual Civil',
  'Direito Constitucional',
  'Direito Administrativo',
  'Normas da Corregedoria',
  'Matemática',
  'Raciocínio Lógico',
  'Informática',
  'Atualidades',
  'Estatuto da Pessoa com Deficiência'
];

export default function QuestoesPage() {
  const [materia, setMateria] = useState(MATERIAS_TJSP[0]);
  const [totalFeitas, setTotalFeitas] = useState('');
  const [acertos, setAcertos] = useState('');
  const [erros, setErros] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const usuarioAtual = getUsuarioAtivo();

  async function handleSalvarQuestoes(e: React.FormEvent) {
    e.preventDefault();
    const feitasNum = parseInt(totalFeitas) || 0;
    const acertosNum = parseInt(acertos) || 0;
    const errosNum = parseInt(erros) || 0;

    if (feitasNum <= 0) {
      setErro('Insira um número válido de questões feitas.');
      return;
    }

    if (acertosNum + errosNum !== feitasNum) {
      setErro('A soma de acertos e erros deve ser igual ao total de questões feitas.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso(false);

    try {
      const { error } = await supabase.from('user_questions').insert([
        {
          materia: materia,
          total_feitas: feitasNum,
          acertos: acertosNum,
          erros: errosNum,
          user_email: usuarioAtual
        }
      ]);

      if (error) throw error;

      setSucesso(true);
      setTotalFeitas('');
      setAcertos('');
      setErros('');
    } catch (err: any) {
      console.error('Erro ao guardar questões:', err);
      setErro('Erro ao guardar o registo de questões.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-500" />
            Registo de Questões — UPQUESTOS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Registar progresso para a conta: <span className="text-red-400 font-semibold">{usuarioAtual}</span>
          </p>
        </div>

        {sucesso && (
          <div className="bg-emerald-950/40 border border-emerald-600/40 p-4 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Registo de questões guardado com sucesso!
          </div>
        )}

        {erro && (
          <div className="bg-red-950/40 border border-red-600/40 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {erro}
          </div>
        )}

        <form onSubmit={handleSalvarQuestoes} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Disciplina / Matéria</label>
            <select 
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
            >
              {MATERIAS_TJSP.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Feitas</label>
              <input 
                type="number" 
                min="1"
                value={totalFeitas}
                onChange={(e) => setTotalFeitas(e.target.value)}
                placeholder="Ex: 20"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Acertos</label>
              <input 
                type="number" 
                min="0"
                value={acertos}
                onChange={(e) => setAcertos(e.target.value)}
                placeholder="Ex: 16"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Erros</label>
              <input 
                type="number" 
                min="0"
                value={erros}
                onChange={(e) => setErros(e.target.value)}
                placeholder="Ex: 4"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={salvando}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 cursor-pointer"
          >
            {salvando ? 'A guardar...' : 'Guardar Registo de Questões'}
          </button>

        </form>

      </main>
    </div>
  );
}