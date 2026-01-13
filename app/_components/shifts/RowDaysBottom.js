export default function RowDaysBottom({ children, cellBg, onSelect, dateStr }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(dateStr)}
      className={`flex h-5 cursor-pointer items-center justify-center border-l border-slate-200 text-[0.6rem] hover:bg-blue-100 2xl:h-7 2xl:text-[0.85rem] ${cellBg} border-b border-slate-200`}
    >
      {children}
    </button>
  );
}
