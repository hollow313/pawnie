type Props = { item: any; onFav?: (id:number)=>void; isFav?: boolean; onMessage?: (id:number)=>void; }
export default function ListingCard({ item, onFav, isFav, onMessage }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <img src={item.photo_url || "/placeholder.svg"} alt="" className="w-full h-44 object-cover"/>
      <div className="p-3">
        <div className="text-sm text-slate-500">{item.type === "sale" ? "Vente" : "Saillie"} · {item.location || "—"}</div>
        <div className="font-semibold text-lg">{item.title}</div>
        <div className="text-paw-700 font-bold">{item.price ? `${item.price.toFixed(0)}€` : "—"}</div>
        <div className="mt-2 flex justify-between gap-2">
          {onMessage && <button onClick={()=>onMessage(item.id)} className="text-sm underline">Contacter</button>}
          {onFav && (
            <button onClick={()=>onFav(item.id)} className={`text-sm ${isFav ? "text-paw-700" : "text-slate-600"}`}>
              {isFav ? "★ Favori" : "☆ Favori"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}