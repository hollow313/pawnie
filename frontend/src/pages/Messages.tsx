import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";

export default function Messages() {
  const [threads, setThreads] = useState<any[]>([]);
  const [active, setActive] = useState<number|undefined>(undefined);
  const [messages, setMessages] = useState<any[]>([]);
  const [body, setBody] = useState("");

  const loadThreads = async () => { const { data } = await api.get("/messages/threads"); setThreads(data); };
  const loadMessages = async (id:number) => { const { data } = await api.get(`/messages/thread/${id}`); setMessages(data); };

  useEffect(()=>{ loadThreads(); }, []);
  useEffect(()=>{ if(active) loadMessages(active); const t=setInterval(()=>{ if(active) loadMessages(active); }, 3000); return ()=>clearInterval(t); }, [active]);

  const send = async (e:any) => {
    e.preventDefault();
    if (!active || !body.trim()) return;
    const { data } = await api.post("/messages/send", { thread_id: active, body });
    setBody(""); setMessages(m=>[...m, data]);
  };

  return (
    <div><Header />
      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">
        <aside className="bg-white border rounded-xl p-2">
          <div className="font-semibold mb-2">Conversations</div>
          <ul className="space-y-1">
            {threads.map(t=>(
              <li key={t.id}>
                <button onClick={()=>setActive(t.id)} className={`w-full text-left px-3 py-2 rounded-lg ${active===t.id?'bg-paw-100':''}`}>Thread #{t.id}</button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="bg-white border rounded-xl p-2 md:col-span-2 flex flex-col">
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {messages.map(m=>(
              <div key={m.id} className="p-2 rounded-lg bg-slate-100">{m.body}</div>
            ))}
          </div>
          {active && (
            <form onSubmit={send} className="p-2 border-t flex gap-2">
              <input className="flex-1 border rounded-lg p-2" placeholder="Votre message..." value={body} onChange={e=>setBody(e.target.value)}/>
              <button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Envoyer</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}