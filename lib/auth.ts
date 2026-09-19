// lib/auth.ts
export function getUsuarioAtivo(): string {
  if (typeof window === 'undefined') return 'crystianjs09@gmail.com';
  return localStorage.getItem('upquest_usuario') || 'crystianjs09@gmail.com';
}

export function setUsuarioAtivo(email: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('upquest_usuario', email);
    window.location.reload(); // Recarrega para atualizar os dados do painel
  }
}