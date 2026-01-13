export default function ParamedName({ children }) {
  return (
    <div className="flex h-6 items-center justify-center border-b border-l border-t border-slate-200 bg-white px-2 py-1 text-[0.6rem] text-sm font-bold text-primary-700 md:text-[0.6rem] 2xl:h-9 2xl:text-[0.85rem]">
      {children || "--- bez mena ---"}
    </div>
  );
}
