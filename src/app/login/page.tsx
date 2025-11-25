'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, code }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || 'Logowanie nieudane');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Logowanie Administratora</h1>
        {error && <p className="text-destructive text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Nazwa użytkownika</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Kod TOTP</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-primary-foreground bg-primary rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Zaloguj
          </button>
        </form>
      </div>
    </div>
  );
}
