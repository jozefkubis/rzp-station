export default function ParamedName({ children }) {
  return (
    <div className="sticky left-0 z-20 flex h-6 items-center justify-center border-b border-l border-slate-200 bg-white px-2 py-1 text-[0.7rem] text-sm font-bold text-primary-700 md:text-[0.65rem] 2xl:h-9 2xl:text-[0.9rem]">
      {children || "--- bez mena ---"}
    </div>
  );
}
