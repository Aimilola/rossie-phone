import React, { useState } from 'react';

const apps = [
  { name: 'WhatsApp', icon: '💬', color: '#25D366', id: 'whatsapp' },
  { name: 'Instagram', icon: '📸', color: '#D9468D', id: 'instagram' }
];

export default function App() {
  const [activeApp, setActiveApp] = useState(null);

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
      </header>

      <section className="app-grid">
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
          <h2>
            {activeApp === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
          </h2>
          <p>
            {activeApp === 'whatsapp'
              ? 'Tus conversaciones aparecerán aquí.'
              : 'Tu feed y tus mensajes aparecerán aquí.'}
          </p>
          <p className="coming">Conectando tu mundo digital ✨</p>
        </section>
      )}

      <footer>ROSSI PHONE · 2026</footer>
    </main>
  );
}
