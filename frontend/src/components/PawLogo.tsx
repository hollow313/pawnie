export default function PawLogo({ size=28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <circle cx="20" cy="18" r="8"/><circle cx="44" cy="18" r="8"/>
        <circle cx="16" cy="36" r="8"/><circle cx="48" cy="36" r="8"/>
        <path d="M20,50 C20,40 44,40 44,50 C44,56 20,56 20,50 Z"/>
      </svg>
      <span className="text-xl font-bold">Pawnie</span>
    </div>
  );
}