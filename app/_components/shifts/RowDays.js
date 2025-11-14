export default function RowDays({ children, cellBg, onSelect, dateStr }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(dateStr)}
      className={`flex h-5 cursor-pointer items-center justify-center border-l border-slate-200 text-[0.65rem] hover:bg-blue-100 2xl:h-7 2xl:text-[0.9rem] ${cellBg} border-b border-slate-200`}
    >
      {children}
    </button>
  );
}
