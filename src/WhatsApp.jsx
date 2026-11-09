import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function WhatsApp() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newChat, setNewChat] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadChats() {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setChats(data || []);
    setLoading(false);
  }

  async function loadMessages(chat) {
    setSelected(chat);
    setError('');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: true });

    if (error) setError(error.message);
    else setMessages(data || []);
  }

  async function createChat(e) {
    e.preventDefault();
    if (!newChat.trim()) return;
    setError('');

    const { data, error } = await supabase
      .from('chats')
      .insert({
        name: newChat.trim(),
        chat_type: 'private'
      })
      .select()
      .single();

    if (error) setError(error.message);
    else {
      setNewChat('');
      await loadChats();
      loadMessages(data);
    }
  }async function sendMessage(e) {
    e.preventDefault();
    if (!message.trim() || !selected) return;
    setError('');

    const { error } = await supabase
      .from('messages')
      .insert({
        chat_id: selected.id,
        sender: 'Rossi',
        content: message.trim(),
        message_type: 'text'
      });

    if (error) setError(error.message);
    else {
      setMessage('');
      await loadMessages(selected);
    }
  }

 useEffect(() => {
  loadChats();

  const channel = supabase
    .channel('whatsapp-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chats' },
      () => loadChats()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages' },
      () => {
        if (selected) loadMessages(selected);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selected]);

  return (
    <section style={{ padding: 16 }}>
      {selected ? (
        <>
          <button onClick={() => setSelected(null)}>← Conversaciones</button>
          <h2>{selected.name}</h2>
          <div style={{ minHeight: 250, maxHeight: 350, overflowY: 'auto' }}>
            {messages.map(m => (
              <p key={m.id}>
                <b>{m.sender}:</b> {m.content}
              </p>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..." />
            <button type="submit">Enviar</button>
          </form>
        </>
      ) : (
        <>
          <h2>WhatsApp</h2>
          <form onSubmit={createChat}>
            <input value={newChat} onChange={e => setNewChat(e.target.value)}
              placeholder="Nombre de la conversación..." />
            <button type="submit">Crear</button>
          </form>
          {loading ? <p>Cargando...</p> : chats.map(chat => (
            <button key={chat.id} onClick={() => loadMessages(chat)}
              style={{ display: 'block', padding: 12, width: '100%', textAlign: 'left' }}>
              💬 {chat.name}
            </button>
          ))}
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
}
