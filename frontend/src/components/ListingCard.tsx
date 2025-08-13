import { Link } from "react-router-dom";

export default function ListingCard({ item, onFav, isFav, onMessage, isOwner=false }:{
  item:any; onFav:(id:number)=>void; isFav:boolean; onMessage:(id:number)=>void; isOwner?:boolean;
}) {
  const img = item.images?.[0] || "/placeholder.svg";
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <img src={img} className="w-full h-40 object-cover" />
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{item.title}</h3>
          <div className="text-paw-700 font-semibold">{item.price?.toFixed?.(2)} €</div>
        </div>
        <div className="text-xs text-slate-600">{item.species} • {item.type}</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>onFav(item.id)} className={`px-2 py-1 border rounded ${isFav?"bg-paw-100":""}`}>❤️ Favori</button>
          {!isOwner ? (
            <button onClick={()=>onMessage(item.id)} className="px-2 py-1 border rounded">Contacter</button>
          ) : (
            <Link to={`/edit-listing/${item.id}`} className="px-2 py-1 border rounded">Éditer</Link>
          )}
        </div>
      </div>
    </div>
  )
}
