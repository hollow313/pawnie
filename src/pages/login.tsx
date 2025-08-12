import { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [email,setEmail]=useState('demo@pawnie.local');
  const [password,setPassword]=useState('demo1234');
  const [error,setError]=useState<string|undefined>();
  async function submit(e:any){
    e.preventDefault();
    try{ await axios.post('/api/auth/login',{email,password}); window.location.href='/feed'; }
    catch(err:any){ setError(err?.response?.data?.message||'Erreur'); }
  }
  return (<div className="container">
    <h1>Connexion</h1>
    {error && <p style={{color:'crimson'}}>{error}</p>}
    <form onSubmit={submit} className="card" style={{maxWidth:420}}>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><br/>
      <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)}/><br/>
      <button className="btn">Se connecter</button>
    </form>
  </div>);
}
