"use client";

import { useState, FormEvent } from 'react';
import { PlusCircle, BookOpen, CheckCircle2 } from 'lucide-react';

// Dados mockados de exemplo alinhados ao estilo VUNESP
const redacoesIniciais = [
  { id: 1, tema: 'Os limites da inteligência artificial na automação do trabalho', nota: 8.5, status: 'Treinado', data: '2026-09-10', anotacao: 'Focar mais em coesão interparágrafos e na citação inicial.' },
  { id: 2, tema: 'Cidadania digital e os desafios da segurança da informação', nota: 9.0, status: 'Treinado', data: '2026-09-04', anotacao: 'Argumentação sólida com menção à LGPD bem encaixada.' }
];

export default function RedacaoPage() {
  const [redacoes, setRedacoes] = useState(redacoesIniciais);
  const [modalAberto, setModalAberto] = useState(false);

  // Estados do formulário de nova redação
  const [novoTema, setNovoTema] = useState('');
  const [novaNota, setNovaNota] = useState('');
  const [novaAnotacao, setNovaAnotacao] = useState('');

  const cadastrarRedacao = (e: FormEvent) => {
    e.preventDefault();
    const nova = {
      id: redacoes.length + 1,
      tema: novoTema,
      nota: Number(novaNota) || 0,
      status: 'Treinado',
      data: new Date().toISOString().split('T')[0],
      anotacao: novaAnotacao
    };
    setRedacoes([nova, ...redacoes]);
    setNovoTema('');
    setNovaNota('');
    setNovaAnotacao('');
    setModalAberto(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho e Botão de Novo Treino */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Treinamento de Redação - Padrão VUNESP</h1>
            <p className="text-sm text-slate-400">Gerencie seus temas dissertativo-argumentativos e evolução de notas (TJSP)</p>
          </div>
          <button 
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <PlusCircle className="w-5 h-5" /> Adicionar Treino
          </button>
        </div>

        {/* Listagem de Redações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redacoes.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-1 rounded">
                  {item.status}
                </span>
                <span className="text-sm font-semibold text-slate-400">Nota: <strong className="text-emerald-400 text-base">{item.nota}</strong></span>
              </div>
              <h3 className="font-semibold text-lg text-slate-100">{item.tema}</h3>
              <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded border border-slate-800/60">
                <strong>Anotação/Esqueleto:</strong> {item.anotacao}
              </p>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800">
                <span>Data: {item.data}</span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> Concluído
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal / Formulário de Cadastro */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold mb-4 text-white">Adicionar Novo Treino de Redação</h2>
              <form onSubmit={cadastrarRedacao} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tema da Redação</label>
                  <input 
                    type="text" 
                    value={novoTema} 
                    onChange={(e) => setNovoTema(e.target.value)}
                    placeholder="Ex: Os impactos da desinformação nas redes sociais..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nota Obtida / Autoavaliação</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    max="10" 
                    min="0" 
                    value={novaNota} 
                    onChange={(e) => setNovaNota(e.target.value)}
                    placeholder="Ex: 8.5" 
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Anotações, Esqueleto ou Erros de Gramática</label>
                  <textarea 
                    value={novaAnotacao} 
                    onChange={(e) => setNovaAnotacao(e.target.value)}
                    placeholder="Ex: Cuidado com a pontuação antes de conjunções adversativas." 
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 h-24"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setModalAberto(false)} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-medium transition"
                  >
                    Salvar Treino
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}