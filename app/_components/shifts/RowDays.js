export default function RowDays({ children, cellBg, onSelect, dateStr }) {
  return (
    <div className="flex flex-col text-[0.9rem]">
      <button
        type="button"
        onClick={() => onSelect(dateStr)}
        className={`flex h-7 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg} border-b border-slate-200`}
      >
        {children}
      </button>
      <button
        type="button"
        className={`flex h-7 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg} border-b border-slate-200`}
      ></button>
    </div>
  );
}
