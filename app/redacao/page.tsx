'use client'
import { useState } from 'react'
import { PlusCircle, BookOpen, CheckCircle2 } from 'lucide-react'

// Dados mockados de exemplo alinhados ao estilo VUNESP
const redacoesIniciais = [
  { id: 1, tema: 'Os limites da inteligência artificial na automação do trabalho', nota: 8.5, status: 'Treinado', data: '2026-09-10', anotacao: 'Focar mais em coesão interparágrafos. Bom uso da introdução crítica.' },
  { id: 2, tema: 'Cidadania digital e os desafios da segurança da informação', nota: 9.0, status: 'Treinado', data: '2026-09-04', anotacao: 'Argumentação sólida com menção à LGPD e Constituição.' },
]

export default function RedacaoPage() {
  const [redacoes, setRedacoes] = useState(redacoesIniciais)
  const [modalAberto, setModalAberto] = useState(false)

  // Estados do formulário de nova redação
  const [novoTema, setNovoTema] = useState('')
  const [novaNota, setNovaNota] = useState('')
  const [novaAnotacao, setNovaAnotacao] = useState('')

  const cadastrarRedacao = (e: React.FormEvent) => {
    e.preventDefault()
    const nova = {
      id: redacoes.length + 1,
      tema: novoTema,
      nota: Number(novaNota) || 0,
      status: 'Treinado',
      data: new Date().toISOString().split('T')[0],
      anotacao: novaAnotacao
    }
    setRedacoes([nova, ...redacoes])
    setNovoTema('')
    setNovaNota('')
    setNovaAnotacao('')
    setModalAberto(false)
  }

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
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
          >
            <PlusCircle size={18} /> Nova Redação Treinada
          </button>
        </div>

        {/* Cards de Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400">Total de Redações Praticadas</span>
            <div className="text-3xl font-bold text-emerald-400 mt-1">{redacoes.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400">Média Geral de Notas</span>
            <div className="text-3xl font-bold text-sky-400 mt-1">
              {(redacoes.reduce((acc, r) => acc + r.nota, 0) / (redacoes.length || 1)).toFixed(1)} <span className="text-sm text-slate-500">/ 10</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400">Critério VUNESP Alvo</span>
            <div className="text-sm font-semibold text-purple-400 mt-2">Tema, Estrutura e Expressão</div>
          </div>
        </div>

        {/* Lista de Redações Cadastradas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-400" /> Histórico de Temas Treinados
          </h2>

          <div className="space-y-4">
            {redacoes.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">{item.data}</span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{item.status}</span>
                  </div>
                  <h3 className="font-medium text-white text-base">{item.tema}</h3>
                  <p className="text-sm text-slate-400 italic">"{item.anotacao}"</p>
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Nota Atribuída</span>
                    <span className="text-xl font-bold text-emerald-400">{item.nota.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal de Cadastro de Nova Redação */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-lg w-full shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-white">Adicionar Novo Treino de Redação</h2>
            <form onSubmit={cadastrarRedacao} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tema da Redação</label>
                <input type="text" value={novoTema} onChange={e => setNovoTema(e.target.value)} required
                  placeholder="Ex: Os impactos da desinformação nas redes sociais..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nota Obtida / Autoavaliação (0 a 10)</label>
                <input type="number" step="0.5" max="10" min="0" value={novaNota} onChange={e => setNovaNota(e.target.value)} required
                  placeholder="Ex: 8.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Anotações, Esqueleto ou Erros de Gramática</label>
                <textarea value={novaAnotacao} onChange={e => setNovaAnotacao(e.target.value)} rows={3}
                  placeholder="Ex: Cuidado com a pontuação antes de conjunções adversativas..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancelar</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-white font-medium text-sm">Salvar Redação</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}