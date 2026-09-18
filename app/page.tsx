import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-4 text-emerald-400">UpQuest-es</h1>
      <p className="text-lg text-slate-300 mb-8 text-center max-w-lg">
        Sua plataforma de estudos e simulados focada na sua aprovação.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/redacao" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Treinar Redação
        </Link>
      </div>
    </div>
  );
}