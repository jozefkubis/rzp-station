export default function ParamedName({ children }) {
  return (
    <div className="sticky left-0 z-20 flex items-center justify-center border-b border-l border-slate-200 bg-white px-2 py-1 text-[1rem] text-sm font-bold text-primary-700">
      {children || "--- bez mena ---"}
    </div>
  );
}
