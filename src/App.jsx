import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import WhatsApp from './WhatsApp';

const apps = [
  { name: 'WhatsApp', icon: '💬', color: '#25D366', id: 'whatsapp' },
  { name: 'Instagram', icon: '📸', color: '#D9468D', id: 'instagram' }
];

export default function App() {
  const [activeApp, setActiveApp] = useState(null);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setError(error.message);
      setSession(data?.session ?? null);
      setLoading(false);
    });const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => setSession(currentSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) setError(error.message);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    setActiveApp(null);
  }

  if (loading) {
    return <main className="phone">Cargando Rossi Phone...</main>;
  }if (!session) {
    return (
      <main className="phone">
        <div className="status">
          <span>9:41</span>
          <span>● ● ●  ▰</span>
        </div>
        <header className="welcome">
          <p>MI ESPACIO PERSONAL</p>
          <h1>Hola, Rossi ✨</h1>
          <span>Entra en tu mundo digital.</span>
        </header>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12, padding: 20 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {error && <p role="alert">{error}</p>}
        </form>
        <footer>ROSSI PHONE · 2026</footer>
      </main>
    );
  }

  return (
    <main className="phone">
      <div className="status">
        <span>9:41</span>
        <span>● ● ●  ▰</span>
      </div>

      <header className="welcome">
        <p>MI ESPACIO PERSONAL</p>
        <h1>Hola, Rossi ✨</h1>
        <span>Tu mundo, tus conversaciones.</span>
      </header><section className="app-grid">
        {apps.map(app => (
          <button
            className="app-icon"
            key={app.id}
            onClick={() => setActiveApp(app.id)}
          >
            <span style={{ background: app.color }}>
              {app.icon}
            </span>
            {app.name}
          </button>
        ))}
      </section>

      {activeApp && (
        <section className="app-window">
          <button
            className="back"
            onClick={() => setActiveApp(null)}
          >
            ← Volver
          </button>
          
         {activeApp === 'whatsapp' ? (
  <WhatsApp />
) : (
  <>
    <h2>Instagram</h2>
    <p>Tu feed aparecerá aquí.</p>
    <p className="coming">Conectando tu mundo digital ✨</p>
  </>
)}
        </section>
      )}

      <button onClick={handleLogout}>Cerrar sesión</button>
      <footer>ROSSI PHONE · 2026</footer>
    </main>
  );
}
