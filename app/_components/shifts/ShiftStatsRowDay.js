export default function ShiftStatsRowDay({ children, cellBg, rowBg }) {
  return (
    <button
      type="button"
      className={`flex h-14 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg} ${rowBg} border-b border-slate-200 text-[0.9rem]`}
    >
      {children}
    </button>
  );
}
