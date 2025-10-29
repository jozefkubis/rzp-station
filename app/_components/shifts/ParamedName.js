export default function ParamedName({ children }) {
  return (
    <div className="h-6 md:h-9 sticky left-0 z-20 flex items-center justify-center border-b border-l border-slate-200 bg-white px-2 py-1 text-[0.7rem] md:text-[0.9rem] text-sm font-bold text-primary-700">
      {children || "--- bez mena ---"}
    </div>
  );
}
