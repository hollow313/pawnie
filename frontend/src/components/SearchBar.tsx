import React, { useEffect, useMemo, useRef, useState } from "react";
import { geocode, GeocodeResult } from "../services/api";

type Props = {
  onSelect: (item: GeocodeResult) => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({ onSelect, placeholder }) => {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const debTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setItems([]);
      setOpen(false);
      return;
    }
    if (debTimer.current) window.clearTimeout(debTimer.current);
    debTimer.current = window.setTimeout(async () => {
      try {
        const res = await geocode(q.trim());
        setItems(res);
        setOpen(true);
      } catch {
        setItems([]);
        setOpen(false);
      }
    }, 300);
    return () => {
      if (debTimer.current) window.clearTimeout(debTimer.current);
    };
  }, [q]);

  const list = useMemo(() => items.slice(0, 8), [items]);

  return (
    <div className="relative w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => list.length && setOpen(true)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pawnie-500"
        placeholder={placeholder || "Rechercher une adresse ou une ville…"}
      />
      {open && list.length > 0 && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
          {list.map((it, idx) => (
            <button
              key={`${it.lat}-${it.lng}-${idx}`}
              onClick={() => {
                onSelect(it);
                setOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              {it.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
