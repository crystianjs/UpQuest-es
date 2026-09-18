import './globals.css';

export const metadata = {
  title: 'UpQuest-es',
  description: 'Sua plataforma de estudos e simulados.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-white min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}