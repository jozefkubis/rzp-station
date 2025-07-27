export default function RowDays({ children, cellBg, onSelect, dateStr }) {
  return (
    <div className="flex flex-col border-b border-slate-200">
      <button
        type="button"
        onClick={() => onSelect(dateStr)}
        className={`flex h-9 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg}`}
      >
        {children}
      </button>
      <button
        type="button"
        onClick={() => onSelect(dateStr)}
        className={`flex h-9 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg}`}
      >
        {children}
      </button>
    </div>
  );
}
