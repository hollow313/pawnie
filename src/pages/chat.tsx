import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
let socket: any;

export default function Chat(){
  const [messages, setMessages] = useState<any[]>([]);
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  useEffect(()=>{
    socket = io('/', { path: '/socket.io' });
    socket.on('message:new', (m:any)=> setMessages((s)=>[...s, m]));
    socket.on('message:sent', (m:any)=> setMessages((s)=>[...s, m]));
    return ()=> socket?.disconnect();
  },[]);
  async function send(){
    await axios.post('/api/messages/send', { to, content });
    setContent('');
  }
  return (<div className="container">
    <h1>Chat</h1>
    <div className="card" style={{maxWidth:640}}>
      <input className="input" placeholder="ID destinataire" value={to} onChange={e=>setTo(e.target.value)} /><br/>
      <div style={{display:'flex', gap:8}}>
        <input className="input" style={{flex:1}} value={content} onChange={e=>setContent(e.target.value)} />
        <button className="btn" onClick={send}>Envoyer</button>
      </div>
    </div>
    <div className="card" style={{maxHeight:300, overflow:'auto'}}>
      {messages.map((m:any)=>(<div key={m.id}><b>{m.senderId.slice(0,6)}:</b> {m.content}</div>))}
    </div>
  </div>);
}
