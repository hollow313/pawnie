import useSWR from 'swr';
import axios from 'axios';
const fetcher = (url:string)=>axios.get(url).then(r=>r.data);

export default function Feed(){
  const { data } = useSWR('/api/feed', fetcher);
  return (<div className="container">
    <h1>Fil d'actualité</h1>
    <div>
      {(data?.items||[]).map((it:any)=>(
        <div key={it.id} className="card">
          <div style={{opacity:.6, fontSize:12, textTransform:'uppercase'}}>{it.type}</div>
          <b>{it.title}</b>
          {it.description && <div>{it.description}</div>}
        </div>
      ))}
    </div>
  </div>);
}
